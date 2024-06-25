import { classNames } from '~/config/classNames';

import { Grid, cn } from '$ui';
import { OrderBookContent } from './marketplaceTypes/orderbook';

const CollectionContent = () => {
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
      <OrderBookContent {...props} />
    </Grid.Root>
  );
};
