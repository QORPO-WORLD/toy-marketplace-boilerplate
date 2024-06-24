'use client';

import { OrderItemType } from '~/api';
import type { OrderbookOrder } from '~/api/temp/marketplace-api.gen';
import type { CollectiblesListProps } from '~/app/(page)/(marketplace)/collection/[chainParam]/[collectionId]/orderbook/[mode]/_components/Content/Collectibles/Grid/OrderbookTypes';
import { useCartItem } from '~/hooks/cart/useCartItem';
import { _addToCart_ } from '~/stores';
import type { AddToCartData } from '~/stores/cart/types';

import { Button } from '$ui';

type BaseProps = {
  addToCartData: AddToCartData;
  isAvailable: boolean;
  className?: string;
  orderbookOrderItem?: OrderbookOrder;
};

type PropsWithOrderModal = BaseProps & {
  onClickOrderModal: CollectiblesListProps['onClickOrderModal'];
  itemType: OrderItemType.BUY_ORDERBOOK | OrderItemType.SELL_ORDERBOOK;
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
    case OrderItemType.BUY_ORDERBOOK:
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
