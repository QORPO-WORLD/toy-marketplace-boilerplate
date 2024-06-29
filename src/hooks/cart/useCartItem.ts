import { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { cartItemId, cartState } from '~/lib/stores/cart/Cart';
import {
  CartType,
  CollectibleMetadata,
  OrderItemType,
} from '~/lib/stores/cart/types';

import { useSnapshot } from 'valtio';

type UseCartItemProps = {
  itemType: CartType;
  chainId: string;
  collectionAddress: string;
  tokenId: string;
  orderId?: string;
};

export const useCartItemFromCollectibleOrder = (props?: CollectibleOrder) => {
  const { cartItems } = useSnapshot(cartState);

  if (!props?.order) return;

  let cartItem = undefined;

  const order = props?.order;

  const collectibleMetadata = {
    chainId: order.chainId,
    collectionAddress: props.order.collectionId.toString(),
    tokenId: props.metadata.tokenId,
    name: props.metadata.name,
    imageUrl: props.metadata.image || '',
    decimals: props.metadata.decimals,
  } satisfies CollectibleMetadata;
  const itemType = OrderItemType.BUY;
  const orderId = order.id.toString();

  const item = cartItems.find(
    (i) =>
      cartItemId(i) ===
      cartItemId({
        collectibleMetadata,
        itemType,
        orderId: itemType !== OrderItemType.TRANSFER ? orderId : undefined,
      }),
  );

  cartItem = item;

  return cartItem;
};

export const useCartItem = (props?: UseCartItemProps) => {
  // const { cartItems } = useSnapshot(cartState);
  // let cartItem = undefined;
  // const item = cartItems.find(
  //   (i) =>
  //     cartItemId(i) ===
  //     cartItemId({
  //       collectibleMetadata,
  //       itemType,
  //       orderId:
  //         addToCartData.type === CartType.ORDERBOOK
  //           ? addToCartData.item.orderId
  //           : undefined,
  //     }),
  // );
  // cartItem = item;
  // return {
  //   cartItem,
  // };
};
