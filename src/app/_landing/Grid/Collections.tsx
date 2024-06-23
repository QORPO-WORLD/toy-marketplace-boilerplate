import { type MarketConfig } from '~/config/marketplace';
import { metadataQueries } from '~/queries';
import { getQueryClient } from '~/queries/getQueryClient';

import { CollectionsGrid } from './Grid';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Flex, Text } from 'system';

type LandingCollectionsProps = {
  collections: MarketConfig['collections'];
  className?: string;
};

export const LandingCollections = ({
  collections,
  className,
}: LandingCollectionsProps) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    metadataQueries.batchCollection(
      collections.map((collection) => ({
        collectionId: collection.collectionAddress,
        chainID: collection.chainId.toString(),
      })),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Flex className="flex-col gap-4 @container/publisherCollectionsGrid">
        <Text className="size-sm font-bold text-foreground/50">
          Collections
        </Text>
        <CollectionsGrid data={collections} className={className} />
      </Flex>
    </HydrationBoundary>
  );
};
