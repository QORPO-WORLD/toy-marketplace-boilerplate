import { collectionQueries } from '~/lib/queries';

import { useQuery } from '@tanstack/react-query';

interface UseCollectionTypeProps {
  chainId: number;
  collectionAddress: string;
}

export type CollectionType = 'ERC1155' | 'ERC721' | undefined;

export const useCollectionType = ({
  chainId,
  collectionAddress,
}: UseCollectionTypeProps) => {
  const { data: collectionMetadata, isLoading } = useQuery(
    collectionQueries.detail({
      chainID: chainId.toString(),
      collectionId: collectionAddress,
    }),
  );

  const isERC721 = collectionMetadata
    ? collectionMetadata.type === 'ERC721'
    : undefined;
  const isERC1155 = collectionMetadata
    ? collectionMetadata.type === 'ERC1155'
    : undefined;

  const type: CollectionType = isERC721
    ? 'ERC721'
    : isERC1155
      ? 'ERC1155'
      : undefined;

  return {
    isLoading,
    type,
    isERC721,
    isERC1155,
  };
};
