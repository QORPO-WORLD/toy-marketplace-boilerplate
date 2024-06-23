import {
  type BatchCollectionArgs,
  type CollectionArgs,
  fetchCollectionMetadata,
  fetchCollectionsMetadata,
} from './fetchers';
import { getQueryClient } from './getQueryClient';
import { type GetContractInfoReturn } from '@0xsequence/metadata';
import { queryOptions } from '@tanstack/react-query';

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
      initialData: () => {
        const queryClient = getQueryClient();
        const data = queryClient.getQueryData([
          ...metadataQueries.batchCollections(),
        ]);
        return data?.find(
          (col: BatchCollectionReturn) => col?.[args.collectionId],
        ) as GetContractInfoReturn['contractInfo'];
      },
    }),
};
