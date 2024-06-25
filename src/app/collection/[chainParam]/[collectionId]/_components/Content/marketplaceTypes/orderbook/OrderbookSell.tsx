'use client';

import { useCallback, useState } from 'react';

import type { DefaultCurrency } from '~/api';
import { SortOrder } from '~/api/temp/marketplace-api.gen';
import type { OrderbookOrder } from '~/api/types/orderbook';
import { CollectibleSearch } from '~/components/CollectibleSearch';
import { Spinner } from '~/components/Spinner';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import {
  useDefaultCurrencies,
  useCollectionUserBalances,
  useCollectionFilterOptions,
} from '~/hooks/data';
import { useOrderbookTopOrders } from '~/hooks/orderbook';
import { collectibleFilterState } from '~/lib/stores';
import { SortType } from '~/lib/stores/collectible/types';
import { getThemeManagerElement } from '~/lib/utils/theme';
import { OrderModalContent } from '~/modals/OrderModalContent';
import { mapCollectionFilter } from '~/utils/mapCollectionFilter';

import { Dialog, Flex, Grid, Text } from '$ui';
import { OrderbookSellCollectiblesGrid } from '../../Collectibles/Grid/orderbook-sell';
import type { TokenBalance } from '@0xsequence/indexer';
import type { PropertyFilter } from '@0xsequence/metadata';
import _intersection from 'lodash.intersection';
import _uniq from 'lodash.uniq';
import dynamic from 'next/dynamic';
import { useSnapshot } from 'valtio';
import { useAccount } from 'wagmi';

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

export const OrderbookSell = ({
  chainId,
  collectionId,
}: collectionContentProps) => {
  const { address, isConnected } = useAccount();

  const {
    data: defaultCurrencies,
    isLoading: isLoadingCurrencies,
    isError: isErrorCurrencies,
  } = useDefaultCurrencies({
    chainId: chainId,
    collectionAddress: collectionId,
  });

  const { searchText, filterOptions } = useSnapshot(collectibleFilterState);

  const currenciesData = defaultCurrencies?.data || [];

  const { data: filterData } = useCollectionFilterOptions({
    chainId,
    collectionAddress: collectionId,
    marketType: 'orderbook',
  });

  const properties = filterData
    ? mapCollectionFilter(filterOptions, filterData)
    : [];

  const {
    data: collectionUserBalance,
    isLoading: isCollectionUserBalanceLoading,
    isError: isCollectionUserBalanceIsError,
  } = useCollectionUserBalances({
    chainId: chainId,
    collectionAddress: collectionId,
    userAddress: address || '',
    filters: {
      searchText,
      properties: properties as PropertyFilter[],
    },
  });

  const ownedTokens = collectionUserBalance?.data || [];

  const filtersApplied = !!searchText || filterOptions.length > 0;

  const isError = isErrorCurrencies || isCollectionUserBalanceIsError;
  const isLoading = isLoadingCurrencies || isCollectionUserBalanceLoading;

  if (!isConnected) {
    return <NotConnectedWarning isConnected={isConnected} />;
  }

  if (isLoading) {
    return (
      <Grid.Child name="collection-loading-spinner">
        <Spinner label="Loading Collectibles" className="mt-12" />
      </Grid.Child>
    );
  }

  if (ownedTokens.length === 0 && filtersApplied) {
    return (
      <Grid.Child name="collection-collectibles" className="m-3 mt-3">
        <Flex className="mx-10 my-10 flex-col items-center justify-center gap-10">
          <Text>No collectibles found</Text>
        </Flex>
      </Grid.Child>
    );
  }

  if (ownedTokens.length === 0) {
    return (
      <Grid.Child name="collection-collectibles" className="m-3 mt-3">
        <Flex className="mx-10 my-10 flex-col items-center justify-center gap-10">
          <Text>You don't own any collectibles from this collection</Text>
        </Flex>
      </Grid.Child>
    );
  }

  return (
    <CollectiblesContent
      chainId={chainId}
      collectionId={collectionId}
      currencies={currenciesData}
      ownedTokenBalances={ownedTokens}
    />
  );
};
interface CollectiblesContentProps {
  chainId: number;
  collectionId: string;
  currencies: DefaultCurrency[];
  ownedTokenBalances: TokenBalance[];
}
export const CollectiblesContent = ({
  chainId,
  collectionId: collectionAddress,
  currencies,
  ownedTokenBalances,
}: CollectiblesContentProps) => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalTokenId, setOrderModalTokenId] = useState('');
  const [orderItem, setOrderItem] = useState<OrderbookOrder | undefined>(
    undefined,
  );
  const { includeUserOrders, sortBy } = useSnapshot(collectibleFilterState);
  const { address } = useAccount();

  const ownedTokenIds = ownedTokenBalances.map((balance) => balance.tokenID);

  const currencyAddresses = currencies.map((c) => c.contractAddress);

  const { data: dataOrders, isLoading: isDataOrdersLoading } =
    useOrderbookTopOrders(chainId, {
      excludeUser: includeUserOrders ? undefined : address,
      collectionAddress,
      currencyAddresses,
      orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
      tokenIDs: ownedTokenIds,
      isListing: false,
      priceSort: sortBy === SortType.PRICE_ASC ? SortOrder.ASC : SortOrder.DESC,
    });

  const orders = dataOrders?.orders || [];
  const orderTokenIds = orders.map((o) => o.tokenId);

  const filteredOrderTokenIds = _intersection([
    ...orderTokenIds,
    ...ownedTokenIds,
  ]);
  const allTokenIds = _uniq([...filteredOrderTokenIds, ...ownedTokenIds]);

  const {
    data: collectionUserBalance,
    isLoading: isCollectionsUserBalanceLoading,
  } = useCollectionUserBalances({
    chainId: chainId,
    collectionAddress: collectionAddress,
    userAddress: address || '',
  });

  const onClickOrderModal = useCallback(
    (tokenId: string, orderItem?: OrderbookOrder) => {
      setOrderModalTokenId(tokenId);
      setOrderModalOpen(true);
      setOrderItem(orderItem);
    },
    [],
  );

  return (
    <>
      <Grid.Child
        name="collection-content-label"
        className="mb-6 flex flex-row-reverse items-center justify-between gap-2"
      >
        <Flex className="gap-3">
          <CollectibleSearch />
        </Flex>
      </Grid.Child>
      <Grid.Child
        name="collection-collectibles"
        className="overflow-hidden p-1"
      >
        {!isDataOrdersLoading &&
        (address ? !isCollectionsUserBalanceLoading : true) ? (
          <OrderbookSellCollectiblesGrid
            displayedTokenIds={allTokenIds}
            chainId={chainId}
            collectionAddress={collectionAddress}
            currencies={currencies}
            orders={orders}
            userAddress={address}
            userCollectionBalanceData={collectionUserBalance}
            onClickOrderModal={onClickOrderModal}
          />
        ) : null}
      </Grid.Child>
      <Dialog.Root
        open={orderModalOpen}
        onOpenChange={(isOpen) => setOrderModalOpen(isOpen)}
      >
        <Dialog.BaseContent
          container={getThemeManagerElement()}
          className="max-w-[700px] p-5"
        >
          <Dialog.Title>Create a Listing</Dialog.Title>
          <OrderModalContent
            chainId={chainId}
            collectionAddress={collectionAddress}
            bestOrder={orderItem}
            tokenId={orderModalTokenId}
            open={orderModalOpen}
            setOpen={setOrderModalOpen}
            type="listing"
          />
        </Dialog.BaseContent>
      </Dialog.Root>
    </>
  );
};
