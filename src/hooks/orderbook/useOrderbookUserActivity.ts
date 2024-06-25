import { getOrderbookUserActivities } from '~/api/orderbook/getUserActivities';
import type { GetUserActivitiesArgs } from '~/api/temp/marketplace-api.gen';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';

import { orderbookKeys } from '../data';
import type { Page } from '@0xsequence/indexer';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useOrderbookUserActivity = (
  chainId: number,
  args: Omit<GetUserActivitiesArgs, 'orderbookContractAddress'>,
) =>
  useInfiniteQuery({
    queryKey: [...orderbookKeys.useOrderbookUserActivity(), args],
    queryFn: ({ pageParam }: { pageParam?: Page }) =>
      getOrderbookUserActivities(chainId, {
        ...args,
        orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
        page: {
          ...pageParam,
          ...(args?.page?.sort ? { sort: args?.page?.sort } : {}),
        },
      }),
    initialPageParam: undefined,
    getNextPageParam: ({ data: { page: pageResponse } }) =>
      pageResponse?.more ? pageResponse : undefined,
    enabled: !!args.currencyAddresses.length && !!args.collectionAddress,
    refetchInterval: 30000,
  });
