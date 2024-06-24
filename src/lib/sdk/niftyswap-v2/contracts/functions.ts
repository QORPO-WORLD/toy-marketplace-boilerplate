import {
  percentageToBasis1000,
  BASIS_DENOMINATOR_1000,
  getERC1155Contract,
  getNiftyswap20Contract,
  percentageToBPS,
  BASIS_DENOMINATOR_10000,
} from '~/sdk/niftyswap-v2';

import type { ExchangeLiquidity } from '../../../api/types';

export const getCurrencyReserves = async (
  exchangeAddress: string,
  tokenIds: string[],
  chainId: number,
): Promise<readonly bigint[]> => {
  const exchangeContract = getNiftyswap20Contract({
    contractAddress: exchangeAddress,
    chainId,
  });
  return exchangeContract.read.getCurrencyReserves([tokenIds.map(BigInt)]);
};

export const getTotalSupply = async (
  exchangeAddress: string,
  tokenIds: string[],
  chainId: number,
): Promise<readonly bigint[]> => {
  const contract = getNiftyswap20Contract({
    contractAddress: exchangeAddress,
    chainId,
  });
  return contract.read.getTotalSupply([tokenIds.map(BigInt)]);
};

export const getUserLiquidityTokenBalance = async (
  exchangeAddress: string,
  tokenIds: string[],
  chainId: number,
  userAddress: string | undefined,
) => {
  if (!userAddress) {
    return tokenIds.map(() => 0n);
  }
  const exchangeContract = getNiftyswap20Contract({
    contractAddress: exchangeAddress,
    chainId,
  });
  return exchangeContract.read.balanceOfBatch([
    Array(tokenIds.length).fill(userAddress),
    tokenIds.map(BigInt),
  ]);
};

export const getRoyaltyInfo = async (
  exchangeAddress: string,
  chainId: number,
  tokenId: string,
  cost: bigint,
): Promise<readonly [string, bigint]> => {
  const contract = getNiftyswap20Contract({
    contractAddress: exchangeAddress,
    chainId,
  });
  return contract.read.getRoyaltyInfo([BigInt(tokenId), cost]);
};

export const getTokenAmount = async (
  liquidityTokenUserBalance: bigint,
  tokenReserve: bigint,
  liquidityTokenSupply: bigint,
) => {
  // rounding error management reflects the smart contract
  // https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L498
  try {
    return (liquidityTokenUserBalance * tokenReserve) / liquidityTokenSupply;
  } catch {
    return 0n;
  }
};

export const getLiquidityShares = (
  {
    tokenReserve,
    currencyReserve,
    liquidityTokenSupply,
    feeMultiplier,
    royaltyPercentage,
  }: {
    tokenReserve: bigint;
    currencyReserve: bigint;
    liquidityTokenSupply: bigint;
    feeMultiplier: number;
    royaltyPercentage: number;
  },
  liquidityTokenAmount: bigint,
): {
  currencyAmount: bigint;
  tokenAmount: bigint;
} => {
  try {
    if (liquidityTokenAmount === 0n) {
      return {
        currencyAmount: 0n,
        tokenAmount: 0n,
      };
    }
    const tokenNumerator = liquidityTokenAmount * tokenReserve;
    let currencyNumerator = liquidityTokenAmount * currencyReserve;

    const soldTokenNumerator = tokenNumerator % liquidityTokenSupply;

    if (soldTokenNumerator !== 0n) {
      const virtualTokenReserve =
        tokenReserve -
        (tokenNumerator / liquidityTokenSupply) * liquidityTokenSupply;
      const virtualCurrencyReserve =
        currencyReserve -
        (currencyNumerator / liquidityTokenSupply) * liquidityTokenSupply;

      if (virtualTokenReserve !== 0n && virtualCurrencyReserve !== 0n) {
        const sellPrice = (
          _assetSoldAmount: bigint,
          _assetSoldReserve: bigint,
          _assetBoughtReserve: bigint,
        ): bigint => {
          const _assetSoldAmount_withFee =
            _assetSoldAmount * BigInt(feeMultiplier);
          const numerator = _assetSoldAmount_withFee * _assetBoughtReserve;
          const denominator =
            _assetSoldReserve * BigInt(BASIS_DENOMINATOR_1000) +
            _assetSoldAmount_withFee;
          return numerator / denominator;
        };

        let boughtCurrencyNumerator = sellPrice(
          soldTokenNumerator,
          virtualTokenReserve,
          virtualCurrencyReserve,
        );

        const royaltyNumerator =
          (boughtCurrencyNumerator *
            BigInt(percentageToBPS(royaltyPercentage))) /
          BigInt(BASIS_DENOMINATOR_10000);

        boughtCurrencyNumerator = boughtCurrencyNumerator - royaltyNumerator;

        currencyNumerator = currencyNumerator + boughtCurrencyNumerator;
      }
    }

    const _currencyAmount = currencyNumerator / liquidityTokenSupply;
    const _tokenAmount = tokenNumerator / liquidityTokenSupply;

    return {
      currencyAmount: _currencyAmount,
      tokenAmount: _tokenAmount,
    };
  } catch (error) {
    console.error(error);
    return {
      currencyAmount: 0n,
      tokenAmount: 0n,
    };
  }
};

