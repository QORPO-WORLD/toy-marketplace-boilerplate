'use client';

import { getChainId } from '~/config/networks';
import { getMarketplaceClient } from '~/lib/queries/clients';
import { MarketplaceKind } from '~/lib/queries/marketplace/marketplace.gen';
import { type Routes } from '~/lib/routes';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { type Page } from '@0xsequence/metadata';
import { observer } from '@legendapp/state/react';
import { useInfiniteQuery } from '@tanstack/react-query';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam)!;
  const marketplace = getMarketplaceClient(chainId);
  const { collectionId } = params;

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();

  const collectiblesResponse = useInfiniteQuery({
    queryKey: ['collection', collectionId, text, properties],
    initialPageParam: { page: 1, pageSize: 30 },
    getNextPageParam: (lastPage) => {
      if (!lastPage.tokenMetadata || !lastPage.page.page) return undefined;
      return {
        ...lastPage.page,
        page: lastPage.page.page + 1,
      };
    },
    queryFn: ({ pageParam }: { pageParam?: Page }) => {
      return marketplace.listCollectiblesWithLowestListing({
        chainID: chainId.toString(),
        contractAddress: collectionId,
        page: pageParam,
        filter: {
          text,
          properties,
          marketplaces: [MarketplaceKind.sequence_marketplace_v1],
        },
      });
    },
  });

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((p) => p.collectibles) ?? [];

  return (
    <CollectiblesGrid
      endReached={collectiblesResponse.fetchNextPage}
      data={collectibles}
    />
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
