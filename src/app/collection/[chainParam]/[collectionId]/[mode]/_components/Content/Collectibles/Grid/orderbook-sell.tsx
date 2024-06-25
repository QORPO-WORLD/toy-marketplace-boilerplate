'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import type { ListRange } from 'react-virtuoso';

import type { GetCollectiblesUserBalancesResponse } from '~/api';
import { OrderItemType } from '~/api';
import type { OrderbookOrder } from '~/api/temp/marketplace-api.gen';
import { queryClient } from '~/clients/queryClient';
import { collectibleMetadataFetchProps } from '~/hooks/data/query-data';
import { Routes } from '~/lib/routes';
import { collectibleFilterState } from '~/lib/stores';
import { CartType } from '~/lib/stores/cart/types';
import { CollectiblesGrid } from '~/modules/CollectableGrid';
import type { AddToCartButtonProps } from '~/modules/CollectableGrid/AddToCartButton';
import type {
  Badge,
  CollectibleCardData,
} from '~/modules/CollectableGrid/CollectableCard';
import { compareAddress } from '~/utils/address';
import { formatDecimals, formatDisplay } from '~/utils/helpers';
import { defaultSelectionQuantity } from '~/utils/quantity';

import { getCollectibleMetadataQueryOrCache } from '../../../../../../_components/utils';
import type { CollectiblesListProps } from './OrderbookTypes';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';
import { useSnapshot } from 'valtio';
import { formatUnits, isAddress } from 'viem';

// local state to track TokenIDS fetching states
let tokenIdFetchingStates: Record<string, 'loading' | 'done'> = {};

// maintain closure independent of component re-rendering
const rangeChangedDebouncer = debounce((fn: Function) => {
  fn();
}, 300);

