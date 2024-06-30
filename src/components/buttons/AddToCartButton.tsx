'use client';

import { CollectionOfferModal$ } from '~/app/collection/[chainParam]/[collectionId]/buy/OfferModal';
import { getChainId } from '~/config/networks';
import { useCartItemFromCollectibleOrder } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { Routes } from '~/lib/routes';
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
  const itemType = useCartItemFromPath();
  const order = collectibleOrder.order;

  const { chainParam, collectionId } = Routes.collection.useParams();
  const chainId = getChainId(chainParam);

  let onClick: () => void;
  let label: ButtonLabel;

  switch (itemType) {
    case OrderItemType.BUY:
      if (cartItem) {
        onClick = () =>
          addCollectibleOrderToCart({
            collectibleOrder,
            itemType: OrderItemType.BUY,
          });
        label = ButtonLabel.REMOVE_FROM_CART;
      } else {
        onClick = () => {
          if (order) {
            addCollectibleOrderToCart({
              collectibleOrder,
              itemType: OrderItemType.BUY,
            });
          } else {
            CollectionOfferModal$.state.set({
              chainId,
              type: 'offer',
              collectionAddress: collectionId,
              tokenId: collectibleOrder.metadata.tokenId,
            });
            CollectionOfferModal$.open.set(true);
          }
          label = order ? ButtonLabel.ADD_TO_CART : ButtonLabel.PLACE_OFFER;
        };
        break;
      }
    case OrderItemType.SELL:
      onClick = () =>
        addCollectibleOrderToCart({
          collectibleOrder,
          itemType: OrderItemType.SELL,
        });
      label = ButtonLabel.SELL;
      break;

    case OrderItemType.TRANSFER:
      onClick = () =>
        addCollectibleOrderToCart({
          collectibleOrder,
          itemType: OrderItemType.TRANSFER,
        });
      label = cartItem
        ? ButtonLabel.REMOVE_FROM_TRANSFERS
        : ButtonLabel.TRANSFER;
      break;
    default:
      const _: never = itemType;
      return _;
  }

  return (
    <Button onClick={onClick} className={className}>
      {label}
    </Button>
  );
};

const useCartItemFromPath = () => {
  const path = usePathname();
  if (path.startsWith('/inventory')) {
    return OrderItemType.TRANSFER;
  } else if (path.endsWith('/buy')) {
    return OrderItemType.BUY;
  } else if (path.endsWith('/sell')) {
    return OrderItemType.SELL;
  }
};
