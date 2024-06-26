'use client';

import { getChainId } from '~/config/networks';
import { getMetadataClient } from '~/lib/queries/clients';
import { type Routes } from '~/lib/routes';

import { filters$ } from '../_components/FilterStore';
import { CollectiblesGrid } from '../_components/Grid';
import { type Page } from '@0xsequence/metadata';
import { useInfiniteQuery } from '@tanstack/react-query';

type CollectionBuyPageParams = {
  params: typeof Routes.collection.params;
};

const CollectionBuyPage = ({ params }: CollectionBuyPageParams) => {
  const chainId = getChainId(params.chainParam)!;
  const metadata = getMetadataClient(chainId);
  const { collectionId } = params;

  const collectiblesResponse = useInfiniteQuery({
    queryKey: [
      'collection',
      collectionId,
      filters$.searchText,
      filters$.filterOptions,
    ],
    initialPageParam: undefined,
    getNextPageParam: ({ page: pageResponse }) =>
      pageResponse?.more ? pageResponse : undefined,
    queryFn: ({ pageParam }: { pageParam?: Page }) =>
      metadata.searchTokenMetadata({
        chainID: chainId.toString(),
        contractAddress: collectionId,
        page: pageParam,
        filter: {
          text: filters$.searchText.get(),
          properties: filters$.filterOptions.get(),
        },
      }),
  });

  const collectibles = collectiblesResponse.data?.pages[0]?.tokenMetadata ?? [];
  return (
    <CollectiblesGrid
      //TODO: Replace with actual data
      virtuosoKey={'potato'}
      data={collectibles}
    />
  );
};

export default CollectionBuyPage;

export const runtime = 'edge';
