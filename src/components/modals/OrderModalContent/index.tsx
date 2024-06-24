'use client';

import React from 'react';

import type { OrderbookOrder } from '~/api/temp/marketplace-api.gen';
import { Spinner } from '~/components/Spinner';
import {
  useCollectibleMetadata,
  useCollectionMetadata,
  useDefaultCurrencies,
} from '~/hooks/data';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import { useCollectionType } from '~/hooks/utils/useCollectionType';

import { OrderForm } from './OrderForm';

export type OrderbookModalType = 'listing' | 'offer';

interface OrderModalContentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  type: OrderbookModalType;
  chainId: number;
  collectionAddress: string;
  tokenId: string;

  bestOrder?: OrderbookOrder;
}

export const OrderModalContent = ({
  chainId,
  collectionAddress,
  tokenId,
  bestOrder,
  type,
  open,
  setOpen,
}: OrderModalContentProps) => {
  const { isERC1155, isLoading: isCollectionTypeLoading } = useCollectionType({
    chainId: chainId,
    collectionAddress,
  });

  const { data: defaultCurrencies, isLoading: isLoadingCurrencies } =
    useDefaultCurrencies({
      chainId: chainId,
      collectionAddress: collectionAddress,
    });
  const currencies = defaultCurrencies?.data || [];

  const { data: collectibleMetadata, isLoading: isLoadingCollectibleMetadata } =
    useCollectibleMetadata({
      chainID: String(chainId),
      contractAddress: collectionAddress,
      tokenIDs: [tokenId],
    });
  const tokenMetadata = collectibleMetadata?.data[0];

  const { data: collectionData, isLoading: isLoadingCollectionMetadata } =
    useCollectionMetadata({
      chainID: String(chainId),
      contractAddress: collectionAddress,
    });

  const { data: royaltyPercentage, isLoading: isRoyaltyLoading } =
    useCollectionRoyalty({
      chainId,
      contractAddress: collectionAddress,
      tokenId,
    });

  const collectionMetadata = collectionData?.data?.contractInfo;

  const isLoading =
    isLoadingCollectibleMetadata ||
    isLoadingCollectionMetadata ||
    isLoadingCurrencies ||
    isCollectionTypeLoading ||
    !collectionMetadata ||
    !tokenMetadata ||
    isERC1155 === undefined ||
    isRoyaltyLoading;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <OrderForm
      type={type}
      chainId={chainId}
      collectionMetadata={collectionMetadata}
      tokenMetadata={tokenMetadata}
      currencyOptions={currencies}
      isERC1155={isERC1155}
      bestOrder={bestOrder}
      setOpen={setOpen}
      royaltyPercentage={royaltyPercentage}
    />
  );
};
