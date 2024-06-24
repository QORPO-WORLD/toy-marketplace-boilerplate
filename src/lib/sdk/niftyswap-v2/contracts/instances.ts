import { getPublicClient } from '~/config/networks/wagmi/rpcClients';
import { ERC721_ABI } from '~/sdk/shared/abi/token/ERC721';

import { ERC20_ABI } from '../../shared/abi/token/ERC20';
import { ERC1155_ABI } from '../../shared/abi/token/ERC1155';
import { Niftyswap20_ABI } from './abi/niftyswap/Niftyswap20';
import { NiftyswapFactory20_ABI } from './abi/niftyswap/NiftyswapFactory20';
import type { Hex, WalletClient } from 'viem';
import { getContract } from 'viem';

interface ContractInstanceParams {
  contractAddress: string;
  chainId: number;
  signer?: WalletClient;
}

// ERC20: ERC1155 Exchange
export const getNiftyswap20Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: Niftyswap20_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};

export const getNiftyswapFactory20Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: NiftyswapFactory20_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};

// ERC1155 asset contract
export const getERC1155Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: ERC1155_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};

// ERC20 base currency contract
export const getERC20Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: ERC20_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};

export const getERC721Contract = (args: ContractInstanceParams) => {
  const publicClient = getPublicClient(args.chainId);

  return getContract({
    address: args.contractAddress as Hex,
    abi: ERC721_ABI,
    client: {
      public: publicClient,
      wallet: args.signer,
    },
  });
};
