'use client';

import { getChainId } from '~/config/networks';
import { getMarketplaceClient } from '~/lib/queries/clients';
import {
  MarketplaceKind,
  type Page,
} from '~/lib/queries/marketplace/marketplace.gen';
import { type Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { CollectionOfferModal } from './OfferModal';
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
    queryKey: [
      'collection',
      collectionId,
      text,
      properties,
      MarketplaceKind.sequence_marketplace_v1,
    ],
    initialPageParam: { page: 1, pageSize: 30 },
    getNextPageParam: (lastPage) => {
      if (!lastPage.page?.more) return undefined;
      return lastPage.page;
    },
    queryFn: ({ pageParam }: { pageParam?: Page }) => {
      return marketplace.listCollectiblesWithLowestListing({
        contractAddress: collectionId,
        page: pageParam,
        filter: {
          searchText: text,
          includeEmpty: !filters$.showAvailableOnly.get(),
          properties,
          marketplaces: [MarketplaceKind.sequence_marketplace_v1],
        },
      });
    },
  });

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((p) => p.collectibles) ?? [];

  return (
    <>
      <CollectiblesGrid
        endReached={collectiblesResponse.fetchNextPage}
        itemType={OrderItemType.BUY}
        data={collectibles}
      />
      <CollectionOfferModal />
    </>
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
