'use client';

import React from 'react';

import { useCollectableData } from '~/app/collectible/[chainParam]/[collectionId]/[tokenId]/_hooks/useCollectableData';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';

import { OrderForm } from './OrderForm';
import type { OrderbookOrder } from '@0xsequence/indexer';

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
  //TODO: Add default currencies
  // const currencies = [
  //   '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  //   '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  //   '0xad9f61563b104281b14322fec8b42eb67711bf68',
  // ];

  const currencies = [
    {
      id: 1,
      chainId: 137,
      contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      imageUrl:
        'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
      exchangeRate: 0,
      defaultChainCurrency: true,
      creditCardSupported: true,
      createdAt: '2021-10-14T14:00:00.000Z',
      updatedAt: '2021-10-14T14:00:00.000Z',
    },
    {
      id: 2,
      chainId: 137,
      contractAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      decimals: 18,
      imageUrl:
        'https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.sv',
      exchangeRate: 0,
      defaultChainCurrency: true,
      creditCardSupported: false,
      createdAt: '2021-10-14T14:00:00.000Z',
      updatedAt: '2021-10-14T14:00:00.000Z',
    },
    {
      id: 3,
      chainId: 137,
      contractAddress: '0xad9f61563b104281b14322fec8b42eb67711bf68',
      name: 'Synergy Land Token',
      symbol: 'SNG',
      decimals: 18,
      imageUrl: 'https://polygonscan.com/token/images/synergylandsng_32.png',
      exchangeRate: 0,
      defaultChainCurrency: false,
      creditCardSupported: false,
      createdAt: '2021-10-14T14:00:00.000Z',
      updatedAt: '2021-10-14T14:00:00.000Z',
    },
  ];

  const { collectibleMetadata, collectionMetadata } = useCollectableData();

  const tokenMetadata = collectibleMetadata.data;

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { data: royaltyPercentage } = useCollectionRoyalty({
    chainId,
    contractAddress: collectionAddress,
    tokenId,
  });

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <OrderForm
      type={type}
      chainId={chainId}
      collectionMetadata={collectionMetadata.data!}
      tokenMetadata={tokenMetadata!}
      currencyOptions={currencies}
      isERC1155={isERC1155}
      bestOrder={bestOrder}
      setOpen={setOpen}
      royaltyPercentage={royaltyPercentage}
    />
  );
};
