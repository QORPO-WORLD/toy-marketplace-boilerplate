import { getChain } from '~/config/networks';
import { env } from '~/env';

import {
  SequenceMarketplace,
  SequenceOldMarketplace,
} from './marketplace/marketplaceApi';
import { SequenceAPIClient } from '@0xsequence/api';
import { SequenceIndexer } from '@0xsequence/indexer';
import { SequenceMetadata } from '@0xsequence/metadata';

const SEQUENCE_ACCESS_KEY = env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY;

const getNetworkConfig = (chainId: number | string) => {
  const networkConfig = getChain(chainId);
  if (!networkConfig) {
    throw new Error(`No network config found for chainId: ${chainId}`);
  }
  return networkConfig;
};

export const getMetadataClient = (chainId: number | string) => {
  const networkConfig = getNetworkConfig(chainId);
  return new SequenceMetadata(networkConfig.metadataUrl, SEQUENCE_ACCESS_KEY);
};

export const getSequenceAPIClient = (chainId: number | string) => {
  const networkConfig = getNetworkConfig(chainId);
  return new SequenceAPIClient(
    networkConfig.sequenceApiUrl,
    SEQUENCE_ACCESS_KEY,
  );
};

export const getIndexerClient = (chainId: number | string) => {
  const networkConfig = getNetworkConfig(chainId);
  return new SequenceIndexer(networkConfig.indexerUrl, SEQUENCE_ACCESS_KEY);
};

export const getMarketplaceClient = (chainId: number | string) => {
  const networkConfig = getNetworkConfig(chainId);
  return new SequenceMarketplace(
    networkConfig.marketplaceApiUrl,
    // SEQUENCE_ACCESS_KEY,
  );
};

export const getOldMarketplaceClient = (chainId: number | string) => {
  const networkConfig = getNetworkConfig(chainId);
  return new SequenceOldMarketplace(
    networkConfig.marketplaceApiUrl,
    // SEQUENCE_ACCESS_KEY,
  );
};
