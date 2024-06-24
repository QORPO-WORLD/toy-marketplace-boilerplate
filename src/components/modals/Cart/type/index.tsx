'use client';

import { memo } from 'react';

import { OrderItemType } from '~/api/types/order';
import { cartState } from '~/lib/stores';

import { OrderbookOrderComponents } from './orderbook';
import { TransferOrderComponents } from './transfer';
import { useSnapshot } from 'valtio';

export const OrderRenderer = memo(() => {
  const {
    baseOrderInfo: { orderType },
  } = useSnapshot(cartState);

  switch (orderType) {
    case OrderItemType.TRANSFER:
      return <TransferOrderComponents />;
    case OrderItemType.BUY_ORDERBOOK:
    case OrderItemType.SELL_ORDERBOOK:
      return <OrderbookOrderComponents />;
    default:
      return <></>;
  }
});
