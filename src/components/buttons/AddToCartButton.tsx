'use client';

import { CollectionOfferModal$ } from '~/app/collection/[chainParam]/[collectionId]/buy/OfferModal';
import { useCartItemFromCollectibleOrder } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { addCollectibleOrderToCart } from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Button } from '$ui';
import { usePathname } from 'next/navigation';

enum ButtonLabel {
  PLACE_OFFER = 'Place offer',
  REMOVE_FROM_CART = 'Remove from cart',
  ADD_TO_CART = 'Add to cart',
  SELL = 'Sell',
  CREATE_LISTING = 'Create Listing',
  REMOVE_FROM_TRANSFERS = 'Remove from transfers',
  TRANSFER = 'Transfer token',
}

type AddToCartButtonProps = {
  className?: string;
  collectibleOrder: CollectibleOrder;
};

export const AddToCartButton = ({
  className,
  collectibleOrder,
}: AddToCartButtonProps) => {
  const cartItem = useCartItemFromCollectibleOrder(collectibleOrder);

  let onClick: () => void;
  let label: ButtonLabel;

  const itemType = useCartItemFromPath();

  const order = collectibleOrder.order;

  switch (itemType) {
    case OrderItemType.BUY:
      if (cartItem) {
        onClick = () => {}; //_addToCart_(addToCartData);
        label = ButtonLabel.REMOVE_FROM_CART;
      } else {
        onClick = () =>
          order
            ? addCollectibleOrderToCart(collectibleOrder)
            : CollectionOfferModal$.open.set(true);
        label = order ? ButtonLabel.ADD_TO_CART : ButtonLabel.PLACE_OFFER;
      }
      break;

    // case OrderItemType.SELL:
    //   onClick = () => _addToCart_(addToCartData);
    //   label = ButtonLabel.SELL;
    //   break;

    // case OrderItemType.TRANSFER:
    //   onClick = () => _addToCart_(addToCartData);
    //   label = cartItem
    //     ? ButtonLabel.REMOVE_FROM_TRANSFERS
    //     : ButtonLabel.TRANSFER;
    //   break;
    // default:
    //   const _: never = itemType;
    //   return _;
  }

  return (
    <Button onClick={onClick} className={className}>
      {label}
    </Button>
  );
};

export const useCartItemFromPath = () => {
  const path = usePathname();
  if (path.startsWith('/inventory')) {
    return OrderItemType.TRANSFER;
  } else if (path.endsWith('/buy')) {
    return OrderItemType.BUY;
  } else if (path.endsWith('/sell')) {
    return OrderItemType.SELL;
  }
};
