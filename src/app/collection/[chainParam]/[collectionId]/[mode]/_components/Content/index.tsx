import type { ComponentProps } from 'react';

import { classNames } from '~/config/classNames';

import { Grid, cn } from '$ui';
import { FilterBadges } from '../../../../_components';
import { OrderBookContent } from './marketplaceTypes/orderbook';

const CollectionContentBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid.Root
      className={cn(classNames.collectionContent, 'min-h-screen')}
      template={`
      [row1-start] "collection-content-label" min-content [row1-end]
      [row2-start] "collection-filter-badges" [row1-end]
      [row3-start] "collection-loading-spinner" [row3-end]
      [row4-start] "collection-collectibles" 1fr [row4-end]
      [row5-start] "collection-content-footer" [row5-end]
      / 100%
      `}
    >
      {children}
    </Grid.Root>
  );
};

export const CollectionContent = (
  props: ComponentProps<typeof OrderBookContent>,
) => (
  <CollectionContentBase>
    <FilterBadges
      marketType="orderbook"
      collectionAddress={props.collectionId}
      chainId={props.chainId}
    />
    <OrderBookContent {...props} />
  </CollectionContentBase>
);
