'use client';

import React from 'react';

import { useCollectableData } from '~/app/collectible/[chainParam]/[collectionId]/[tokenId]/_hooks/useCollectableData';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import { useCollectionCurrencies } from '~/hooks/useCollectionCurrencies';

import { OrderForm } from './OrderForm';
import type { OrderbookOrder } from '@0xsequence/indexer';
import { useQuery } from '@tanstack/react-query';

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
  setOpen,
}: OrderModalContentProps) => {
  const { collectibleMetadata, collectionMetadata } = useCollectableData();

  const tokenMetadata = collectibleMetadata.data;

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { data: royaltyPercentage } = useCollectionRoyalty({
    chainId,
    contractAddress: collectionAddress,
    tokenId,
  });

  const { currencies } = useCollectionCurrencies({
    chainId,
    collectionId: collectionAddress,
  });

  return (
    currencies &&
    collectionMetadata.data &&
    tokenMetadata && (
      <OrderForm
        type={type}
        chainId={chainId}
        collectionMetadata={collectionMetadata.data}
        tokenMetadata={tokenMetadata}
        currencyOptions={currencies}
        isERC1155={isERC1155}
        bestOrder={bestOrder}
        setOpen={setOpen}
        royaltyPercentage={royaltyPercentage}
      />
    )
  );
};
