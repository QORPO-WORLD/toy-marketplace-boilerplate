import { OrderItemType } from '~/api/types/order';
import type { CartItem } from '~/stores';

export const getTitleFromCartData = ({
  cartType,
  cartItems,
}: {
  cartType: OrderItemType;
  cartItems: readonly CartItem[];
}): string => {
  const multipleItemsSuffix = cartItems.length > 1 ? 's' : '';

  switch (cartType) {
    case OrderItemType.BUY_AMM: {
      return `ITEM${multipleItemsSuffix} SUCCESSFULLY BOUGHT`;
    }
    case OrderItemType.SELL_AMM: {
      return `ITEM${multipleItemsSuffix} SUCCESSFULLY SOLD`;
    }
    case OrderItemType.DEPOSIT: {
      return `NEW POSITION${multipleItemsSuffix} CREATED`;
    }
    case OrderItemType.WITHDRAW: {
      return `POSITION${multipleItemsSuffix} WITHDRAWN`;
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
    case OrderItemType.BUY_AMM: {
      return `Bought ${cartItems.length > 1 ? cartItems.length + ' items' : ''}`;
    }
    case OrderItemType.SELL_AMM: {
      return `Sold ${cartItems.length > 1 ? cartItems.length + ' items' : ''}`;
    }
    case OrderItemType.DEPOSIT: {
      return `
        ${cartItems.length > 1 ? cartItems.length + ' New positions' : ''} \n\n
        Deposited`;
    }
    case OrderItemType.WITHDRAW: {
      return `Withdrawn`;
    }
    case OrderItemType.TRANSFER: {
      return `Transferred`;
    }
  }

  return '';
};
