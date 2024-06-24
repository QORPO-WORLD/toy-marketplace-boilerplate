import type { ExchangeLiquidity } from '~/api';

import { ERC1155_ABI } from '../../shared/abi/token/ERC1155';
import { Niftyswap20_ABI } from '../contracts/abi/niftyswap/Niftyswap20';
import { NiftyswapFactory20_ABI } from '../contracts/abi/niftyswap/NiftyswapFactory20';
import {
  CREATE_EXCHANGE_INSTANCE,
  getAddLiquidityData,
  getRemoveLiquidityData,
  getSellTokenData,
} from '../contracts/constants';
import {
  getExchangeLiquidityData,
  getLiquidityShares,
} from '../contracts/functions';
import {
  getERC1155Contract,
  getNiftyswap20Contract,
  getNiftyswapFactory20Contract,
} from '../contracts/instances';
import {
  calcSlippage,
  divRoundBI,
  percentageToBasis1000,
  sortDependenciesByTokenId,
} from '../contracts/utils';
import * as ethers from 'ethers';
import type { Hex } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

interface INiftyswap {
  chainId: number;
  contractAddress: string;
}

export interface AddLiquidityEstimateInputItem {
  tokenId: string;
  amount: bigint; // decimal adjusted token amount
  customPricePerToken?: bigint; // currency & collectible decimal adjusted price per token
}

export interface RemoveLiquidityEstimateInputItem {
  tokenId: string;
  lpTokenAmount: bigint;
}

export interface ExistingLiquidityConditions
  extends AddLiquidityEstimateInputItem {
  erc20CurrencyReserve: bigint;
  erc1155TokenReserve: bigint;
}

export interface AddLiquidityEstimateOutputItem {
  liquidityConditions: ExistingLiquidityConditions[];
  estimates: AddLiquidityCostEstimates[];
}

export interface RemoveLiquidityEstimateOutputData {
  tokenIds: string[];
  tokenAmounts: bigint[];
  currencyAmounts: bigint[];
  lpTokenAmounts: bigint[];
}

export interface WithdrawOutputEstimate {
  currencyAmount: bigint;
  tokenAmount: bigint;
}

interface AddLiquidityCostEstimates {
  cost: bigint;
  futurePoolOwnership: bigint;
}
abstract class CoreMethods {
  chainId: number;
  exchangeAddress: string;

  constructor({ chainId, contractAddress }: INiftyswap) {
    this.chainId = chainId;
    this.exchangeAddress = contractAddress;
  }

  buyTokens = async ({
    tokenIds,
    amounts,
    maxCurrency, // with slippage and fees
    recipientAddress,
    orderDeadline,
    extraFeeAmount,
    extraFeeRecipient,
    signer,
  }: {
    tokenIds: string[];
    amounts: bigint[];
    maxCurrency: bigint;
    orderDeadline: bigint;
    recipientAddress: string;
    extraFeeAmount: bigint;
    extraFeeRecipient: string | null;
    signer: GetWalletClientData<any, any>;
  }) => {
    // Must sort order by ascending token ids
    const [sortedTokenIds, sortedTokenAmounts] = sortDependenciesByTokenId(
      tokenIds.map(BigInt),
      amounts,
    );

    const txnHash = await signer.writeContract({
      chain: signer.chain,
      address: this.exchangeAddress as Hex,
      abi: Niftyswap20_ABI,
      functionName: 'buyTokens',
      args: [
        sortedTokenIds,
        sortedTokenAmounts,
        maxCurrency,
        orderDeadline,
        recipientAddress as Hex,
        extraFeeRecipient ? [extraFeeRecipient as Hex] : [],
        extraFeeRecipient ? [extraFeeAmount] : [],
      ],
    });

    return txnHash;
  };

