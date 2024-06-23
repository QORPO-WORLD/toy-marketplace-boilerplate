import type { Chain } from 'viem';

export interface NetworkConfig {
  chainId: number;
  name: string;
  title: string;
  indexerUrl: string;
  metadataUrl: string;
  marketplaceApiUrl: string;
  sequenceApiUrl: string;
  // is this a test network
  isTestnet: boolean;
  // used with readonly multicall provider, so we can show on chain information even when user is not connected to the same network.
  // using https://nodes.sequence.app/* right now, can specify any compatible rpc node in network config
  readOnlyNodeURL: string;
  // block explorer URL
  explorerUrl: string;
  // block explorer name
  explorerName: string;

  viemChainConfig: Chain;

  customPlatformFeeRecipient?: string;
}
