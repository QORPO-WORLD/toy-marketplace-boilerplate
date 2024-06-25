import type { GetTopOrdersArgs } from '~/api/temp/marketplace-api.gen';

import { fetchTopOrders } from '../../clients';
import type { OrderRequest } from '../../sdk/orderbook/clients/Orderbook';
import { orderbookKeys, time } from '../data';
import { useQuery } from '@tanstack/react-query';

export interface OrderWithID extends OrderRequest {
  orderId: string;
}

export const useOrderbookTopOrders = (
  chainId: number,
  args: GetTopOrdersArgs,
  disabled = false,
) =>
  useQuery({
    queryKey: [...orderbookKeys.useOrderbookTopOrders(), JSON.stringify(args)],
    queryFn: () => {
      return fetchTopOrders(chainId, args);
    },
    retry: false,
    refetchInterval: 15 * time.oneMinute,
    enabled:
      !!args.collectionAddress &&
      !!args.tokenIDs &&
      !!args.currencyAddresses &&
      !disabled,
  });
