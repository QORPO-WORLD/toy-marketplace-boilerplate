import type { NetworkConfig as SequenceNetworkConfig } from '@0xsequence/network';
import { type Hex } from 'viem';

export interface NetworkConfig extends SequenceNetworkConfig {
  platformFeeRecipient: Hex;
  sequenceApiUrl: string;
  marketplaceApiUrl: string;
  metadataUrl: string;
  indexerUrl: string;
  builderMarketplaceUrl: string;
}
