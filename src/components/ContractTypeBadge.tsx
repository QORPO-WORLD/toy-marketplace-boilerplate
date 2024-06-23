'use client';

import { metadataQueries } from '~/queries';

import { useQuery } from '@tanstack/react-query';
import { Badge } from 'system';

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
