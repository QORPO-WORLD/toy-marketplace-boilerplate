'use client';

import React, { useEffect } from 'react';

import { PoolAvatar } from '~/components/Avatars';
import { ContractTypeBadge } from '~/components/ContractTypeBadge';
import { NetworkIcon } from '~/components/NetworkLabel';
import { useViewType } from '~/components/ViewTypeToggle/useViewType';
import { useCollectionUserBalances } from '~/hooks/balances/useCollectionUserBalances';
import { useCollectionMetadata } from '~/hooks/data';
import { useCollectionType } from '~/hooks/utils/useCollectionType';
import {
  inventoryState,
  getCollectionId,
  setSearchResultAmountByCollection,
} from '~/lib/stores/Inventory';
import { configState, marketConfig$ } from '~/lib/stores/marketConfig';
import { AddToCartButton } from '~/modules/CollectableGrid/AddToCartButton';
import type { CollectibleCardData } from '~/modules/CollectableGrid/CollectableCard';
import { CollectibleCard } from '~/modules/CollectableGrid/CollectableCard';

import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
  cn,
} from '$ui';
import { getInvetoryCardData } from './helpers';
import type { GetTokenBalancesReturn, TokenBalance } from '@0xsequence/indexer';
import Fuse from 'fuse.js';
import { useSnapshot } from 'valtio';

type InventoryCollectiblesContent = {
  collectionBalances: TokenBalance[];
};

export const InventoryCollectiblesContent = ({
  collectionBalances,
}: InventoryCollectiblesContent) => {
  const { searchResultAmount, searchText } = useSnapshot(inventoryState);

  const allCollectionIds = collectionBalances.map((c) => {
    return getCollectionId(c.contractAddress, c.chainId);
  });

  return (
    <>
      {searchText !== '' && searchResultAmount === 0 && (
        <Text>No results found</Text>
      )}
      <Accordion.Root
        type="multiple"
        className="w-full"
        defaultValue={collectionBalances.map((c) => c.contractAddress)}
      >
        {collectionBalances.map((c, i) => {
          return (
            <CollectionSection
              key={c.contractAddress}
              {...c}
              allCollectionIds={allCollectionIds}
            />
          );
        })}
      </Accordion.Root>
    </>
  );
};

interface CollectionSectionProps extends TokenBalance {
  allCollectionIds: string[];
}

