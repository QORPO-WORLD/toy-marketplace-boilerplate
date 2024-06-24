'use client';

import { metadataQueries } from '~/queries';

import { Badge } from '$ui';
import { useQuery } from '@tanstack/react-query';

interface Props {
  chainId: number;
  collectionAddress: string;
}

export const ContractTypeBadge = ({ chainId, collectionAddress }: Props) => {
  const {
    data: collectionMetadataResp,
    isLoading: isCollectionMetadataLoading,
  } = useQuery(
    metadataQueries.collection({
      chainID: chainId.toString(),
      collectionId: collectionAddress,
    }),
  );
  return (
    <Badge variant="muted" loading={isCollectionMetadataLoading}>
      {collectionMetadataResp?.type || 'unknown'}
    </Badge>
  );
};
