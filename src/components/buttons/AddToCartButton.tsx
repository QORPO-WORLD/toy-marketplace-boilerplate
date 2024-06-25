'use client';

import { useCartItem } from '~/hooks/cart/useCartItem';
import { _addToCart_ } from '~/lib/stores/cart/Cart';
import type { AddToCartData } from '~/lib/stores/cart/types';
import { OrderItemType } from '~/types/OrderItemType';

import { Button } from '$ui';
import type { OrderbookOrder } from '@0xsequence/indexer';

type BaseProps = {
  addToCartData: AddToCartData;
  isAvailable: boolean;
  className?: string;
  orderbookOrderItem?: OrderbookOrder;
};

type PropsWithOrderModal = BaseProps & {
  onClickOrderModal: CollectiblesListProps['onClickOrderModal'];
  itemType: OrderItemType.BUY | OrderItemType.SELL;
};

type PropsWithoutOrderModal = BaseProps & {
  onClickOrderModal?: CollectiblesListProps['onClickOrderModal'];
  itemType: OrderItemType.TRANSFER;
};

export type AddToCartButtonProps = PropsWithOrderModal | PropsWithoutOrderModal;

enum ButtonLabel {
  PLACE_OFFER = 'Place offer',
  REMOVE_FROM_CART = 'Remove from cart',
  ADD_TO_CART = 'Add to cart',
  SELL = 'Sell',
  CREATE_LISTING = 'Create Listing',
  REMOVE_FROM_TRANSFERS = 'Remove from transfers',
  TRANSFER = 'Transfer token',
}

export const AddToCartButton = ({
  addToCartData,
  isAvailable,
  className,
  itemType,
  onClickOrderModal,
  orderbookOrderItem,
}: AddToCartButtonProps) => {
  const { cartItem } = useCartItem(addToCartData);

  let onClick: () => void;
  let label: ButtonLabel;

  switch (itemType) {
    case OrderItemType.BUY:
      if (cartItem) {
        onClick = () => _addToCart_(addToCartData);
        label = ButtonLabel.REMOVE_FROM_CART;
      } else {
        onClick = () =>
          isAvailable
            ? _addToCart_(addToCartData)
            : onClickOrderModal(addToCartData.item.collectibleMetadata.tokenId);
        label = isAvailable ? ButtonLabel.ADD_TO_CART : ButtonLabel.PLACE_OFFER;
      }
      break;

    case OrderItemType.TRANSFER:
      onClick = () => _addToCart_(addToCartData);
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
