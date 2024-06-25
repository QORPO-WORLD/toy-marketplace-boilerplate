'use client';

import { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import type { DefaultCurrency } from '~/api';
import { OrderItemType } from '~/api';
import { formatDisplay, getNetworkConfigAndClients } from '~/api';
import type { OrderbookOrder } from '~/api/types/orderbook';
import { OrderStatus } from '~/api/types/orderbook';
import { PoolAvatar } from '~/components/Avatars';
import { Spinner } from '~/components/Spinner';
import { CurrencyLabel } from '~/components/TextLabels';
import {
  useDefaultCurrencies,
  useCollectibleMetadata,
  orderbookKeys,
  useCollectionBalances,
  useBlocknumbers,
} from '~/hooks/data';
import { useOrderbookUserActivity } from '~/hooks/orderbook/useOrderbookUserActivity';
import { Routes } from '~/lib/routes';
import { _addToCart_, collectibleFilterState } from '~/lib/stores';
import { CartType } from '~/lib/stores/cart/types';
import { truncateAtMiddle } from '~/lib/utils/helpers';
import { transactionNotification } from '~/modals/Notifications/transactionNotification';
import {
  SEQUENCE_MARKET_V1_ADDRESS,
  Orderbook,
} from '~/sdk/orderbook/clients/Orderbook';
import { compareAddress } from '~/utils/address';
import { mapSortOptions } from '~/utils/orderbook';
import { defaultSelectionQuantity } from '~/utils/quantity';

import { Avatar, Box, Button, Flex, Grid, Text, toast } from '$ui';
import { useQueryClient } from '@tanstack/react-query';
import _uniq from 'lodash.uniq';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { format as timeAgo } from 'timeago.js';
import { useSnapshot } from 'valtio';
import type { Hex, GetBlockReturnType } from 'viem';
import { formatUnits } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';

const NotConnectedWarning = dynamic(
  () =>
    import('~/modules/Misc/NotConnectedWarning').then(
      (mod) => mod.NotConnectedWarning,
    ),
  {
    ssr: false,
  },
);

interface collectionContentProps {
  chainId: number;
  collectionId: string;
}

export const OrderbookActivity = ({
  chainId,
  collectionId,
}: collectionContentProps) => {
  const { address, isConnected } = useAccount();

  const { sortBy } = useSnapshot(collectibleFilterState);

  const {
    data: defaultCurrencies,
    isLoading: isLoadingCurrencies,
    isError: isErrorCurrencies,
  } = useDefaultCurrencies({
    chainId: chainId,
    collectionAddress: collectionId,
  });

  const currenciesData = defaultCurrencies?.data || [];

  const currencies =
    defaultCurrencies?.data?.map((c) => c.contractAddress) || [];

  const { data: userBalances, isLoading: isLoadingBalances } =
    useCollectionBalances({
      chainId,
      userAddress: address!,
      contractAddresses: [collectionId],
    });

  const userOwnedTokenIds = userBalances
    ? userBalances.flat().map((b) => b.tokenID)
    : [];

  const {
    data: dataOrders,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useOrderbookUserActivity(chainId, {
    collectionAddress: collectionId,
    currencyAddresses: currencies,
    userAddress: address as string,
    tokenIDs: userOwnedTokenIds,
    page: {
      sort: [mapSortOptions(sortBy)],
    },
  });

  const isLoading = isLoadingCurrencies || isLoadingOrder || !address;
  const isError = isErrorOrder || isErrorCurrencies;

  const orders =
    dataOrders?.pages?.reduce((accumulator: OrderbookOrder[], currentValue) => {
      return [...accumulator, ...(currentValue.data?.orders || [])];
    }, []) || [];

  const blockNumbers = _uniq(orders.map((o) => o.createdAt));

  const { data: blockInfos = [], isLoading: isLoadingBlocknumbers } =
    useBlocknumbers({
      chainId,
      blockNumbers,
    });

  if (!isConnected) {
    return <NotConnectedWarning isConnected={isConnected} />;
  }

  if (isError) return <Text>An error occurred while fetching orders</Text>;

  if (isLoading || isLoadingBlocknumbers) {
    return (
      <Grid.Child name="collection-loading-spinner">
        <Spinner label="Loading Collectibles" className="mt-12" />
      </Grid.Child>
    );
  }

  if (orders.length === 0) {
    return (
      <Grid.Child name="collection-collectibles" className="m-3 mt-3">
        <Flex className="mx-10 my-10 flex-col items-center justify-center gap-10">
          <Text>No listings found</Text>
        </Flex>
      </Grid.Child>
    );
  }

  return (
    <Content
      chainId={chainId}
      collectionAddress={collectionId}
      endReached={fetchNextPage}
      orders={orders}
      blockInfos={blockInfos}
      currencies={currenciesData}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export interface ContentProps {
  chainId: number;
  collectionAddress: string;
  endReached: () => void;
  orders: OrderbookOrder[];
  currencies: DefaultCurrency[];
  isFetchingNextPage: boolean;
  blockInfos: GetBlockReturnType[];
}

export const Content = ({
  chainId,
  collectionAddress,
  endReached,
  orders,
  currencies,
  isFetchingNextPage,
  blockInfos,
}: ContentProps) => {
  type CancelInProgressById = Record<string, boolean>;

  const orderbook = new Orderbook({
    chainId: chainId,
    contractAddress: SEQUENCE_MARKET_V1_ADDRESS,
  });

  const [actionInProgressById, setActionInProgressById] =
    useState<CancelInProgressById>({});
  const network = getNetworkConfigAndClients(chainId);

  const { address = '' } = useAccount();

  const queryClient = useQueryClient();

  const { data: walletClient } = useWalletClient();
  const {
    data: collectibleMetadataResp,
    isLoading: isCollectibleMetadataLoading,
  } = useCollectibleMetadata({
    chainID: String(chainId),
    contractAddress: collectionAddress,
    tokenIDs: orders.reduce<string[]>((accumulator, currentVal) => {
      if (!accumulator.includes(currentVal.tokenId)) {
        return accumulator.concat(currentVal.tokenId);
      }
      return accumulator;
    }, []),
  });

  const { data: userBalances, isLoading: isLoadingBalances } =
    useCollectionBalances({
      chainId,
      userAddress: address as Hex,
      contractAddresses: [collectionAddress],
    });

  const handleLoadMore = () => {
    if (isFetchingNextPage) {
      return;
    }

    endReached();
  };

  const virtuosoKey = `activity-${chainId}-${collectionAddress}`;
  const titles = [
    'TYPE',
    'COLLECTIBLE',
    'UNIT PRICE',
    'QUANTITY',
    'FROM',
    'CREATED',
    'EXPIRES',
    'STATUS',
    '',
  ];

  const cancelOnClick = async (orderId: string) => {
    try {
      setActionInProgressById({
        ...actionInProgressById,
        [orderId]: true,
      });

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
    } catch (err) {
      console.error('cancelOnClick', err);
      toast.error('Failed to cancel the order');

      setActionInProgressById({
        ...actionInProgressById,
        [orderId]: false,
      });
    }
  };

  const sellOnClick = async (order: OrderbookOrder) => {
    const collectibleMetadata = collectibleMetadataResp?.data.find(
      (metadata) => metadata.tokenId === order.tokenId,
    );

    if (!collectibleMetadata) {
      return;
    }

    const tokenUserBalance = userBalances
      ?.flat()
      .find((b) => b.tokenID === order.tokenId);

    _addToCart_({
      type: CartType.ORDERBOOK,
      item: {
        chainId,
        itemType: OrderItemType.SELL_ORDERBOOK,
        collectibleMetadata: {
          collectionAddress: collectionAddress,
          tokenId: collectibleMetadata.tokenId,
          name: collectibleMetadata.name,
          imageUrl: collectibleMetadata.image || '',
          decimals: collectibleMetadata.decimals,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.SELL_ORDERBOOK,
          tokenDecimals: collectibleMetadata.decimals,
          tokenUserBalance: tokenUserBalance
            ? BigInt(tokenUserBalance.balance)
            : 0n,
          tokenAvailableAmount: BigInt(Number(order.quantityRemaining)),
        }),
        orderbookOrderId: order.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  const getListRow = (index: number) => {
    const order = orders[index];
    const status = order.orderStatus;
    const blockInfo = blockInfos.find(
      (blockInfo) => blockInfo.number === BigInt(order.createdAt),
    );

    const blockTimestamp = blockInfo ? Number(blockInfo.timestamp) : undefined;
    const isExpired = new Date().getTime() > Number(order.expiry) * 1000;
    const isOpen = status === OrderStatus.OPEN && !isExpired;

    const collectibleMetadata = collectibleMetadataResp?.data.find(
      (metadata) => metadata.tokenId === order.tokenId,
    );

    const currency: DefaultCurrency | undefined = currencies.find((c) =>
      compareAddress(c.contractAddress, order.currencyAddress),
    );

    const quantity = formatDisplay(
      Number(
        formatUnits(
          BigInt(order.quantityRemaining),
          collectibleMetadata?.decimals || 0,
        ),
      ),
    );

    const unitPrice = formatDisplay(
      Number(
        formatUnits(BigInt(order.pricePerToken), currency?.decimals || 0),
      ) *
        10 ** (collectibleMetadata?.decimals || 0),
    );

    const isActionLoading = !!actionInProgressById[order.orderId];

    const getActionButton = (order: OrderbookOrder) => {
      /*
        Three scenarios to cover:
        1. Listings that the user has created (the user can cancel)
        2. Offers that the user has made (the user can cancel)
        3. Offers that someone else has made for tokens that the user has (the user can accept)
      */
      const isCreatedByUser = compareAddress(order.createdBy, address);
      const isListing = order.isListing === true;
      const isOffer = !isListing;

      if (isCreatedByUser && isOpen) {
        return (
          <Button
            onClick={() => cancelOnClick(order.orderId)}
            variant="destructive"
            label="Cancel"
            loading={isActionLoading}
            disabled={isActionLoading}
          />
        );
      }
      if (isOffer && isOpen) {
        return (
          <Button
            onClick={() => sellOnClick(order)}
            label="Sell"
            loading={isActionLoading}
            disabled={isActionLoading}
          />
        );
      }
    };

    return (
      <Grid.Root
        key={index}
        className="h-24 gap-x-4 border-b border-b-border px-5 py-6 hover:bg-foreground/10"
        templateColumns="75px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
        templateRows="auto"
      >
        <Grid.Child>
          <Text>{order.isListing ? 'LISTING' : 'OFFER'}</Text>
        </Grid.Child>
        <Grid.Child>
          <PoolAvatar
            src={collectibleMetadata?.image || ''}
            name={collectibleMetadata?.name || ''}
            tokenId={order.tokenId || ''}
            link={Routes.collectible({
              chainParam: chainId,
              collectionId: collectionAddress,
              tokenId: order.tokenId,
              tab: 'details',
            })}
          />
        </Grid.Child>
        <Grid.Child>
          <Flex className="items-center justify-start gap-2">
            <Avatar.Base>
              <Avatar.Image src={currency?.logoUri || ''} />

              <Avatar.Fallback />
            </Avatar.Base>

            <CurrencyLabel
              size="sm"
              amount={unitPrice}
              label={currency?.symbol || ''}
            />
          </Flex>
        </Grid.Child>
        <Grid.Child>
          <Text>{quantity}</Text>
        </Grid.Child>
        <Grid.Child>
          <Text
            // @ts-ignore-next-line
            as={NextLink}
            // @ts-ignore-next-line
            size="sm"
            href={`${network.networkConfig.explorerUrl}/address/${order.createdBy}`}
            rel="noreferrer noopener"
            target="_blank"
            css={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {compareAddress(order.createdBy, address as string)
              ? 'You'
              : truncateAtMiddle(order.createdBy, 12)}
          </Text>
        </Grid.Child>

        <Grid.Child>
          <Text className={'text-sm'}>
            {blockTimestamp
              ? new Date(blockTimestamp * 1000).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'Unknown'}
          </Text>
        </Grid.Child>
        <Grid.Child>
          <Text className="text-sm">
            {order.orderStatus !== OrderStatus.OPEN
              ? '-'
              : timeAgo(Number(order.expiry) * 1000)}
          </Text>
        </Grid.Child>
        <Grid.Child>
          <Text
            className={
              order.orderStatus === OrderStatus.OPEN && !isExpired
                ? 'text-foreground/100'
                : 'text-foreground/20'
            }
          >
            {isExpired && order.orderStatus === OrderStatus.OPEN
              ? 'EXPIRED'
              : order.orderStatus}
          </Text>
        </Grid.Child>
        <Grid.Child>{getActionButton(order)}</Grid.Child>
      </Grid.Root>
    );
  };

  return (
    <>
      <Flex
        className="sticky w-full"
        style={{
          top: 'calc(var(--headerHeight) + var(--collectionControlsHeight) + 3px)',
        }}
      >
        <Flex className="w-full min-w-[900px] flex-col">
          <Grid.Root
            templateColumns="75px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
            templateRows="auto"
            className="z-50 h-11 items-center gap-x-4 border-b border-b-border px-5"
          >
            {titles.map((t, i) => (
              <Text
                key={i}
                className="text-left text-sm uppercase text-foreground/50"
              >
                {t}
              </Text>
            ))}
          </Grid.Root>
          <VirtuosoGrid
            key={virtuosoKey}
            totalCount={orders.length}
            overscan={{
              main: window.innerHeight / 5,
              reverse: window.innerHeight / 5,
            }}
            useWindowScroll
            components={{
              Scroller: (props) => (
                <>
                  <Box
                    {...props}
                    // style={{ position: 'unset', height: 'unset' }}
                    // css={{ '& > div': { position: 'unset !important' } }}
                  />
                  {isFetchingNextPage && <Spinner />}
                </>
              ),
            }}
            itemContent={(i) => <>{getListRow(i)}</>}
            endReached={handleLoadMore}
          />
        </Flex>
      </Flex>
    </>
  );
};
