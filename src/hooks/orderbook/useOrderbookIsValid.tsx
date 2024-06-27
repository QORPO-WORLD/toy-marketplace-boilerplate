import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { Orderbook } from '~/lib/sdk/orderbook/clients/Orderbook';

import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

export interface UseOrderbookIsValidArgs {
  requestId: bigint;
  quantity: bigint;
  chainId: number;
}

export const useOrderbookIsValid = (args: UseOrderbookIsValidArgs) =>
  useQuery({
    queryKey: [
      'orderbookIsValid',
      {
        ...args,
        requestId: args.requestId.toString(),
        quantity: args.quantity.toString(),
      },
    ],
    queryFn: () => {
      const orderbook = new Orderbook({
        chainId: args.chainId,
        contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
      });
      return orderbook.isRequestValid(args.requestId, args.quantity);
    },
    retry: false,
    enabled:
      !!args.chainId &&
      // allow requestId === 0n
      // !!args.requestId &&
      !!args.quantity,
  });
