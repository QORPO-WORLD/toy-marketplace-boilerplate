import { type MarketConfig } from '~/config/marketplace';

import { Flex, Grid, Text, cn } from '$ui';
import { CollectionCard } from './Card';

type LandingCollectionsProps = {
  collections: MarketConfig['collections'];
  className?: string;
};

export const LandingCollections = ({
  collections,
  className,
}: LandingCollectionsProps) => {
  return (
    <Flex className="flex-col gap-4 @container/publisherCollectionsGrid">
      <Grid.Root
        className={cn(
          `grid grid-cols-${collections.length < 3 ? '2' : '3'} gap-10`,
          className,
        )}
      >
        {collections.map((d) => {
          return <CollectionCard key={d.collectionAddress} {...d} />;
        })}
      </Grid.Root>
    </Flex>
  );
};
