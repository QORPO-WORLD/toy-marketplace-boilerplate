import {
  Orderbook,
  SEQUENCE_MARKET_V1_ADDRESS,
} from '~/sdk/orderbook/clients/Orderbook';

import { orderbookKeys, time } from '../data';
import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

export interface UseOrderbookIsValidBatchArgs {
  requestIds: bigint[];
  quantities: bigint[];
  chainId: number;
}

export const useOrderbookIsValidBatch = (args: UseOrderbookIsValidBatchArgs) =>
  useQuery({
    queryKey: [
      ...orderbookKeys.useOrderbookIsValid(),
      {
        ...args,
        requestIds: args.requestIds.map((r) => r.toString()),
        quantities: args.quantities.map((q) => q.toString()),
      },
    ],
    queryFn: () => {
      const orderbook = new Orderbook({
        chainId: args.chainId,
        contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
      });

      return orderbook.isRequestValidBatch(args.requestIds, args.quantities);
    },
    retry: false,
    staleTime: 1 * time.oneMinute,
    enabled:
      !!args.chainId && !!args.requestIds.length && !!args.quantities.length,
  });
