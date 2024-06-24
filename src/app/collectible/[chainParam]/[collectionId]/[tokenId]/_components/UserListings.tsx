'use client';

import { getNetworkConfigAndClients } from '~/api';
import { OrderStatus } from '~/api/types/orderbook';
import { ListingsTable } from '~/app/collectible/[chainParam]/[collectionId]/[tokenId]/[tab]/_components/ListingsTable';
import { useDefaultCurrencies, orderbookKeys } from '~/hooks/data';
import { useOrderbookAPI } from '~/hooks/orderbook';
import { transactionNotification } from '~/modals/Notifications/transactionNotification';
import {
  ORDERBOOK_CONTRACT_ADDRESS,
  Orderbook,
} from '~/sdk/orderbook/clients/Orderbook';
import { _addToCart_ } from '~/stores';
import { CartType } from '~/stores/cart/types';
import { defaultSelectionQuantity } from '~/utils/quantity';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'system';
import { useWalletClient } from 'wagmi';

interface ListingsProps {
  chainId: number;
  collectionAddress: string;
  tokenId: string;
}

export const UserListings = ({
  chainId,
  collectionAddress,
  tokenId,
}: ListingsProps) => {
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();

  const orderbook = new Orderbook({
    chainId: chainId,
    contractAddress: ORDERBOOK_CONTRACT_ADDRESS,
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
        isListing: true,
      },
      orderStatuses: [OrderStatus.OPEN],
      beforeExpiryTimestamp: 0,
    },
    true,
  );

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

  const buyOnClick = async ({
    orderId,
    image,
    name,
    decimals,
    quantityRemaining,
    userBalance,
  }: BuyOnClickProps) => {
    _addToCart_({
      type: CartType.ORDERBOOK,
      item: {
        chainId,
        itemType: OrderItemType.BUY_ORDERBOOK,
        collectibleMetadata: {
          collectionAddress,
          tokenId,
          name: name || '',
          imageUrl: image || '',
          decimals: decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.BUY_ORDERBOOK,
          tokenDecimals: decimals || 0,
          tokenUserBalance: BigInt(userBalance?.toString() || 0),
          tokenAvailableAmount: BigInt(Number(quantityRemaining)),
        }),
        orderbookOrderId: orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  return (
    <ListingsTable
      kind="listings"
      showMarketplaceLink={false}
      buyOnClick={buyOnClick}
      cancelOnClick={cancelOnClick}
      collectionAddress={collectionAddress}
      tokenId={tokenId}
      chainId={chainId}
      marketType="orderbook"
      {...listings}
      defaultCurrencies={defaultCurrencies?.data || []}
    />
  );
};
