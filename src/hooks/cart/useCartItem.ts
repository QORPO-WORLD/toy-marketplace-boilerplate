import { cartItemId, cartState } from '~/lib/stores';
import type { AddToCartData } from '~/lib/stores/cart/types';
import { CartType } from '~/lib/stores/cart/types';

import { useSnapshot } from 'valtio';

export const useCartItem = (addToCartData?: AddToCartData) => {
  const { cartItems } = useSnapshot(cartState);

  let cartItem = undefined;

  const collectibleMetadata = addToCartData?.item.collectibleMetadata;
  const itemType = addToCartData?.item.itemType;

  if (collectibleMetadata && itemType) {
    const item = cartItems.find(
      (i) =>
        cartItemId(i) ===
        cartItemId({
          collectibleMetadata,
          itemType,
          orderbookOrderId:
            addToCartData.type === CartType.ORDERBOOK
              ? addToCartData.item.orderbookOrderId
              : undefined,
        }),
    );

    cartItem = item;
  }

  return {
    cartItem,
  };
};