export const getExchangeLiquidityData = async (
  exchange: {
    exchangeAddress: string;
    collection: { id: string };
    lpFeePercentage: number;
  },
  tokenIds: string[],
  chainId: number,
  userAddress: string | undefined,
): Promise<Map<string, ExchangeLiquidity>> => {
  try {
    const [
      tokenReserves,
      currencyReserves,
      liquidityTokenSupplies,
      liquidityTokenUserBalances,
    ] = await Promise.all([
      getERC1155BalanceDirect(
        exchange.collection.id,
        exchange.exchangeAddress,
        tokenIds,
        chainId,
      ),
      getCurrencyReserves(exchange.exchangeAddress, tokenIds, chainId),
      getTotalSupply(exchange.exchangeAddress, tokenIds, chainId),
      getUserLiquidityTokenBalance(
        exchange.exchangeAddress,
        tokenIds,
        chainId,
        userAddress,
      ),
    ]);

    const liquidityData = new Map<string, ExchangeLiquidity>();

    for (let i = 0; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];

      const tokenReserve = tokenReserves[i];
      const currencyReserve = currencyReserves[i];
      const liquidityTokenSupply = liquidityTokenSupplies[i];
      const liquidityTokenUserBalance = liquidityTokenUserBalances[i];

      const feeMultiplier =
        BASIS_DENOMINATOR_1000 -
        percentageToBasis1000(exchange.lpFeePercentage);

      const [_, royaltyNumerator] = await getRoyaltyInfo(
        exchange.exchangeAddress,
        chainId,
        tokenId,
        10000n /* price of 10000 because the basis is 10000. Must be divided by 100 to get the percentage */,
      );

      const royaltyPercentage = Number(royaltyNumerator) / 100;

      const { currencyAmount, tokenAmount } = await getLiquidityShares(
        {
          tokenReserve,
          currencyReserve,
          liquidityTokenSupply,
          feeMultiplier,
          royaltyPercentage,
        },
        liquidityTokenUserBalance,
      );

      liquidityData.set(tokenId, {
        tokenReserve,
        currencyReserve,
        liquidityTokenSupply,
        liquidityTokenUserBalance,
        exchangeAddress: exchange.exchangeAddress,
        feeMultiplier,
        royaltyPercentage,
        chainId: chainId,
        currencyAmount,
        tokenAmount,
      });
    }

    return liquidityData;
  } catch (e) {
    console.error('getExchangeLiquidityData failed', e);
    return new Map();
  }
};

function getERC1155BalanceDirect(
  collectionAddress: string,
  exchangeAddress: string,
  tokenIds: string[],
  chainId: number,
) {
  const contract = getERC1155Contract({
    contractAddress: collectionAddress,
    chainId,
  });
  return contract.read.balanceOfBatch([
    Array(tokenIds.length).fill(exchangeAddress),
    tokenIds.map(BigInt),
  ]);
}
