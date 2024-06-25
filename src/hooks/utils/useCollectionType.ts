import { useCollectionMetadata } from '../data';

interface UseCollectionTypeProps {
  chainId: number;
  collectionAddress: string;
}

export type CollectionType = 'ERC1155' | 'ERC721' | undefined;

export const useCollectionType = ({
  chainId,
  collectionAddress,
}: UseCollectionTypeProps) => {
  const { data: collectionMetadatResp, isLoading } = useCollectionMetadata({
    chainID: String(chainId),
    contractAddress: collectionAddress,
  });

  const collectionMetadata = collectionMetadatResp?.data;

  const isERC721 = collectionMetadata
    ? collectionMetadata.contractInfo.type === 'ERC721'
    : undefined;
  const isERC1155 = collectionMetadata
    ? collectionMetadata.contractInfo.type === 'ERC1155'
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
