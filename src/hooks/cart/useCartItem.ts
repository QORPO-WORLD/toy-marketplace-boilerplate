import { type CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { cartItemId, cartState } from '~/lib/stores/cart/Cart';
import {
  type CollectibleMetadata,
  OrderItemType,
} from '~/lib/stores/cart/types';

import { useSnapshot } from 'valtio';

type UseCartItemProps = {
  chainId: string;
  collectionAddress: string;
  tokenId: string;
  orderId?: string;
};

type CartFromCollectibleOrderProps = {
  collectibleOrder: CollectibleOrder;
  chainId: number;
  collectionId: string;
  itemType: OrderItemType;
};

export const useCartItem = ({
  collectibleOrder,
  chainId,
  collectionId,
  itemType,
}: CartFromCollectibleOrderProps) => {
  const { cartItems } = useSnapshot(cartState);
  const { order, metadata } = collectibleOrder;

  const collectibleMetadata = {
    chainId: chainId,
    collectionAddress: collectionId,
    tokenId: metadata.tokenId,
    name: metadata.name,
    imageUrl: metadata.image || '',
    decimals: metadata.decimals,
  } satisfies CollectibleMetadata;
  const orderId = order?.orderId.toString();

  const isTransfer = itemType === OrderItemType.TRANSFER;

  return cartItems.find(
    (i) =>
      cartItemId(i) ===
      cartItemId({
        collectibleMetadata,
        itemType,
        orderId: !isTransfer ? orderId : undefined,
      }),
  );
};