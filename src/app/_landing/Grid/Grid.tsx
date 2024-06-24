import { memo } from 'react';

import type { MarketConfig } from '~/config/marketplace';

import { Grid, cn } from '$ui';
import { CollectionCard } from './Card';

type CollectionGridProps = {
  className?: string;
  data: MarketConfig['collections'];
};

export const CollectionsGrid = memo(
  ({ className, data }: CollectionGridProps) => {
    return (
      <Wrapper className={className}>
        {data.map((d) => {
          return <CollectionCard key={d.collectionAddress} {...d} />;
        })}
      </Wrapper>
    );
  },
);

CollectionsGrid.displayName = 'CollectionsGrid';

const Wrapper = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Grid.Root
    className={cn(
      'grid-flow-row auto-rows-[minmax(380px,381px)] grid-cols-[repeat(auto-fill,minmax(260px,1fr))] grid-rows-[minmax(380px,381px)] gap-4',
      'md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]',
      className,
    )}
  >
    {children}
  </Grid.Root>
);