export const OrderbookSellCollectiblesGrid = memo(
  (props: CollectiblesListProps) => {
    const {
      chainId,
      collectionAddress,
      displayedTokenIds,
      userAddress,
      userCollectionBalanceData,
      currencies,
      orders,
      onClickOrderModal,
    } = props;

    const totalCount = displayedTokenIds.length;

    const { includeUserOrders } = useSnapshot(collectibleFilterState);

    const [collectibles, setCollectibles] = useState<CollectibleCardData[]>([
      ...Array(totalCount || 1).fill(null),
    ]);

    useEffect(() => {
      tokenIdFetchingStates = {};
      setCollectibles([...Array(totalCount || 1).fill(null)]);

      if (totalCount) {
        onRangeChanged({
          startIndex: 0,
          endIndex: totalCount > 10 ? 10 : totalCount,
        });
      }
    }, [
      displayedTokenIds,
      totalCount,
      orders,
      collectionAddress,
      chainId,
      includeUserOrders,
    ]);

    const onRangeChanged = async (range: ListRange) => {
      rangeChangedDebouncer(() => {
        const { startIndex, endIndex } = range;

        if (!isAddress(collectionAddress) || !chainId) {
          console.error('wrong data to load collectibles grid');
          return;
        }

        // await
        loadMoreItems(
          startIndex,
          endIndex,
          displayedTokenIds,
          collectionAddress,
          chainId,
          orders,
          userAddress,
          userCollectionBalanceData,
        );
      });
    };

    const loadMoreItems = useCallback(
      (
        startIndex: number,
        stopIndex: number,
        allTokenIDs: string[],
        collectionAddress: string,
        chainId: number,
        orders: OrderbookOrder[],
        userAddress?: string,
        userCollectionBalanceData?: GetCollectiblesUserBalancesResponse,
      ): Promise<void> => {
        return new Promise(async (resolve) => {
          // CONSTS
          const tokenIDs = allTokenIDs.slice(startIndex, stopIndex + 1);

          // check if these tokenIDs are fetched before
          const tokenIDsToFetch = tokenIDs.filter(
            (tokenId) => !tokenIdFetchingStates[tokenId],
          );

          // update startIndex & stopIndex too
          // if all tokenIDs are fetched before, then resolve
          if (!tokenIDsToFetch.length) {
            resolve();
            return;
          }

          // set fetching states
          tokenIDsToFetch.forEach((tokenId) => {
            tokenIdFetchingStates[tokenId] = 'loading';
          });

          const chainID = String(chainId);
          const contractAddress = String(collectionAddress);

          const isConnected = !!userAddress;
          const address = userAddress;

          // FETCHING BASIC DATA
          const [collectibleMetadataResp] = await Promise.all([
            queryClient?.fetchQuery(
              collectibleMetadataFetchProps({
                chainID,
                contractAddress,
                tokenIDs: tokenIDsToFetch,
              }),
            ),
          ]);

          const collectiblesDataArray: CollectibleCardData[] = [];

          // SETTING INDIVIDUAL COLLECTIBLE DATA
          for (let index = startIndex; index <= stopIndex; index++) {
            // SETTING DATA
            const tokenId = allTokenIDs[index];
            const orderItem = orders.find((o) => o.tokenId === tokenId);

            const collectibleMetadata = getCollectibleMetadataQueryOrCache({
              chainId,
              tokenId,
              collectionAddress,
              collectibleMetadata: collectibleMetadataResp?.data || [],
            });

            const userData =
              isConnected && address
                ? userCollectionBalanceData?.data?.find(
                    (userBalance) => userBalance.tokenID === tokenId,
                  )
                : undefined;

            const ownedNum = Number(userData?.balance || 0);
            const owned = userData
              ? formatDecimals(ownedNum, collectibleMetadata?.decimals)
              : '';

            const quantityNum = Number(orderItem?.quantityRemaining || 0);
            const formattedQuantity = formatDecimals(
              quantityNum,
              collectibleMetadata?.decimals,
            );

            const badges: Badge[] = [];

            if (ownedNum > 0) {
              badges.push({
                loading: !collectibleMetadata,
                label: 'OWNED',
                value: formatDisplay(owned),
                variant: 'muted',
                title: `${owned} OWNED`,
              });
            }

            if (Number(orderItem?.quantityRemaining) > 0) {
              badges.push({
                loading: !collectibleMetadata,
                label: 'OFFER',
                value: formatDisplay(formattedQuantity),
                variant: 'success',
                title: `${formattedQuantity} OFFER`,
              });
            }

            if (!orderItem) {
              badges.push({
                label: 'no offers',
              });
            }

            const currency = currencies.find((c) =>
              compareAddress(
                orderItem?.currencyAddress || '',
                c.contractAddress,
              ),
            );

            const currencyDecimal = currency?.decimals || 0;
            const oneUnit = 10 ** (collectibleMetadata?.decimals || 0);
            const unitPriceRaw =
              BigInt(oneUnit) * BigInt(orderItem?.pricePerToken || 0);
            const unitPrice = Number(
              formatUnits(unitPriceRaw, currencyDecimal),
            );

            const addToCartButtonProps = collectibleMetadata
              ? ({
                  isAvailable: !!orderItem,
                  itemType: OrderItemType.SELL_ORDERBOOK,
                  onClickOrderModal,
                  orderbookOrderItem: orderItem,
                  addToCartData: {
                    type: CartType.ORDERBOOK,
                    item: {
                      chainId,
                      itemType: OrderItemType.SELL_ORDERBOOK,
                      collectibleMetadata: {
                        collectionAddress: contractAddress,
                        tokenId: collectibleMetadata.tokenId,
                        name: collectibleMetadata.name,
                        imageUrl: collectibleMetadata.image || '',
                        decimals: collectibleMetadata.decimals,
                        chainId,
                      },
                      quantity: defaultSelectionQuantity({
                        type: OrderItemType.SELL_ORDERBOOK,
                        tokenDecimals: collectibleMetadata?.decimals,
                        tokenUserBalance: userData?.balance
                          ? BigInt(userData.balance)
                          : 0n,
                        tokenAvailableAmount: BigInt(
                          Number(orderItem?.quantityRemaining || 0),
                        ),
                      }),
                      orderbookOrderId: orderItem?.orderId || '',
                    },
                    options: {
                      toggle: true,
                    },
                  },
                } satisfies AddToCartButtonProps)
              : undefined;

            const data = {
              userData,
              priceData: {
                tokenId,
                availableAmount: orderItem?.quantityRemaining || null,
                unitAmount: orderItem?.quantityRemaining || null,
                unitPrice: String(unitPrice),
              },
              addToCartButtonProps,
              loading: !collectibleMetadata || false,
              tokenId: String(collectibleMetadata?.tokenId || ''),
              link: Routes.collectible({
                chainParam: chainId,
                collectionId: collectionAddress,
                tokenId,
                tab: 'details',
              }),
              name: collectibleMetadata?.name || '-',
              image: String(collectibleMetadata?.image),
              price:
                orderItem && currency
                  ? {
                      loading: false, // !OrderCart || !currency
                      symbolUrl: currency.logoUri || '',
                      value: unitPrice ? formatDisplay(unitPrice) : 'n/a',
                      title: unitPrice ? unitPrice : 'n/a',
                    }
                  : undefined,
              badges,
            } satisfies CollectibleCardData;

            // UPDATE the array
            collectiblesDataArray.push(data);
          }

          // set fetching states
          tokenIDsToFetch.forEach((tokenId) => {
            tokenIdFetchingStates[tokenId] = 'done';
          });

          await setCollectibles((prev) => {
            const newCollectiblesData = [...prev];

            for (let index = startIndex; index <= stopIndex; index++) {
              const tokenId = allTokenIDs[index];
              const isTokenIDWasFetched = tokenIDsToFetch.includes(tokenId);

              const tokenData = collectiblesDataArray[index - startIndex];

              if (isTokenIDWasFetched && tokenData) {
                newCollectiblesData[index] = tokenData;
              }
            }

            return newCollectiblesData;
          });

          resolve();
        });
      },
      [],
    );

    const virtuosoKey = `${chainId}-${collectionAddress}-${includeUserOrders}-${JSON.stringify(
      displayedTokenIds,
    )}`;

    return (
      <>
        <CollectiblesGrid
          virtuosoKey={virtuosoKey}
          totalCount={totalCount}
          onRangeChanged={onRangeChanged}
          data={collectibles}
        />
      </>
    );
  },
  (prevProps, newProps) => {
    if (
      !isEqual(prevProps.displayedTokenIds, newProps.displayedTokenIds) ||
      prevProps.chainId !== newProps.chainId ||
      prevProps.collectionAddress !== newProps.collectionAddress ||
      !isEqual(prevProps.currencies, newProps.currencies) ||
      !isEqual(prevProps.orders, newProps.orders) ||
      prevProps.userAddress !== newProps.userAddress ||
      !isEqual(
        prevProps.userCollectionBalanceData,
        newProps.userCollectionBalanceData,
      )
    ) {
      return false;
    }

    return true;
  },
);
