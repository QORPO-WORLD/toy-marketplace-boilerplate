import { BASIS_DENOMINATOR_1000, BASIS_DENOMINATOR_10000 } from './constants';
import { SwapType } from '@0xsequence/metadata';
import type { BigNumber, ethers } from 'ethers';

export const calcSlippage = (value: bigint, slippagePercentage: number) =>
  // allow up to 2 decimal places of slippage preference
  (value * (BigInt(slippagePercentage) * 100n)) / 10000n;

// Divides two numbers and add 1 if there is a rounding error
export const divRound = (a: bigint, b: bigint) => {
  return a % b === BigInt(0) ? a / b : a / b + BigInt(1);
};

export const divRoundBI = (a: bigint, b: bigint): [bigint, boolean] => {
  return a % b === 0n ? [a / b, false] : [a / b + 1n, true];
};

// niftyswap basis (for lp fees etc. check contract.)
// 1000 basis, (e.g. 1% is 10 and 0.3% is 3 and 10% is 100)
export const percentageToBasis1000 = (percentage: string | number) =>
  (Number(percentage) * BASIS_DENOMINATOR_1000) / 100; // * 10

// traditional BPS
// 10000 basis (e.g. 1% is 100 and 0.3% is 30 and 100% is 10000)
export const percentageToBPS = (percentage: string | number) =>
  (Number(percentage) * BASIS_DENOMINATOR_10000) / 100; // * 100

export const getFrontEndFeeAmount = (
  totalCost: bigint,
  feePercentage: number,
) =>
  (totalCost * BigInt(percentageToBPS(feePercentage))) /
  BigInt(BASIS_DENOMINATOR_10000);

interface GetSwapPriceComponentsInterface {
  priceQuote: bigint;
  royaltyFeePercentage: number;
  lpFeePercentage: number;
  swapType: SwapType.BUY | SwapType.SELL;
}

export const getSwapPriceComponents = ({
  priceQuote,
  royaltyFeePercentage,
  lpFeePercentage,
  swapType,
}: GetSwapPriceComponentsInterface) => {
  const lpFeeBasis = percentageToBasis1000(lpFeePercentage);
  const royaltyFeeBasis = percentageToBPS(royaltyFeePercentage);

  // currencyToToken costs includes royalty and lp fees, we need to reverse engineer the amounts for each.
  // read contract for how this is derived.
  const priceWithFeesAndRoyalty = priceQuote;

  let priceWithFees = 0n;

  if (royaltyFeePercentage === 0) {
    priceWithFees = priceWithFeesAndRoyalty;
  } else {
    if (swapType === SwapType.BUY) {
      priceWithFees =
        (priceWithFeesAndRoyalty * BigInt(BASIS_DENOMINATOR_10000)) /
        BigInt(Math.round(BASIS_DENOMINATOR_10000 + royaltyFeeBasis));
    }
    if (swapType === SwapType.SELL) {
      priceWithFees =
        (priceWithFeesAndRoyalty * BigInt(BASIS_DENOMINATOR_10000)) /
        BigInt(Math.round(BASIS_DENOMINATOR_10000 - royaltyFeeBasis));
    }
  }

  let priceWithoutFeesAndRoyalty = 0n;

  if (swapType === SwapType.BUY) {
    priceWithoutFeesAndRoyalty =
      (priceWithFees * BigInt(BASIS_DENOMINATOR_1000 - lpFeeBasis)) /
      BigInt(BASIS_DENOMINATOR_1000);
  }
  if (swapType === SwapType.SELL) {
    priceWithoutFeesAndRoyalty =
      (priceWithFees * BigInt(BASIS_DENOMINATOR_1000 + lpFeeBasis)) /
      BigInt(BASIS_DENOMINATOR_1000);
  }

  let royaltyFeeAmount = 0n;

  if (swapType === SwapType.BUY) {
    royaltyFeeAmount = priceWithFeesAndRoyalty - priceWithFees;
  }
  if (swapType === SwapType.SELL) {
    royaltyFeeAmount = priceWithFees - priceWithFeesAndRoyalty;
  }

  let lpFeeAmount = 0n;

  if (swapType === SwapType.BUY) {
    lpFeeAmount = priceWithFees - priceWithoutFeesAndRoyalty;
  }
  if (swapType === SwapType.SELL) {
    lpFeeAmount = priceWithoutFeesAndRoyalty - priceWithFees;
  }

  return {
    priceWithoutFeesAndRoyalty,
    priceWithFeesAndRoyalty,
    priceWithFees,
    royaltyFeeAmount,
    lpFeeAmount,
  };
};

// sort all equal length array contents based on ascending _tokenIds
// niftyswap requires us to sort order by ascending asset ids
export const sortDependenciesByTokenId = (
  _tokenIds: bigint[],
  ..._dependencies: bigint[][]
): bigint[][] => {
  const zip = (arr: bigint[], ...arrs: bigint[][]) => {
    return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
  };

  const sorted = zip(_tokenIds, ..._dependencies).sort(
    (a: bigint[], b: bigint[]) => Number(a[0] - b[0]),
  );

  return [
    sorted.map((s) => s[0]),
    ..._dependencies.map((_, i) => sorted.map((s) => s[i + 1])),
  ];
};

export const getSellPriceOLD = (
  _assetSoldAmount: ethers.BigNumber,
  _assetSoldReserve: ethers.BigNumber,
  _assetBoughtReserve: ethers.BigNumber,
  feeMultiplier: number,
): ethers.BigNumber => {
  const _assetSoldAmount_withFee = _assetSoldAmount.mul(feeMultiplier);
  const numerator = _assetSoldAmount_withFee.mul(_assetBoughtReserve);
  const denominator = _assetSoldReserve
    .mul(BASIS_DENOMINATOR_1000)
    .add(_assetSoldAmount_withFee);
  return numerator.div(denominator);
};

export const getSellPrice = (
  _assetSoldAmount: bigint,
  _assetSoldReserve: bigint,
  _assetBoughtReserve: bigint,
  feePercentage: string | number,
): bigint => {
  if (_assetSoldReserve > BigInt(0) && _assetBoughtReserve > BigInt(0)) {
    const feeMultiplier =
      BASIS_DENOMINATOR_1000 - percentageToBasis1000(feePercentage);
    const _assetSoldAmount_withFee = _assetSoldAmount * BigInt(feeMultiplier);
    const numerator = _assetSoldAmount_withFee * _assetBoughtReserve;
    const denominator =
      _assetSoldReserve * BigInt(BASIS_DENOMINATOR_1000) +
      _assetSoldAmount_withFee;

    return numerator / denominator;
  }
  return BigInt(0);
};

export const getBuyPrice = (
  _assetBoughtAmount: bigint,
  _assetSoldReserve: bigint,
  _assetBoughtReserve: bigint,
  feePercentage: number | string,
): bigint => {
  if (_assetSoldReserve > BigInt(0) && _assetBoughtReserve > BigInt(0)) {
    const feeMultiplier =
      BASIS_DENOMINATOR_1000 - percentageToBasis1000(feePercentage);
    const numerator =
      _assetSoldReserve * _assetBoughtAmount * BigInt(BASIS_DENOMINATOR_1000);
    const denominator =
      (_assetBoughtReserve - _assetBoughtAmount) * BigInt(feeMultiplier);

    if (denominator === BigInt(0)) {
      return BigInt(0);
    }

    return divRound(numerator, denominator);
  }

  return BigInt(0);
};
