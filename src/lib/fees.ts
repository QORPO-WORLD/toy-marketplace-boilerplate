import { DEFAULT_PLATFORM_FEE_RECIPIENT } from '~/config/consts';
import { SUPPORTED_NETWORKS } from '~/config/networks/config';

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
