import { DEFAULT_PLATFORM_FEE_RECIPIENT } from '~/config/consts';
import { SUPPORTED_NETWORKS } from '~/config/networks/config';

// https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L70
export const BASIS_DENOMINATOR_1000 = 1000;
// https://github.com/0xsequence/niftyswap/blob/master/src/contracts/exchange/NiftyswapExchange20.sol#L55
export const BASIS_DENOMINATOR_10000 = 10000;

export const getPlatformFeeRecipient = (chainId: number | string) => {
  const customPlatformFeeRecipient = SUPPORTED_NETWORKS.find(
    (n) => n.chainId == chainId,
  )?.customPlatformFeeRecipient;

  if (customPlatformFeeRecipient) {
    return customPlatformFeeRecipient;
  } else {
    return DEFAULT_PLATFORM_FEE_RECIPIENT;
  }
};

export const getFrontEndFeeAmount = (
  totalCost: bigint,
  feePercentage: number,
) =>
  (totalCost * BigInt(percentageToBPS(feePercentage))) /
  BigInt(BASIS_DENOMINATOR_10000);

// traditional BPS
// 10000 basis (e.g. 1% is 100 and 0.3% is 30 and 100% is 10000)
export const percentageToBPS = (percentage: string | number) =>
  (Number(percentage) * BASIS_DENOMINATOR_10000) / 100; // * 100