  sellTokens = async ({
    tokenIds,
    amounts,
    minCurrency, // with slippage and fees
    orderDeadline,
    extraFeeAmount,
    extraFeeRecipient,
    userAddress,
    assetContractAddress,
    signer,
  }: {
    tokenIds: string[];
    amounts: bigint[];
    minCurrency: bigint;
    orderDeadline: number;
    extraFeeAmount: bigint;
    extraFeeRecipient: string | null;
    userAddress: string;
    assetContractAddress: string;
    signer: GetWalletClientData<any, any>;
  }): Promise<string> => {
    // Must sort order by ascending token ids
    const [sortedTokenIds, sortedTokenAmounts] = sortDependenciesByTokenId(
      tokenIds.map(BigInt),
      amounts,
    );

    const sellTokenData = getSellTokenData({
      recipient: userAddress,
      minCurrency: ethers.BigNumber.from(minCurrency.toString()),
      extraFeeAmounts: extraFeeRecipient
        ? [ethers.BigNumber.from(extraFeeAmount.toString())]
        : [],
      extraFeeRecipients: extraFeeRecipient ? [extraFeeRecipient] : [],
      deadline: orderDeadline,
    });

    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: assetContractAddress as Hex,
      abi: ERC1155_ABI,
      functionName: 'safeBatchTransferFrom',
      args: [
        userAddress as Hex,
        this.exchangeAddress as Hex,
        sortedTokenIds,
        sortedTokenAmounts,
        sellTokenData as Hex,
      ],
    });

    return txHash;
  };

  addLiquidity = async ({
    tokenIDsToAdd,
    tokenAmountsToAdd,
    currencyAmountsToAdd,
    orderDeadline,
    userAddress,
    assetContractAddress,
    signer,
  }: {
    tokenIDsToAdd: bigint[];
    tokenAmountsToAdd: bigint[];
    currencyAmountsToAdd: bigint[];
    orderDeadline: number;
    userAddress: string;
    assetContractAddress: string;
    signer: GetWalletClientData<any, any>;
  }) => {
    // niftyswap requires us to sort order by ascending asset ids
    const [sortedTokenIds, sortedTokenAmounts, sortedCurrencyAmountsToAdd] =
      sortDependenciesByTokenId(
        tokenIDsToAdd,
        tokenAmountsToAdd,
        currencyAmountsToAdd,
      );

    const addLiquidityData = getAddLiquidityData(
      sortedCurrencyAmountsToAdd.map((x) =>
        ethers.BigNumber.from(x.toString()),
      ),
      orderDeadline,
    );

    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: assetContractAddress as Hex,
      abi: ERC1155_ABI,
      functionName: 'safeBatchTransferFrom',
      args: [
        userAddress as Hex,
        this.exchangeAddress as Hex,
        sortedTokenIds,
        sortedTokenAmounts,
        addLiquidityData as Hex,
      ],
    });

    return txHash;
  };

  withdrawLiquidity = async ({
    tokenIDsToRemove,
    tokenAmountsToRemove,
    currencyAmountsToRemove,
    poolTokenAmountsToRemove,
    orderDeadline,
    userAddress,
    signer,
  }: {
    tokenIDsToRemove: string[];
    tokenAmountsToRemove: bigint[];
    currencyAmountsToRemove: bigint[];
    poolTokenAmountsToRemove: bigint[];
    orderDeadline: number;
    userAddress: string;
    signer: GetWalletClientData<any, any>;
  }) => {
    if (!userAddress) {
      return undefined;
    }

    // niftyswap requires us to sort order by ascending asset ids
    const [
      sortedTokenIds,
      sortedTokenAmounts,
      sortedCurrencyAmounts,
      sortedPoolTokenAmounts,
    ] = sortDependenciesByTokenId(
      tokenIDsToRemove.map(BigInt),
      tokenAmountsToRemove,
      currencyAmountsToRemove,
      poolTokenAmountsToRemove,
    );

    const removeLiquidityData = getRemoveLiquidityData(
      sortedCurrencyAmounts.map((x) => ethers.BigNumber.from(x.toString())),
      sortedTokenAmounts.map((x) => ethers.BigNumber.from(x.toString())),
      orderDeadline,
    );

    const txnHash = await signer.writeContract({
      chain: signer.chain,
      address: this.exchangeAddress as Hex,
      abi: Niftyswap20_ABI,
      functionName: 'safeBatchTransferFrom',
      args: [
        userAddress as Hex,
        this.exchangeAddress as Hex,
        sortedTokenIds,
        sortedPoolTokenAmounts,
        removeLiquidityData as Hex,
      ],
    });

    return txnHash;
  };
}

