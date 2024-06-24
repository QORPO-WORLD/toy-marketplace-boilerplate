import { getChainId } from '~/config/networks';
import { metadataQueries } from '~/lib/queries';
import { Routes } from '~/lib/routes';

import { useQuery } from '@tanstack/react-query';

export const useCollectableData = () => {
  const { chainParam, collectionId, tokenId } = Routes.collectible.useParams();
  const chainId = getChainId(chainParam)!;
  const collectionMetadata = useQuery(
    metadataQueries.collection({
      chainID: chainId.toString(),
      collectionId: collectionId,
    }),
  );

  const collectibleMetadata = useQuery(
    metadataQueries.collectible({
      chainID: chainId.toString(),
      contractAddress: collectionId,
      tokenIDs: [tokenId],
    }),
  );
  return {
    chainId,
    tokenId,
    collectionId,
    collectionMetadata,
    collectibleMetadata,
  };
};
