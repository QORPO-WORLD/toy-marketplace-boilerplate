import type { GetFloorPriceArgs } from '~/api/temp/marketplace-api.gen';

import { fetchFloorPrice } from '../../clients';
import type { OrderRequest } from '../../sdk/orderbook/clients/Orderbook';
import { orderbookKeys, time } from '../data';
import { useQuery } from '@tanstack/react-query';

export interface OrderWithID extends OrderRequest {
  orderId: string;
}

export const useOrderbookFloorPrice = (
  chainId: number,
  args: GetFloorPriceArgs,
) =>
  useQuery({
    queryKey: [...orderbookKeys.useOrderbookFloorPrice(), JSON.stringify(args)],
    queryFn: () => {
      return fetchFloorPrice(chainId, args);
    },
    retry: false,
    refetchInterval: 15 * time.oneMinute,
    enabled:
      !!args.collectionAddress &&
      !!args.orderbookContractAddress &&
      !!args.currencyAddresses,
  });
