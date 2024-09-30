'use client';

import { type Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';
import { getChainId } from '~/lib/utils/getChain';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { CollectionOfferModal } from '../_components/ListingOfferModal';
import { MarketplaceKind } from '@0xsequence/marketplace-sdk';
import { useListCollectables } from '@0xsequence/marketplace-sdk/react';
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
  const includeEmpty = !filters$.showAvailableOnly.get();

  const collectiblesResponse = useListCollectables({
    chainId,
    contractAddress: collectionId,
    filter: {
      searchText: text,
      includeEmpty,
      properties,
      marketplaces: [MarketplaceKind.sequence_marketplace_v1],
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