interface IReadonlyMethods {
  getCurrencyContractAddress: () => Promise<string>;
  getAssetContractAddress: () => Promise<string>;
  getCurrencyReserves: (tokenIds: string[]) => Promise<readonly bigint[]>;
  getExchangeLPFee: () => Promise<bigint>;
  getUserLiquidityTokenBalance: (
    tokenIds: string[],
    userAddress: string | undefined,
  ) => Promise<readonly bigint[]>;
}

export class Niftyswap extends CoreMethods implements IReadonlyMethods {
  constructor({ chainId, contractAddress }: INiftyswap) {
    super({ chainId, contractAddress });
  }

  /* instances */
  static getExchangeInstance = async (
    chainId: number,
    niftyswapFactoryAddress: string,
    tokenAddress: string,
    currencyAddress: string,
    lpFee: number,
  ): Promise<Niftyswap> => {
    const factoryContract = getNiftyswapFactory20Contract({
      contractAddress: niftyswapFactoryAddress,
      chainId,
    });
    const exchangeAddress = await factoryContract.read.tokensToExchange([
      tokenAddress as Hex,
      currencyAddress as Hex,
      BigInt(lpFee),
      BigInt(CREATE_EXCHANGE_INSTANCE),
    ]);

    return new Niftyswap({ chainId, contractAddress: exchangeAddress });
  };

  static getPairExchanges = async (
    chainId: number,
    niftyswapFactoryAddress: string,
    tokenAddress: string,
    currencyAddress: string,
  ) => {
    const factoryContract = getNiftyswapFactory20Contract({
      contractAddress: niftyswapFactoryAddress,
      chainId,
    });
    return factoryContract.read.getPairExchanges([
      tokenAddress as Hex,
      currencyAddress as Hex,
    ]);
  };

  static createExchange = async (
    chainId: number,
    niftyswapFactoryAddress: string,
    tokenAddress: string,
    currencyAddress: string,
    lpFeePercentage: number,
    signer: GetWalletClientData<any, any>,
  ) => {
    const lpFeeBasis = percentageToBasis1000(lpFeePercentage);

    const existingExchange = await this.getExchangeInstance(
      chainId,
      niftyswapFactoryAddress,
      tokenAddress,
      currencyAddress,
      lpFeeBasis,
    );

    if (existingExchange.exchangeAddress !== ethers.constants.AddressZero) {
      throw new Error(
        'Niftyswap Exchange with this configuration already exists on factory',
      );
    }

    const txHash = await signer.writeContract({
      chain: signer.chain,
      address: niftyswapFactoryAddress as Hex,
      abi: NiftyswapFactory20_ABI,
      functionName: 'createExchange',
      args: [
        tokenAddress as Hex,
        currencyAddress as Hex,
        BigInt(lpFeeBasis),
        BigInt(CREATE_EXCHANGE_INSTANCE),
      ],
    });

    return txHash;
  };

  /* getters */
  getCurrencyContractAddress = async (): Promise<string> => {
    const exchangeContract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return exchangeContract.read.getCurrencyInfo();
  };

  getAssetContractAddress = async (): Promise<string> => {
    const exchangeContract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return exchangeContract.read.getTokenAddress();
  };

  getCurrencyReserves = async (
    tokenIds: string[],
  ): Promise<readonly bigint[]> => {
    const exchangeContract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return exchangeContract.read.getCurrencyReserves([tokenIds.map(BigInt)]);
  };

  getExchangeLPFee = async (): Promise<bigint> => {
    const exchangeContract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return exchangeContract.read.getLPFee();
  };

  getUserLiquidityTokenBalance = async (
    tokenIds: string[],
    userAddress: string | undefined,
  ) => {
    if (!userAddress) {
      return tokenIds.map(() => 0n);
    }
    const exchangeContract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return exchangeContract.read.balanceOfBatch([
      Array(tokenIds.length).fill(userAddress),
      tokenIds.map(BigInt),
    ]);
  };

  getTotalSupply = async (tokenIds: string[]): Promise<readonly bigint[]> => {
    const contract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return contract.read.getTotalSupply([tokenIds.map(BigInt)]);
  };

