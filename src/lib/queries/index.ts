import {
  type BatchCollectionArgs,
  type CollectionArgs,
  fetchCollectionMetadata,
  fetchCollectionsMetadata,
  fetchTokenMetadata,
  fetchCollectionFilters,
  fetchTokenBalances,
  type TokenBalancesArgs,
  fetchTopOrders,
} from './fetchers';
import { type Page } from '@0xsequence/indexer';
import {
  type GetTokenMetadataArgs,
  type TokenCollectionFiltersArgs,
} from '@0xsequence/metadata';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

type BatchCollectionReturn = ReturnType<typeof fetchCollectionsMetadata>;

export const metadataQueries = {
  all: () => ['metadata'],
  batchCollections: () => [...metadataQueries.all(), 'batchCollections'],
  batchCollection: (args: BatchCollectionArgs) =>
    queryOptions({
      queryKey: [...metadataQueries.batchCollections(), args],
      queryFn: () => fetchCollectionsMetadata(args),
    }),
  collections: () => [...metadataQueries.all(), 'collections'],
  collection: (args: CollectionArgs) =>
    queryOptions({
      queryKey: [...metadataQueries.collections(), args],
      queryFn: () => fetchCollectionMetadata(args),
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
  collectables: () => [...metadataQueries.all(), 'collectable'],
  collectible: (args: GetTokenMetadataArgs) =>
    queryOptions({
      queryKey: [...metadataQueries.collectables(), args],
      queryFn: () => fetchTokenMetadata(args),
    }),
  collectibleFilters: () => [...metadataQueries.all(), 'collectibleFilters'],
  collectibleFilter: (args: TokenCollectionFiltersArgs) =>
    queryOptions({
      queryKey: metadataQueries.collectibleFilters(),
      queryFn: () => fetchCollectionFilters(args),
    }),
};

export const indexerQueries = {
  all: () => ['indexer'],
  tokenBalances: () => [...indexerQueries.all(), 'tokenBalances'],
  tokenBalance: (args: TokenBalancesArgs) =>
    infiniteQueryOptions({
      queryKey: [indexerQueries.tokenBalances(), args],
      queryFn: ({ pageParam }: { pageParam?: Page }) =>
        fetchTokenBalances({ ...args, page: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: ({ page: pageResponse }) =>
        pageResponse.more ? pageResponse : undefined,
    }),
};

export const marketplaceQueries = {
  all: () => ['marketplace'],
  topOrders: () => [...marketplaceQueries.all(), 'topOrder'],
  topOrder: (args: Parameters<typeof fetchTopOrders>[0]) =>
    queryOptions({
      queryKey: [marketplaceQueries.topOrders(), args],
      queryFn: () => fetchTopOrders(args),
    }),
};
