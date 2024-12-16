'use client';

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';
import { getChain } from '~/lib/utils/getChain';

import { Grid, cn } from '$ui';
import { CollectibleCard } from './Card/CollectableCard';
import type { CollectibleOrder } from '@0xsequence/marketplace-sdk';

export type CollectiblesGridProps = {
  collectibleOrders: CollectibleOrder[];
  endReached?: () => void;
};

export const CollectiblesGrid = ({
  endReached,
  collectibleOrders,
}: CollectiblesGridProps) => {
  const { chainParam, collectionId } = Routes.collection.useParams();
  const chain = getChain(chainParam);

  return (
    <VirtuosoGrid
      className="@container/collectiblesGridContainer w-[99.9%]"
      useWindowScroll
      components={{
        List: GridContainer,
      }}
      itemContent={(index, data) => (
        <CollectibleCard
          key={index}
          tokenId={data.metadata.tokenId}
          collectionAddress={collectionId}
          collectionChainId={String(chain?.chainId)}
          order={data.order}
        />
      )}
      endReached={endReached}
      data={collectibleOrders}
    />
  );
};

type GridContainerProps = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const GridContainer = forwardRef(
  (props: GridContainerProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { className, ...otherProps } = props;

    return (
      <Grid.Root
        className={cn(
          `${classNames.collectiblesGrid} ${className}`,
          'auto-rows-[minmax(25rem,min-content) grid-flow-row',
          'grid-rows-[repeat(auto-fill,minmax(18.75rem, min-content))] grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-1',
          '@md/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(21.875rem, min-content))] @md/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(13.75rem,1fr))]',
          '@lg/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(21.875rem, min-content))] @lg/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(14.0625rem,1fr))]',
          '@xl/collectiblesGridContainer:grid-rows-[repeat(auto-fill,minmax(25rem, min-content))] @xl/collectiblesGridContainer:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]',
          '@md/collectiblesGridContainer:gap-2 @xl/collectiblesGridContainer:gap-3',
        )}
        ref={ref}
        {...otherProps}
      />
    );
  },
);

GridContainer.displayName = 'GridContainer';
