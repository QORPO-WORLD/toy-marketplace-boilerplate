import {
  type BatchCollectionArgs,
  type CollectionArgs,
  fetchCollectionsMetadata,
  fetchTokenMetadata,
  fetchCollectionFilters,
  fetchTokenBalances,
  type TokenBalancesArgs,
  fetchCurrencies,
  fetchHighestOffer,
  fetchLowestListing,
  fetchListHighestOffers,
  fetchListLowestListings,
  fetchContractInfo,
} from './fetchers';
import type { Page } from '@0xsequence/indexer';
import {
  type GetTokenMetadataArgs,
  type TokenCollectionFiltersArgs,
} from '@0xsequence/metadata';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

type BatchCollectionReturn = ReturnType<typeof fetchCollectionsMetadata>;

export const collectionQueries = {
  all: () => ['collections'],
  lists: () => [...collectionQueries.all(), 'lists'],
  list: (args: BatchCollectionArgs) =>
    queryOptions({
      queryKey: [...collectionQueries.lists(), args],
      queryFn: () => fetchCollectionsMetadata(args),
    }),
  details: () => [...collectionQueries.all(), 'details'],
  detail: (args: CollectionArgs) =>
    queryOptions({
      queryKey: [...collectionQueries.details(), args],
      queryFn: () => fetchContractInfo(args),
      // initialData: () => {
      //   const queryClient = getQueryClient();
      //   const data = queryClient.getQueryData([
      //     ...metadataQueries.batchCollections(),
      //   ]);
      //   return data?.find(
      //     (col: BatchCollectionReturn) => col?.[args.collectionId],
      //   ) as GetContractInfoReturn['contractInfo'];
      // },
    }),
  filters: () => [...collectionQueries.all(), 'filters'],
  filter: (args: TokenCollectionFiltersArgs) =>
    queryOptions({
      queryKey: [...collectionQueries.filters(), args],
      queryFn: () => fetchCollectionFilters(args),
    }),
};

export const collectableQueries = {
  all: () => ['collectables'],
  lists: () => [...collectableQueries.all(), 'lists'],
  listLowestListings: () => [...collectableQueries.lists(), 'lowestListings'],
  listLowestListing: (args: Parameters<typeof fetchListLowestListings>[0]) =>
    infiniteQueryOptions({
      queryKey: [...collectableQueries.listLowestListings(), args],
      queryFn: ({ pageParam }) =>
        fetchListLowestListings({
          ...args,
          page: pageParam,
        }),
      initialPageParam: { page: 1, pageSize: 30 },
      getNextPageParam: (lastPage) =>
        lastPage.page?.more ? lastPage.page : undefined,
    }),
  listHighestOffers: () => [...collectableQueries.lists(), 'highestOffers'],
  listHighestOffer: (args: Parameters<typeof fetchListHighestOffers>[0]) =>
    infiniteQueryOptions({
      queryKey: [...collectableQueries.listHighestOffers(), args],
      queryFn: ({ pageParam }) =>
        fetchListHighestOffers({
          ...args,
          page: pageParam,
        }),
      initialPageParam: { page: 1, pageSize: 30 },
      getNextPageParam: (lastPage) =>
        lastPage.page?.more ? lastPage.page : undefined,
    }),
  details: () => [...collectableQueries.all(), 'details'],
  detail: (args: GetTokenMetadataArgs) =>
    queryOptions({
      queryKey: [...collectableQueries.details(), args],
      queryFn: () => fetchTokenMetadata(args),
    }),
  lowestListings: () => [...collectableQueries.all(), 'listings'],
  lowestListing: (args: Parameters<typeof fetchLowestListing>[0]) =>
    queryOptions({
      queryKey: [...collectableQueries.lowestListings(), args],
      queryFn: () => fetchLowestListing(args),
    }),
  highestOffers: () => [...collectableQueries.all(), 'offers'],
  highestOffer: (args: Parameters<typeof fetchHighestOffer>[0]) =>
    queryOptions({
      queryKey: [...collectableQueries.highestOffers(), args],
      queryFn: () => fetchHighestOffer(args),
    }),
};

export const currencyQueries = {
  all: () => ['currencies'],
  lists: () => [...currencyQueries.all(), 'lists'],
  list: (args: { chainId: number }) =>
    queryOptions({
      queryKey: [...currencyQueries.lists(), args],
      queryFn: () => fetchCurrencies(args),
    }),
};

export const balanceQueries = {
  all: () => ['balances'],
  lists: () => [...balanceQueries.all(), 'tokenBalances'],
  list: (args: TokenBalancesArgs) =>
    infiniteQueryOptions({
      queryKey: [balanceQueries.lists(), args],
      queryFn: ({ pageParam }: { pageParam?: Page }) =>
        fetchTokenBalances({ ...args, page: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: ({ page: pageResponse }) =>
        pageResponse.more ? pageResponse : undefined,
    }),
};
