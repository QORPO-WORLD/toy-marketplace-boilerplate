import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import {
  type OrderRequest,
  Orderbook,
} from '~/lib/sdk/orderbook/clients/Orderbook';

import { useQuery } from '@tanstack/react-query';

interface Props {
  chainId: number;
  orderIds: string[];
  disabled?: boolean;
}

export interface OrderWithID extends OrderRequest {
  orderId: string;
}

export const useOrderbookOrders = (props: Props) => {
  const { data: ordersRaw, isLoading } = useGetOrderBatch({
    chainId: props.chainId,
    orderIds: props.orderIds,
    disabled: props.disabled,
  });

  // if orderId is invalid, a null order object is returned from above, filter these out
  const orders = ordersRaw ? ordersRaw.filter((order) => !!order) : [];

  const ordersWithID = orders.map((order, index) => {
    return {
      ...order,
      orderId: props.orderIds[index],
    };
  });

  return {
    orders: ordersWithID,
    isLoading,
  };
};

export const useGetOrderBatch = (
  arg: Partial<{ chainId: number; orderIds: string[]; disabled?: boolean }>,
) =>
  useQuery({
    queryKey: ['userOrderbookOrders', JSON.stringify(arg)],
    queryFn: () => {
      const orderbook = new Orderbook({
        chainId: arg.chainId!,
        contractAddress: SEQUENCE_MARKET_V1_ADDRESS,
      });

      return orderbook.getRequestBatch(arg.orderIds!);
    },
    retry: false,
    refetchInterval: 15000,
    enabled:
      !!arg.chainId && !!arg.orderIds && !!arg.orderIds.length && !arg.disabled,
  });
