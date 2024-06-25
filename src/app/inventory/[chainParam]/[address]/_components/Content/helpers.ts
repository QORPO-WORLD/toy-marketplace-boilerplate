import { Routes } from '~/lib/routes';
import type { AddToCartData } from '~/lib/stores/cart/types';

import type { TokenBalance } from '@0xsequence/indexer';

export const getInvetoryCardData = ({
  collectible,
}: {
  collectible: TokenBalance;
}) => {
  const {
    tokenID,
    tokenMetadata,
    balance,
    chainId,
    contractAddress,
    contractType,
  } = collectible;

  const { tokenId, name, image, decimals } = tokenMetadata || {
    tokenId: tokenID,
    name: '',
    image: '',
    decimals: 0,
  };
  const metadata = {
    chainId,
    collectionAddress: contractAddress,
    tokenId: tokenId,
    name: name,
    imageUrl: image || '',
    decimals: decimals,
  };

  const addToCartData = {
    // type: CartType.TRANSFER,
    // item: {
    //   itemType: OrderItemType.TRANSFER,
    //   contractType: contractType,
    //   collectibleMetadata: metadata,
    //   chainId,
    //   quantity: defaultSelectionQuantity({
    //     type: OrderItemType.TRANSFER,
    //     tokenDecimals: decimals,
    //     tokenUserBalance: balance ? BigInt(balance) : 0n,
    //   }),
    // },
    // options: {
    //   toggle: true,
    // },
  } satisfies AddToCartData;

  const addToCartButtonProps = {
    // addToCartData,
    // isAvailable: true,
    // itemType: OrderItemType.TRANSFER,
  } satisfies AddToCartButtonProps;

  return {
    link: Routes.collectible({
      chainId: metadata.chainId,
      collectionAddress: metadata.collectionAddress,
      tokenId: metadata.tokenId,
    }),
    key: tokenId,
    image: metadata.imageUrl,
    tokenId: tokenId,
    name: name,
    addToCartButtonProps,
    badges: [
      {
        label: 'OWNED',
        // value: formatDisplay(formatDecimals(balance, decimals)),
        variant: 'muted',
      } satisfies Badge,
    ],
  };
};