const CollectionSection = ({
  chainId,
  contractAddress,
  accountAddress,
  balance,
  allCollectionIds,
}: CollectionSectionProps) => {
  const {
    data: collectionUserBalanceResp,
    isLoading: isCollectionUserBalanceLoading,
    isError: isCollectionUserBalanceError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectionUserBalances({
    chainId,
    contractAddress,
    userAddress: accountAddress,
    pageSize: 16,
  });

  const {
    data: collectionMetadataResp,
    isLoading: isCollectionMetadataLoading,
    isError: isCollectionMetadataError,
  } = useCollectionMetadata({
    chainID: String(chainId),
    contractAddress,
  });

  const {
    isERC1155,
    isERC721,
    isLoading: isCollectionTypeLoading,
  } = useCollectionType({
    chainId: chainId,
    collectionAddress: contractAddress,
  });

  const { searchText } = useSnapshot(inventoryState);

  const marketConfig = marketConfig$.get();

  const { isGridView } = useViewType();

  const pageData: GetTokenBalancesReturn[] = collectionUserBalanceResp
    ? collectionUserBalanceResp.pages
    : [];

  const unfilteredCollectibles = pageData.reduce(
    (acc, data) => acc.concat(data.balances),
    [] as TokenBalance[],
  );

  const fuzzySearchCollectibles = new Fuse(unfilteredCollectibles, {
    keys: [
      'tokenMetadata.name',
      'tokenID',
      {
        name: 'contractAddress',
        weight: 4,
      },
      {
        name: 'contractInfo.name',
        weight: 2,
      },
    ],
    threshold: 0.3,
  });

  const collectibles =
    searchText === ''
      ? unfilteredCollectibles
      : fuzzySearchCollectibles.search(searchText).map((result) => result.item);

  useEffect(() => {
    setSearchResultAmountByCollection(
      allCollectionIds,
      contractAddress,
      chainId,
      collectibles.length,
    );
  }, [searchText, collectibles]);

  const collectionMetadata = collectionMetadataResp?.data || null;

  if (isCollectionUserBalanceLoading || collectibles.length === 0) {
    return null;
  }

  const handleLoadMore = () => {
    if (isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  return (
    <Accordion.Item
      disabled={isCollectionUserBalanceLoading || isCollectionUserBalanceError}
      value={contractAddress}
      className="mb-8 max-w-[100vw] bg-transparent px-0 focus-within:ring-0 md:px-3"
    >
      <Flex
        className="sticky z-40 bg-background py-2"
        style={{ top: 'calc(var(--headerHeight))' }}
      >
        <ScrollArea.Base orientation="horizontal" className="max-w-full">
          <Accordion.Trigger className={cn('w-full min-w-max self-start')}>
            <Flex className="items-center gap-3">
              <Avatar.Base>
                <Avatar.Image
                  alt={collectionMetadata?.contractInfo?.name}
                  src={collectionMetadata?.contractInfo?.logoURI}
                />
                <Avatar.Fallback />
              </Avatar.Base>

              <Text className="text-sm">
                {collectionMetadata?.contractInfo?.name || contractAddress}
              </Text>
              <NetworkIcon
                chainId={Number(collectionMetadata?.contractInfo?.chainId)}
              />
              <ContractTypeBadge
                chainId={chainId}
                collectionAddress={contractAddress}
              />
            </Flex>

            <Text className="ml-auto text-sm text-foreground/50">
              ITEMS ({searchText === '' ? balance : collectibles.length})
            </Text>
          </Accordion.Trigger>
        </ScrollArea.Base>
      </Flex>

      <Accordion.Content className="mt-0 p-1">
        <ContentWrapper isGridView={isGridView}>
          {collectibles.map((c) => {
            const data = getInvetoryCardData({
              collectible: c,
              isERC721,
              isERC1155,
              marketConfig,
            });
            return isGridView ? (
              <CollectibleCard data={data} key={data.tokenId} />
            ) : (
              <InventoryRow data={data} key={data.tokenId} />
            );
          })}
        </ContentWrapper>
        {hasNextPage && searchText === '' ? (
          <Button
            className="mt-2"
            variant="secondary"
            label="Load More"
            onClick={handleLoadMore}
            loading={isFetchingNextPage}
          />
        ) : null}
      </Accordion.Content>
    </Accordion.Item>
  );
};

const ContentWrapper = ({
  isGridView,
  children,
}: {
  isGridView: boolean;
  children: React.ReactNode;
}) => {
  return isGridView ? (
    <Grid.Root
      className={cn(
        'grid-flow-row gap-0.5 sm:gap-3',
        'auto-rows-[minmax(250px,min-content)] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] grid-rows-[repeat(auto-fill,minmax(250px,min-content))]',
        'sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]',
      )}
    >
      {children}
    </Grid.Root>
  ) : (
    <>{children}</>
  );
};
const InventoryRow = ({
  data,
}: {
  data: Exclude<CollectibleCardData, undefined | null>;
}) => {
  const badge = data.badges![0];
  return (
    <Flex className="justify-between border-b border-b-border py-3">
      <Flex className="gap-3">
        <PoolAvatar
          src={data.image || ''}
          name={data.name || ''}
          chainId={data.addToCartButtonProps?.addToCartData.item.chainId}
          tokenId={data.tokenId}
          link={data.link}
        />
        <Badge variant="muted" title={String(badge.title)}>
          {badge.label}:<span className="ml-1">{badge.value}</span>
        </Badge>
      </Flex>
      {data.addToCartButtonProps?.addToCartData && (
        <AddToCartButton
          isAvailable={true}
          addToCartData={data.addToCartButtonProps?.addToCartData}
          itemType={OrderItemType.TRANSFER}
        />
      )}
    </Flex>
  );
};
