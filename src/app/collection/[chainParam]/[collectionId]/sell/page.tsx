'use client';

import { getChainId } from '~/config/networks';
import { collectableQueries } from '~/lib/queries';
import { MarketplaceKind } from '~/lib/queries/marketplace/marketplace.gen';
import { type Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { CollectionOfferModal } from '../_components/ListingOfferModal';
import { observer } from '@legendapp/state/react';
import { useInfiniteQuery } from '@tanstack/react-query';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = observer(({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam)!;
  const { collectionId } = params;

  const text = filters$.searchText.get();
  const properties = filters$.filterOptions.get();

  const collectiblesResponse = useInfiniteQuery(
    collectableQueries.listHighestOffer({
      chainId,
      contractAddress: collectionId,
      filter: {
        searchText: text,
        includeEmpty: !filters$.showAvailableOnly.get(),
        properties,
        marketplaces: [MarketplaceKind.sequence_marketplace_v1],
      },
    }),
  );

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((p) => p.collectibles) ?? [];

  return (
    <>
      <CollectiblesGrid
        endReached={collectiblesResponse.fetchNextPage}
        itemType={OrderItemType.SELL}
        data={collectibles}
      />
      <CollectionOfferModal />
    </>
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
