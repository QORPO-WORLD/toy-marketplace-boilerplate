'use client';

import { getChainId } from '~/config/networks';
import { getMetadataClient } from '~/lib/queries/clients';
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
  const metadata = getMetadataClient(chainId);
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
      return metadata.searchTokenMetadata({
        chainID: chainId.toString(),
        contractAddress: collectionId,
        page: pageParam,
        filter: {
          text,
          properties,
        },
      });
    },
  });

  const collectibles =
    collectiblesResponse.data?.pages.flatMap((page) => page.tokenMetadata) ??
    [];

  return (
    <CollectiblesGrid
      endReached={collectiblesResponse.fetchNextPage}
      data={collectibles}
    />
  );
});

export default CollectionBuyPage;

export const runtime = 'edge';
