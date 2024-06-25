import { getOrderbookOrders } from '~/api';
import type { GetOrderbookOrdersArgs } from '~/api/types/orderbook';
import { OrderStatus } from '~/api/types/orderbook';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';

import { orderbookKeys } from '../data';
import type { Page } from '@0xsequence/indexer';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useOrderbookAPI = (
  chainId: number,
  args: Omit<GetOrderbookOrdersArgs, 'orderbookContractAddress'>,
  onlyOpenOrders: boolean,
) =>
  useInfiniteQuery({
    queryKey: [...orderbookKeys.useOrderbookAPI(), args],
    queryFn: ({ pageParam }: { pageParam?: Page }) =>
      getOrderbookOrders(chainId, {
        ...args,
        orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
        page: {
          ...pageParam,
          ...(args?.page?.sort ? { sort: args?.page?.sort } : {}),
        },
      }).then((res) => ({
        ...res,
        data: {
          ...res.data,
          orders: onlyOpenOrders
            ? res.data.orders.filter((order) => {
                const isExpired =
                  new Date().getTime() > Number(order.expiry) * 1000;
                const isOpen =
                  order.orderStatus === OrderStatus.OPEN && !isExpired;
                return isOpen;
              })
            : res.data.orders,
        },
      })),
    initialPageParam: undefined,
    getNextPageParam: ({ data: { page: pageResponse } }) =>
      pageResponse?.more ? pageResponse : undefined,
    enabled: !!args.currencyAddresses.length && !!args.collectionAddress,
    refetchInterval: 30000,
  });
