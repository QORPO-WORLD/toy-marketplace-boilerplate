import { ORDERBOOK_CONTRACT_ADDRESS } from '~/config/consts';
import { compareAddress } from '~/utils/address';

import { type GetPublicClientReturnType } from '@wagmi/core';
import { ethers } from 'ethers';
import type { Hex } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

export const getRequestIdFromHash = async (
  hash: string,
  walletClient: GetWalletClientData<any, any>,
  publicClient: GetPublicClientReturnType,
) => {
  if (!publicClient) return '';
  // Get requestId from logs and return it
  const receipt = await publicClient.getTransactionReceipt({
    hash: hash as Hex,
  });
  // Event logged:
  /*
    event RequestCreated(
      uint256 indexed requestId,
      address indexed creator,
      address indexed tokenContract,
      uint256 tokenId,
      bool isListing,
      uint256 quantity,
      address currency,
      uint256 pricePerToken,
      uint256 expiry
    );
  */
  let requestId = '';
  const signerAddress = walletClient.account.address;
  receipt.logs.forEach((log) => {
    const isOrderbookContract = compareAddress(
      log.address,
      ORDERBOOK_CONTRACT_ADDRESS,
    );
    const eventSignature = ethers.utils.id(
      'RequestCreated(uint256,address,address,uint256,bool,uint256,address,uint256,uint256)',
    );
    const isRequestCreatedEvent = eventSignature === (log.topics[0] as string);
    if (isOrderbookContract && isRequestCreatedEvent) {
      const creatorAddress = ethers.utils.defaultAbiCoder
        .decode(['address'], log.topics[2] as string)
        .toString();
      const isCreator = compareAddress(creatorAddress, signerAddress);
      if (isCreator) {
        requestId = ethers.utils.defaultAbiCoder
          .decode(['uint256'], log.topics[1] as string)
          .toString();
      }
    }
  });
  return requestId;
};
