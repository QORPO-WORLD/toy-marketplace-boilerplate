'use client';

import { addCollectibleOrderToCart } from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Button } from '$ui';
import type { CollectibleOrder } from '@0xsequence/marketplace-sdk';
import type { ContractType } from '@0xsequence/metadata';
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
  chainId: number;
  collectionId: string;
  collectibleOrder: CollectibleOrder;
  contractType?: ContractType;
};

export const AddToCartButton = ({
  className,
  chainId,
  collectionId,
  collectibleOrder,
  contractType,
}: AddToCartButtonProps) => {
  const itemType = useOrderItemFromPath();
  const order = collectibleOrder.order;

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
          }
        };
        label = order ? ButtonLabel.ADD_TO_CART : ButtonLabel.PLACE_OFFER;
      }
      break;
    case OrderItemType.SELL:
      onClick = () => {};
      label = ButtonLabel.SELL;
      break;

    // case OrderItemType.TRANSFER:
    //   onClick = () =>
    //     addTransferOrderToCart({
    //       metadata: collectibleOrder.metadata,
    //       itemType: OrderItemType.TRANSFER,
    //       contractType: contractType!,
    //     });
    //   label = cartItem
    //     ? ButtonLabel.REMOVE_FROM_TRANSFERS
    //     : ButtonLabel.TRANSFER;
    //   break;
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

const useOrderItemFromPath = () => {
  const path = usePathname();
  if (path.startsWith('/inventory')) {
    return OrderItemType.TRANSFER;
  } else if (path.endsWith('/buy')) {
    return OrderItemType.BUY;
  } else if (path.endsWith('/sell')) {
    return OrderItemType.SELL;
  }
  return OrderItemType.BUY;
};
