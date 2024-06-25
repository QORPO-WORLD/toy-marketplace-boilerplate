'use client';

import React, { useState } from 'react';

import { getNetworkConfigAndClients } from '~/api';
import type {
  GetOrderbookOrdersResponse,
  OrderbookOrder,
} from '~/api/types/orderbook';
import { PoolAvatar } from '~/components/Avatars';
import { Spinner } from '~/components/Spinner';
import { useCollectibleBalance, useCollectibleMetadata } from '~/hooks/data';
import { formatDisplay, truncateAtMiddle } from '~/utils/helpers';

import { AddIcon, Avatar, Button, Flex, ScrollArea, Table, Text } from '$ui';
import type { TokenMetadata } from '@0xsequence/metadata';
import type { InfiniteData } from '@tanstack/react-query';
import type { BigNumber } from 'ethers';
import NextLink from 'next/link';
import { format as timeAgo } from 'timeago.js';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Currency } from '~/lib/queries/marketplace.gen';

export interface BuyOnClickProps {
  orderId: string;
  image?: string;
  name?: string;
  decimals?: number;
  quantityRemaining?: number;
  userBalance?: BigNumber;
}

type MarketType = {
  marketType: 'orderbook';
  data: InfiniteData<GetOrderbookOrdersResponse> | undefined;
  defaultCurrencies: Currency[];
};

type ListingsTableProps = {
  kind: 'listings' | 'offers';
  chainId: number;
  cancelOnClick: (orderId: string) => Promise<void>;
  buyOnClick: (props: BuyOnClickProps) => Promise<void>;
  tokenId: string;
  collectionAddress: string;
  showMarketplaceLink?: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
} & MarketType;

