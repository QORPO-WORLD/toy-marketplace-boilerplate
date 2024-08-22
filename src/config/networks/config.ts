import {
  PLATFORM_FEE_RECIPIENT_AVALANCHE_OPTIMISM,
  DEFAULT_PLATFORM_FEE_RECIPIENT,
  builderMarketplaceApi,
  metadataURL,
  sequenceApiURL,
  marketplaceApiURL,
  indexerURL,
} from '../consts';
import type { NetworkConfig } from './type';
import { allNetworks } from '@0xsequence/network';

export const SUPPORTED_NETWORKS = allNetworks
  .filter((n) => n.deprecated != true)
  .map((n) => {
    const network = {
      ...n,
      sequenceApiUrl: sequenceApiURL,
      marketplaceApiUrl: marketplaceApiURL(n.name),
      metadataUrl: metadataURL,
      indexerUrl: indexerURL(n.name),
      builderMarketplaceUrl: builderMarketplaceApi(),
    };

    if (network.name === 'avalanche' || network.name === 'optimism') {
      return {
        ...network,
        platformFeeRecipient: PLATFORM_FEE_RECIPIENT_AVALANCHE_OPTIMISM,
      };
    } else {
      return {
        ...network,
        platformFeeRecipient: DEFAULT_PLATFORM_FEE_RECIPIENT,
      };
    }
  }) satisfies NetworkConfig[];
