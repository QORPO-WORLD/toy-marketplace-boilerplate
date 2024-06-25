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
  useCollectionTokenIDs,
  useCollectionFilterOptions,
} from '~/hooks/data';
import { useOrderbookTopOrders } from '~/hooks/orderbook';
import { useCollectionType } from '~/hooks/utils/useCollectionType';
import { collectibleFilterState } from '~/lib/stores';
import { SortType } from '~/lib/stores/collectible/types';
import { getThemeManagerElement } from '~/lib/utils/theme';
import { OrderModalContent } from '~/modals/OrderModalContent';
import { mapCollectionFilter } from '~/utils/mapCollectionFilter';

import { Dialog, Flex, Grid, Text } from '$ui';
import { OrderbookBuyCollectiblesGrid } from '../../Collectibles/Grid/orderbook-buy';
import type { PropertyFilter } from '@0xsequence/metadata';
import _intersection from 'lodash.intersection';
import _uniq from 'lodash.uniq';
import { useSnapshot } from 'valtio';
import { useAccount } from 'wagmi';

interface collectionContentProps {
  chainId: number;
  collectionId: string;
}

export const OrderbookBuy = ({
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

  const currenciesData = defaultCurrencies?.data || [];

  const currencies =
    defaultCurrencies?.data?.map((c) => c.contractAddress) || [];

  const {
    searchText,
    filterOptions,
    includeUserOrders,
    sortBy,
    showAvailableOnly,
  } = useSnapshot(collectibleFilterState);
  const {
    data: collectionUserBalance,
    isLoading: isLoadingCollectionUserBalance,
    isError: isErrorCollectionUserBalance,
  } = useCollectionUserBalances({
    chainId: chainId,
    collectionAddress: collectionId,
    userAddress: address || '',
  });

  const { isERC1155, isLoading: isCollectionTypeLoading } = useCollectionType({
    chainId: chainId,
    collectionAddress: collectionId,
  });

  const { data: filterData } = useCollectionFilterOptions({
    chainId,
    collectionAddress: collectionId,
    marketType: 'orderbook',
  });

  const properties = filterData
    ? mapCollectionFilter(filterOptions, filterData)
    : [];

  const {
    data: tokenIDsResp,
    isError: tokenIDsIsError,
    error: tokenIDsError,
    isLoading: tokenIDsLoading,
  } = useCollectionTokenIDs(
    {
      chainId: chainId,
      collectionAddress: collectionId,
      userAddress: undefined,
      filter: {
        text: searchText,
        properties: properties as PropertyFilter[],
      },
    },
    { disabled: false },
  );

  const unfilteredTokenIds = tokenIDsResp?.data || [];
  const balances = collectionUserBalance?.data || [];
  const ownedTokendIds = balances.map((b) => b.tokenID);

  const tokenIds = isERC1155
    ? unfilteredTokenIds
    : unfilteredTokenIds.filter((tokenId) => !ownedTokendIds.includes(tokenId));

  const {
    data: dataOrders,
    isLoading: isLoadingOrder,
    isError: isErrorOrder,
  } = useOrderbookTopOrders(
    chainId,
    {
      excludeUser: includeUserOrders ? undefined : address,
      collectionAddress: collectionId,
      currencyAddresses: currencies,
      orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
      tokenIDs: tokenIds,
      isListing: true,
      priceSort: sortBy === SortType.PRICE_ASC ? SortOrder.ASC : SortOrder.DESC,
    },
    tokenIDsLoading ||
      isLoadingCurrencies ||
      (isLoadingCollectionUserBalance && isConnected),
  );

  const orders = dataOrders?.orders || [];

  const ordersTokenIds = dataOrders?.orders.map((o) => o.tokenId) || [];

  const filteredOrderTokenIds = _intersection([...ordersTokenIds, ...tokenIds]);
  const allTokenIds = _uniq([...filteredOrderTokenIds, ...tokenIds]);

  const filtersApplied = !!searchText || filterOptions.length > 0;

  const isLoading =
    (isConnected && isLoadingCollectionUserBalance) ||
    isLoadingOrder ||
    isLoadingCurrencies ||
    isCollectionTypeLoading;

  const isError =
    isErrorOrder ||
    isErrorCurrencies ||
    isErrorCollectionUserBalance ||
    tokenIDsIsError;

  const displayedTokenIds = showAvailableOnly
    ? orders.map((o) => o.tokenId)
    : allTokenIds;

  if (isError) return <Text>An error occurred while fetching orders</Text>;

  if (isLoading) {
    return (
      <Grid.Child name="collection-loading-spinner">
        <Spinner label="Loading Collectibles" className="mt-12" />
      </Grid.Child>
    );
  }

  if (displayedTokenIds.length === 0 && filtersApplied) {
    return (
      <Grid.Child name="collection-collectibles" className="m-3 mt-3">
        <Flex className="mx-10 my-10 flex-col items-center justify-center gap-10">
          <Text>No search results</Text>
        </Flex>
      </Grid.Child>
    );
  }

  if (displayedTokenIds.length === 0) {
    return (
      <Grid.Child name="collection-collectibles" className="m-3 mt-3">
        <Flex className="mx-10 my-10 flex-col items-center justify-center gap-10">
          <Text>No collectibles from this collection</Text>
        </Flex>
      </Grid.Child>
    );
  }

  return (
    <Content
      chainId={chainId}
      collectionAddress={collectionId}
      orders={orders}
      currencies={currenciesData}
      displayedTokenIds={displayedTokenIds}
    />
  );
};

export interface ContentProps {
  chainId: number;
  collectionAddress: string;
  orders: OrderbookOrder[];
  currencies: DefaultCurrency[];
  displayedTokenIds: string[];
}

export const Content = ({
  chainId,
  collectionAddress,
  orders,
  currencies,
  displayedTokenIds,
}: ContentProps) => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalTokenId, setOrderModalTokenId] = useState('');
  const [orderItem, setOrderItem] = useState<OrderbookOrder | undefined>(
    undefined,
  );
  const { address } = useAccount();

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
        {(address ? !isCollectionsUserBalanceLoading : true) ? (
          <OrderbookBuyCollectiblesGrid
            chainId={chainId}
            collectionAddress={collectionAddress}
            currencies={currencies}
            displayedTokenIds={displayedTokenIds}
            orders={orders}
            userCollectionBalanceData={collectionUserBalance}
            userAddress={address}
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
          <Dialog.Title>Make an offer</Dialog.Title>
          <OrderModalContent
            chainId={chainId}
            collectionAddress={collectionAddress}
            tokenId={orderModalTokenId}
            bestOrder={orderItem}
            open={orderModalOpen}
            setOpen={setOrderModalOpen}
            type="offer"
          />
        </Dialog.BaseContent>
      </Dialog.Root>
    </>
  );
};
