import { formatDecimals } from '~/api';
import { OrderItemType } from '~/api/types';
import { type MarketConfig } from '~/config/marketplace';
import type { AddToCartData } from '~/lib/stores/cart/types';
import { CartType } from '~/lib/stores/cart/types';
import type { AddToCartButtonProps } from '~/modules/CollectableGrid/AddToCartButton';
import type { Badge } from '~/modules/CollectableGrid/CollectableCard';
import { defaultSelectionQuantity } from '~/utils/quantity';

import type { TokenBalance } from '@0xsequence/indexer';
import { formatDisplay } from '@0xsequence/kit';

export const getInvetoryCardData = ({
  collectible,
  isERC1155,
  isERC721,
  marketConfig,
}: {
  collectible: TokenBalance;
  isERC1155?: boolean;
  isERC721?: boolean;
  marketConfig: MarketConfig;
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
    type: CartType.TRANSFER,
    item: {
      itemType: OrderItemType.TRANSFER,
      contractType: contractType,
      collectibleMetadata: metadata,
      chainId,
      quantity: defaultSelectionQuantity({
        type: OrderItemType.TRANSFER,
        tokenDecimals: decimals,
        tokenUserBalance: balance ? BigInt(balance) : 0n,
      }),
    },
    options: {
      toggle: true,
    },
  } satisfies AddToCartData;

  const addToCartButtonProps = {
    addToCartData,
    isAvailable: true,
    itemType: OrderItemType.TRANSFER,
  } satisfies AddToCartButtonProps;

  return {
    link: getInventoryCollectibleRoute({
      chainId,
      contractAddress,
      tokenId,
      isERC1155,
      isERC721,
      tokenMetadata,
      marketConfig,
    }),
    key: tokenId,
    image: metadata.imageUrl,
    tokenId: tokenId,
    name: name,
    addToCartButtonProps,
    badges: [
      {
        label: 'OWNED',
        value: formatDisplay(formatDecimals(balance, decimals)),
        variant: 'muted',
      } satisfies Badge,
    ],
  };
};