  getRoyaltyInfo = async (
    tokenId: string,
    cost: bigint,
  ): Promise<readonly [string, bigint]> => {
    const contract = getNiftyswap20Contract({
      contractAddress: this.exchangeAddress,
      chainId: this.chainId,
    });
    return contract.read.getRoyaltyInfo([BigInt(tokenId), cost]);
  };

  getERC1155BalanceDirect = async (
    contractAddress: string,
    userAddress: string,
    tokenIds: string[],
  ): Promise<readonly bigint[]> => {
    const contract = getERC1155Contract({
      contractAddress,
      chainId: this.chainId,
    });
    return contract.read.balanceOfBatch([
      Array(tokenIds.length).fill(userAddress),
      tokenIds.map(BigInt),
    ]);
  };

  getPrice_currencyToToken = async (
    exchangeAddress: string,
    tokenIds: string[],
    amounts: bigint[],
    chainId: number,
  ): Promise<readonly bigint[]> => {
    const contract = getNiftyswap20Contract({
      contractAddress: exchangeAddress,
      chainId: this.chainId,
    });
    return contract.read.getPrice_currencyToToken([
      tokenIds.map(BigInt),
      amounts,
    ]);
  };

  getPrice_tokenToCurrency = async (
    exchangeAddress: string,
    tokenIds: string[],
    amounts: bigint[],
    chainId: number,
  ): Promise<readonly bigint[]> => {
    const contract = getNiftyswap20Contract({
      contractAddress: exchangeAddress,
      chainId: this.chainId,
    });
    return contract.read.getPrice_tokenToCurrency([
      tokenIds.map(BigInt),
      amounts,
    ]);
  };

  getSlippageAmount(val: bigint, slippagePercent = 3): bigint {
    return calcSlippage(val, slippagePercent);
  }

  getAddLiquidityEstimates = async (
    items: AddLiquidityEstimateInputItem[],
    slippagePercentage: number,
  ): Promise<AddLiquidityEstimateOutputItem> => {
    try {
      const tokenAddress = await this.getAssetContractAddress();
      const tokenIds = items.map((i) => i.tokenId);
      // multicall batch read
      const [
        erc20CurrencyReserves,
        erc1155TokenReserves,
        lpTokenTotalSupplies,
      ] = await Promise.all([
        this.getCurrencyReserves(tokenIds),
        this.getERC1155BalanceDirect(
          tokenAddress,
          this.exchangeAddress,
          tokenIds,
        ),
        this.getTotalSupply(tokenIds),
      ]);

      const liquidityConditions = items.map((item, i) => ({
        ...item,
        erc20CurrencyReserve: erc20CurrencyReserves[i],
        erc1155TokenReserve: erc1155TokenReserves[i],
        lpTokenTotalSupply: lpTokenTotalSupplies[i],
      }));

      const addLiquidityEstimates: AddLiquidityCostEstimates[] =
        liquidityConditions.map((item) => {
          if (
            item.erc20CurrencyReserve === 0n &&
            item.erc1155TokenReserve === 0n
          ) {
            // no existing liquidity, calculate price based on customPrice

            if (!item.customPricePerToken || item.customPricePerToken === 0n) {
              return {
                cost: 0n,
                futurePoolOwnership: 0n,
              };
            }

            /**
             * dont apply slippage here because we are the one setting the initial price
             *
             * if we get front-run here just take the revert
             */
            const estimatedCost = item.customPricePerToken;

            return {
              cost: estimatedCost,
              futurePoolOwnership: 100n, // first one here gets 100%
            };
          } else {
            // has existing liquidity, calculate price based on existing liquidity condition
            const amount = item.amount;
            const currencyReserve = item.erc20CurrencyReserve;
            const tokenReserve = item.erc1155TokenReserve;
            /**
             * Amount of currency tokens to send to token id reserve:
             * X/Y = dx/dy
             * dx = X*dy/Y
             * where
             *   X:  currency total liquidity
             *   Y:  Token _id total liquidity (before tokens were received)
             *   dy: Amount of token _id deposited
             *   dx: Amount of currency to deposit
             *
             * Adding .add(1) if rounding errors so to not favor users incorrectly
             */
            const [currencyAmount, rounded] = divRoundBI(
              amount * currencyReserve,
              tokenReserve,
            );

            // Proportion of the liquidity pool to give to current liquidity provider
            // If rounding error occured, round down to favor previous liquidity providers
            // See https://github.com/0xsequence/niftyswap/issues/19
            const liquiditiesToMint =
              currencyAmount -
              ((rounded ? 1n : 0n) * item.lpTokenTotalSupply) / currencyReserve;

            const poolOwnershipPercentage =
              (liquiditiesToMint * 10000n) / item.lpTokenTotalSupply / 100n;

            const estimatedCost = currencyAmount;
            const slippage = calcSlippage(estimatedCost, slippagePercentage);
            const estimatedCostWithSlippage = estimatedCost + slippage;
            return {
              cost: estimatedCostWithSlippage,
              futurePoolOwnership: poolOwnershipPercentage,
            };
          }
        });

      return {
        liquidityConditions: liquidityConditions,
        estimates: addLiquidityEstimates,
      };
    } catch (error) {
      console.error('getAddLiquidityEstimates error', error);
      return {
        liquidityConditions: [],
        estimates: [],
      };
    }
  };

