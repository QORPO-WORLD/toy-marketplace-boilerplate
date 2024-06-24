'use client';

import React from 'react';

import { OrderItemType } from '~/api';
import { getNetworkConfigAndClients } from '~/api';
import { OrderStatus } from '~/api/types/orderbook';
import { ListingsTable } from '~/app/collectible/[chainParam]/[collectionId]/[tokenId]/[tab]/_components/ListingsTable';
import {
  useDefaultCurrencies,
  useCollectibleBalance,
  orderbookKeys,
} from '~/hooks/data';
import { useOrderbookAPI } from '~/hooks/orderbook';
import { transactionNotification } from '~/modals/Notifications/transactionNotification';
import {
  ORDERBOOK_CONTRACT_ADDRESS,
  Orderbook,
} from '~/sdk/orderbook/clients/Orderbook';
import { _addToCart_ } from '~/stores';
import { CartType } from '~/stores/cart/types';
import { defaultSelectionQuantity } from '~/utils/quantity';

import { toast } from '$ui';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount, useWalletClient } from 'wagmi';

interface UserOffersProps {
  chainId: number;
  collectionAddress: string;
  tokenId: string;
}

const UserOffers = ({
  chainId,
  collectionAddress,
  tokenId,
}: UserOffersProps) => {
  const { address } = useAccount();

  const queryClient = useQueryClient();

  const { data: walletClient } = useWalletClient();

  const { data: userBalance } = useCollectibleBalance({
    chainId,
    userAddress: address as string,
    contractAddress: collectionAddress,
    tokenId,
  });

  const { data: defaultCurrencies } = useDefaultCurrencies({
    chainId: chainId,
    collectionAddress: collectionAddress,
  });

  const currencies =
    defaultCurrencies?.data.map((c) => c.contractAddress) || [];

  const listings = useOrderbookAPI(
    chainId,
    {
      collectionAddress,
      currencyAddresses: currencies,
      filters: {
        tokenIds: [tokenId],
        isListing: false,
      },
      orderStatuses: [OrderStatus.OPEN],
      beforeExpiryTimestamp: 0,
    },
    true,
  );

  const orderbook = new Orderbook({
    chainId: chainId,
    contractAddress: ORDERBOOK_CONTRACT_ADDRESS,
  });

  const cancelOnClick = async (orderId: string) => {
    try {
      if (walletClient) {
        const txnHash = await orderbook.cancelRequest(
          BigInt(orderId),
          walletClient,
        );
        await transactionNotification({
          network: getNetworkConfigAndClients(chainId).networkConfig,
          txHash: txnHash,
        });
        queryClient.invalidateQueries({ queryKey: [...orderbookKeys.all()] });
      }
    } catch (e) {
      console.error('cancelOnClick', e);
      toast.error('Failed to cancel the order');
    }
  };

  const sellOnClick = async (order: BuyOnClickProps) => {
    _addToCart_({
      type: CartType.ORDERBOOK,
      item: {
        chainId,
        itemType: OrderItemType.SELL_ORDERBOOK,
        collectibleMetadata: {
          collectionAddress,
          tokenId,
          name: order.name || '',
          imageUrl: order.image || '',
          decimals: order.decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.SELL_ORDERBOOK,
          tokenDecimals: order.decimals || 0,
          tokenUserBalance: BigInt(userBalance?.toString() || 0),
          tokenAvailableAmount: BigInt(Number(order.quantityRemaining)),
        }),
        orderbookOrderId: order.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  return (
    <ListingsTable
      kind="offers"
      showMarketplaceLink={false}
      buyOnClick={sellOnClick}
      cancelOnClick={cancelOnClick}
      collectionAddress={collectionAddress}
      tokenId={tokenId}
      chainId={chainId}
      marketType="orderbook"
      defaultCurrencies={defaultCurrencies?.data || []}
      {...listings}
    />
  );
};

export default UserOffers;
