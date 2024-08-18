import { getChain } from '..';
import { getDefaultChains } from '@0xsequence/kit';
import { createPublicClient, http } from 'viem';

export const getPublicClient = (chainId: number) => {
  const networkConfig = getChain(chainId);
  const chain = getDefaultChains([chainId])[0];
  if (!networkConfig || !chain) {
    throw new Error(`Invalid chainId: ${chainId}`);
  }

  return createPublicClient({
    chain: {
      ...chain,
      rpcUrls: {
        default: {
          http: [networkConfig.rpcUrl],
        },
        public: {
          http: [networkConfig.rpcUrl],
        },
      },
    },
    batch: {
      multicall: true,
    },
    transport: http(),
  });
};
