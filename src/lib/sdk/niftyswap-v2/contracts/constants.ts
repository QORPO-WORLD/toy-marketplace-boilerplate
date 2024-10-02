import * as ethers from 'ethers';

// https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L70
export const BASIS_DENOMINATOR_1000 = 1000;
// https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L55
export const BASIS_DENOMINATOR_10000 = 10000;
// default exchange instance salt
export const CREATE_EXCHANGE_INSTANCE = 0;

// niftyswap encoding
export const methodsSignature = {
  BUYTOKENS: '0xb2d81047',
  SELLTOKENS: '0xade79c7a',
  ADDLIQUIDITY: '0x82da2b73',
  REMOVELIQUIDITY: '0x5c0bf259',
};

export const SellTokens20Type = `tuple(
  address recipient,
  uint256 minCurrency,
  address[] extraFeeRecipients,
  uint256[] extraFeeAmounts,
  uint256 deadline
)`;

export const AddLiquidityType = `tuple(
  uint256[] maxCurrency,
  uint256 deadline
)`;

export const RemoveLiquidityType = `tuple(
  uint256[] minCurrency,
  uint256[] minTokens,
  uint256 deadline
)`;

export type SellTokensObj20 = {
  recipient: string;
  minCurrency: number | string | ethers.BigNumberish;
  extraFeeRecipients: string[];
  extraFeeAmounts: number[] | string[] | ethers.BigNumberish[];
  deadline: number | string | ethers.BigNumberish;
};

export type AddLiquidityObj = {
  maxCurrency: ethers.BigNumberish[];
  deadline: ethers.BigNumberish;
};

export type RemoveLiquidityObj = {
  minCurrency: ethers.BigNumberish[];
  minTokens: ethers.BigNumberish[];
  deadline: ethers.BigNumberish;
};

export function getSellTokenData(obj: SellTokensObj20) {
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['bytes4', SellTokens20Type],
    [methodsSignature.SELLTOKENS, obj],
  );
}

export const getAddLiquidityData = (
  maxCurrency: ethers.BigNumberish[],
  deadline: number,
) => {
  const addLiquidityObj = { maxCurrency, deadline } as AddLiquidityObj;

  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['bytes4', AddLiquidityType],
    [methodsSignature.ADDLIQUIDITY, addLiquidityObj],
  );
};

export const getRemoveLiquidityData = (
  minCurrency: ethers.BigNumberish[],
  minTokens: ethers.BigNumberish[],
  deadline: number,
) => {
  const removeLiquidityObj = {
    minCurrency,
    minTokens,
    deadline,
  } as RemoveLiquidityObj;

  return ethers.AbiCoder.defaultAbiCoder().encode(
    ['bytes4', RemoveLiquidityType],
    [methodsSignature.REMOVELIQUIDITY, removeLiquidityObj],
  );
};