export const ListingsTable = (props: ListingsTableProps) => {
  const {
    kind,
    data,
    chainId,
    cancelOnClick,
    buyOnClick,
    tokenId,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    collectionAddress,
    showMarketplaceLink = false,
    marketType,
  } = props;

  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const { address, isConnected } = useAccount();

  const {
    data: collectiblesMetadata,
    isLoading: isLoadingCollectibleMetadata,
  } = useCollectibleMetadata({
    chainID: String(chainId),
    contractAddress: collectionAddress,
    tokenIDs: [tokenId],
  });

  const tokenMetadata = collectiblesMetadata?.data[0];

  const { data: userBalance } = useCollectibleBalance({
    chainId: chainId,
    userAddress: address as string,
    contractAddress: collectionAddress,
    tokenId: tokenId,
  });

  const handleLoadMore = async () => {
    if (isFetchingNextPage) {
      return;
    }
    await fetchNextPage();
  };

  const handleBuy = async ({
    listingId,
    quantityRemaining,
  }: {
    listingId: string;
    quantityRemaining?: number;
  }) => {
    setLoadingIds([...loadingIds, listingId]);
    await buyOnClick({
      image: tokenMetadata?.image,
      name: tokenMetadata?.name,
      decimals: tokenMetadata?.decimals,
      orderId: listingId,
      quantityRemaining,
      userBalance,
    });
    setLoadingIds(loadingIds.filter((id) => id !== listingId));
  };

  const handleCancel = async (orderId: string) => {
    setLoadingIds([...loadingIds, orderId]);
    await cancelOnClick(orderId);
    setLoadingIds(loadingIds.filter((id) => id !== orderId));
  };

  if (isLoading || isLoadingCollectibleMetadata) {
    return <Spinner label="Loading Collectibles" className="mt-12" />;
  }

  if (!data?.pages[0].data.orders?.length) {
    return <Text className="mt-12">{`No ${kind} found`}</Text>;
  }

  const network = getNetworkConfigAndClients(chainId);

  return (
    <ScrollArea.Base className="max-w-[90vw]" orientation="horizontal">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Item</Table.Head>
            <Table.Head>Unit Price</Table.Head>
            <Table.Head>Quantity</Table.Head>
            <Table.Head>Expiration</Table.Head>
            <Table.Head>Creator</Table.Head>
            {showMarketplaceLink && <Table.Head>Marketplace</Table.Head>}
            <Table.Head>{''}</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* <ScrollArea.Base className="max-h-[200px]"> */}
          {data?.pages.map((page) =>
            page.data.orders?.map((rawListing) => {
              const listing = getUnifiedListingData({
                listing: rawListing,
                marketType,
                tokenMetadata,
                defaultCurrencies:
                  marketType == 'orderbook'
                    ? props.defaultCurrencies
                    : undefined,
                chainId,
              } as GetUnifiedListingDataProps);

              const isBtnActionInProgress = loadingIds.includes(listing.id);

              const isUserOwnedListing = compareAddress(
                listing.createdBy,
                address as string,
              );

              return (
                <Table.Row key={listing.id}>
                  <Table.Cell>
                    <PoolAvatar
                      src={tokenMetadata?.image || ''}
                      name={tokenMetadata?.name || ''}
                      tokenId={tokenId}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Flex className="flex-1 items-center gap-2">
                      <Avatar.Base size="xs">
                        <Avatar.Image
                          src={listing.currency.img}
                          alt={listing.currency.symbol}
                        />
                      </Avatar.Base>
                      <Text className="ellipsis" title="unit price">
                        {`${listing.unitPriceFormatted} ${listing.currency.symbol}`}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex className="flex-1 items-center gap-2">
                      <Text>{listing.quantityRemainingFormatted}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{timeAgo(listing.expiration * 1000)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      // @ts-ignore
                      as={NextLink}
                      size="sm"
                      href={`${network.networkConfig.explorerUrl}/address/${listing.createdBy}`}
                      rel="noreferrer noopener"
                      target="_blank"
                      css={{
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {isUserOwnedListing
                        ? 'You'
                        : truncateAtMiddle(listing.createdBy, 12)}
                    </Text>
                  </Table.Cell>
                  {showMarketplaceLink && (
                    <Table.Cell>
                      <Flex className="gap-2">
                        <Avatar.Base>
                          <Avatar.Image
                            alt={String(listing.source?.name)}
                            src={String(listing.source?.icon)}
                          />
                          <Avatar.Fallback />
                        </Avatar.Base>
                        <Text>{String(listing.source?.name)}</Text>
                      </Flex>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    {isConnected &&
                      (isUserOwnedListing ? (
                        <Button
                          className="w-full"
                          onClick={() => handleCancel(listing.id)}
                          variant="destructive"
                          label="Cancel"
                          loading={isBtnActionInProgress}
                          disabled={isBtnActionInProgress}
                        />
                      ) : kind === 'listings' ||
                        (kind == 'offers' &&
                          userBalance?.gte(listing.quantityRemainingRaw)) ? (
                        <Button
                          className="w-full"
                          onClick={() =>
                            handleBuy({
                              listingId: listing.id,
                              quantityRemaining: listing.quantityRemainingRaw,
                            })
                          }
                          label={kind == 'listings' ? 'Buy' : 'Sell'}
                          loading={isBtnActionInProgress}
                          disabled={isBtnActionInProgress}
                        />
                      ) : (
                        <></>
                      ))}
                  </Table.Cell>
                </Table.Row>
              );
            }),
          )}
          {/* </ScrollArea.Base> */}
        </Table.Body>
      </Table.Root>
      <Flex className="relative my-1 w-full justify-center">
        <Button
          variant="ghost"
          onClick={handleLoadMore}
          loading={isFetchingNextPage || isLoading}
          disabled={isFetchingNextPage || !hasNextPage}
        >
          {hasNextPage ? <AddIcon /> : undefined}
          {hasNextPage ? 'Load More' : ''}
        </Button>
      </Flex>
    </ScrollArea.Base>
  );
};

type GetUnifiedListingDataProps = {
  marketType: 'orderbook';
  listing: OrderbookOrder;
  tokenMetadata: TokenMetadata | undefined;
  defaultCurrencies: DefaultCurrency[];
};

export interface Listing {
  id: string;
  unitPriceRaw: number | undefined;
  unitPriceFormatted: string;
  currency: {
    symbol: string;
    img: string;
  };
  quantityRemainingRaw: number;
  quantityRemainingFormatted: string;
  expiration: number;
  createdBy: string;
  source?: ExternalTokenListing['source'];
}

const getUnifiedListingData = (props: GetUnifiedListingDataProps): Listing => {
  const { listing } = props;

  const currency = props.defaultCurrencies.find((c) =>
    compareAddress(c.contractAddress, listing.currencyAddress),
  );

  return {
    id: listing.orderId,
    unitPriceRaw: Number(listing.pricePerToken),
    unitPriceFormatted: unitsFormatted({
      pricePerToken: listing.pricePerToken,
      currencyDecimals: currency?.decimals,
      tokenDecimals: props.tokenMetadata?.decimals,
    }),
    expiration: Number(listing.expiry),
    createdBy: listing.createdBy,
    quantityRemainingFormatted: quantityFormatted(
      listing.quantityRemaining,
      props.tokenMetadata?.decimals,
    ),
    quantityRemainingRaw: Number(listing.quantityRemaining),
    currency: {
      symbol: currency?.symbol || '',
      img: currency?.logoUri || '',
    },
  };
};

const quantityFormatted = (
  quantity: number | string | undefined,
  tokenDecimals: number | undefined,
) =>
  formatDisplay(Number(formatUnits(BigInt(quantity || 1), tokenDecimals || 0)));

interface NormalizeUnitsProps {
  pricePerToken: number | string | undefined;
  currencyDecimals: number | undefined;
  tokenDecimals: number | undefined;
}
const unitsFormatted = (props: NormalizeUnitsProps) =>
  formatDisplay(
    Number(
      formatUnits(
        BigInt(props.pricePerToken || 0),
        props.currencyDecimals || 0,
      ),
    ) *
      10 ** (props.tokenDecimals || 0),
  );