  getWithdrawLiquidityTxnData = async (
    userAddress: string,
    tokenAddress: string,
    lpFeePercentage: number,
    input: Array<RemoveLiquidityEstimateInputItem>,
    slippagePercentage: number,
  ): Promise<RemoveLiquidityEstimateOutputData> => {
    try {
      const liquidityData = await getExchangeLiquidityData(
        {
          exchangeAddress: this.exchangeAddress,
          collection: { id: tokenAddress },
          lpFeePercentage: lpFeePercentage,
        },
        input.map((x) => x.tokenId),
        this.chainId,
        userAddress,
      );

      const result: RemoveLiquidityEstimateOutputData = {
        tokenIds: [],
        tokenAmounts: [],
        currencyAmounts: [],
        lpTokenAmounts: [],
      };

      input.forEach(({ tokenId, lpTokenAmount }, i) => {
        const data = liquidityData.get(tokenId);

        if (!data)
          throw new Error('No liquidity data found for token id: ' + tokenId);

        const currencyReserve = data.currencyReserve;
        const tokenReserve = data.tokenReserve;
        const totalLiquidity = data.liquidityTokenSupply;
        const tokenAmount = (lpTokenAmount * tokenReserve) / totalLiquidity;
        const currencyAmount =
          (lpTokenAmount * currencyReserve) / totalLiquidity;

        const tokenAmountSlippage = this.getSlippageAmount(
          tokenAmount,
          slippagePercentage,
        );
        const currencyAmountSlippage = this.getSlippageAmount(
          currencyAmount,
          slippagePercentage,
        );
        const tokenAmountWithSlippage = tokenAmount - tokenAmountSlippage;
        const currencyAmountWithSlippage =
          currencyAmount - currencyAmountSlippage;
        result.tokenIds.push(tokenId);
        result.tokenAmounts.push(tokenAmountWithSlippage);
        result.currencyAmounts.push(currencyAmountWithSlippage);
        result.lpTokenAmounts.push(lpTokenAmount);
      });

      return result;
    } catch (error) {
      throw new Error('Unable to calculate withdraw estimates');
    }
  };

  getEstimatedWithdrawOutput = ({
    withdrawLiquidityTokenAmount,
    currencyAmount,
    tokenReserve,
    currencyReserve,
    liquidityTokenSupply,
    liquidityTokenUserBalance,
    feeMultiplier,
    royaltyPercentage,
  }: ExchangeLiquidity & {
    withdrawLiquidityTokenAmount: bigint;
  }) => {
    let tokenAmount = 0n;

    // rounding error management reflects the smart contract
    // https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L498
    try {
      tokenAmount =
        (liquidityTokenUserBalance * tokenReserve) / liquidityTokenSupply;
    } catch {
      tokenAmount = 0n;
    }

    if (currencyAmount === 0n && tokenAmount === 0n)
      return {
        currencyAmount: 0n,
        tokenAmount: 0n,
      };

    const shares = getLiquidityShares(
      {
        tokenReserve,
        currencyReserve,
        liquidityTokenSupply,
        feeMultiplier,
        royaltyPercentage,
      },
      withdrawLiquidityTokenAmount,
    );

    return {
      currencyAmount: shares.currencyAmount,
      tokenAmount: shares.tokenAmount,
    };
  };
}
