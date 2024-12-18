import { Flex, Grid, Text, cn } from '$ui';
import { CollectionCard } from './Card/index';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';

type LandingCollectionsProps = {
  collections: MarketplaceConfig['collections'];
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
          `grid grid-cols-${collections.length < 3 ? '2' : '3'} gap-10 h-[31.8125rem] mb:grid-cols-1 mb:h-fit`,
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
