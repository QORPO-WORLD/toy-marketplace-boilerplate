import { type CartItem } from '~/lib/stores/cart/types';
import { OrderItemType } from '~/lib/stores/cart/types';

export const getTitleFromCartData = ({
  cartType,
  cartItems,
}: {
  cartType: OrderItemType;
  cartItems: readonly CartItem[];
}): string => {
  const multipleItemsSuffix = cartItems.length > 1 ? 's' : '';

  switch (cartType) {
    case OrderItemType.BUY: {
      return `ITEM${multipleItemsSuffix} SUCCESSFULLY BOUGHT`;
    }
    case OrderItemType.SELL: {
      return `ITEM${multipleItemsSuffix} SUCCESSFULLY SOLD`;
    }
    case OrderItemType.TRANSFER: {
      return `ITEM${multipleItemsSuffix} SUCCESSFULLY TRANSFERRED`;
    }
  }

  return '';
};

export const getSubTitleFromCartData = ({
  cartType,
  cartItems,
}: {
  cartType: OrderItemType;
  cartItems: readonly CartItem[];
}): string => {
  switch (cartType) {
    case OrderItemType.BUY: {
      return `Bought ${cartItems.length > 1 ? cartItems.length + ' items' : ''}`;
    }
    case OrderItemType.SELL: {
      return `Sold ${cartItems.length > 1 ? cartItems.length + ' items' : ''}`;
    }

    case OrderItemType.TRANSFER: {
      return `Transferred`;
    }
  }
};
