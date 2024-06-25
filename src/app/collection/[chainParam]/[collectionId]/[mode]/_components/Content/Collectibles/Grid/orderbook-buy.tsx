'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import type { ListRange } from 'react-virtuoso';

import type { GetCollectiblesUserBalancesResponse } from '~/api';
import { OrderItemType } from '~/api';
import { queryClient } from '~/clients/queryClient';
import { collectibleMetadataFetchProps } from '~/hooks/data/query-data';
import { Routes } from '~/lib/routes';
import { collectibleFilterState } from '~/lib/stores';
import type { AddToCartData } from '~/lib/stores/cart/types';
import { CartType } from '~/lib/stores/cart/types';
import { CollectiblesGrid } from '~/modules/CollectableGrid';
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
import { useSnapshot } from 'valtio';
import { formatUnits, isAddress } from 'viem';

// local state to track TokenIDS fetching states
let tokenIdFetchingStates: Record<string, 'loading' | 'done'> = {};

// maintain closure independent of component re-rendering
const rangeChangedDebouncer = debounce((fn: Function) => {
  fn();
}, 300);

export const OrderbookBuyCollectiblesGrid = memo(
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

      if (displayedTokenIds.length) {
        onRangeChanged({
          startIndex: 0,
          endIndex:
            displayedTokenIds.length > 10 ? 10 : displayedTokenIds.length,
        });
      }
    }, [displayedTokenIds, collectionAddress, chainId]);

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

            // if it isn't in tokenId to fetch
            if (!tokenIDsToFetch.includes(tokenId)) {
              collectiblesDataArray.push(null);
              continue;
            }

            const collectibleMetadata = getCollectibleMetadataQueryOrCache({
              chainId: Number(chainID),
              tokenId,
              collectionAddress: contractAddress,
              collectibleMetadata: collectibleMetadataResp?.data || [],
            });

            const userData =
              isConnected && address
                ? userCollectionBalanceData?.data?.find(
                    (userBalance) => userBalance.tokenID === tokenId,
                  )
                : undefined;

            const pricePerToken = orderItem?.pricePerToken || '0';
            const currencyAddress = orderItem?.currencyAddress || '';
            const quantity = Number(orderItem?.quantityRemaining || '0');

            const currencyData = currencies.find((c) =>
              compareAddress(currencyAddress, c.contractAddress),
            );
            const currencyDecimal = currencyData?.decimals || 0;

            const oneUnit = 10 ** (collectibleMetadata?.decimals || 0);
            const unitPriceRaw = BigInt(oneUnit) * BigInt(pricePerToken);
            const unitPrice = Number(
              formatUnits(unitPriceRaw, currencyDecimal),
            );

            // ---------------
            // BADGES
            const quantityNum = Number(orderItem?.quantityRemaining || 0);
            const formattedQuantity = formatDecimals(
              quantityNum,
              collectibleMetadata?.decimals,
            );

            const ownedNum = Number(userData?.balance || 0);
            const owned = userData
              ? formatDecimals(ownedNum, collectibleMetadata?.decimals)
              : '';

            const badges: Badge[] = [];

            if (quantityNum > 0) {
              badges.push({
                loading: false,
                label: 'STOCK',
                value: formatDisplay(formattedQuantity),
                variant: 'success',
                title: `${formattedQuantity} STOCK`,
              });
            }

            if (ownedNum > 0) {
              badges.push({
                loading: false,
                label: 'OWNED',
                value: formatDisplay(owned),
                variant: 'muted',
                title: `${owned} OWNED`,
              });
            }

            const priceData = {
              tokenId: tokenId,
              availableAmount: String(quantity),
              unitAmount: String(quantity),
              unitPrice: String(unitPrice),
            };

            const addToCartData = collectibleMetadata
              ? ({
                  type: CartType.ORDERBOOK,
                  item: {
                    chainId,
                    itemType: OrderItemType.BUY_ORDERBOOK,
                    collectibleMetadata: {
                      collectionAddress: contractAddress,
                      tokenId: collectibleMetadata.tokenId,
                      name: collectibleMetadata.name,
                      imageUrl: collectibleMetadata.image || '',
                      decimals: collectibleMetadata.decimals,
                      chainId,
                    },
                    quantity: defaultSelectionQuantity({
                      type: OrderItemType.BUY_ORDERBOOK,
                      tokenDecimals: collectibleMetadata.decimals,
                      tokenUserBalance: userData?.balance
                        ? BigInt(userData.balance)
                        : 0n,
                      tokenAvailableAmount: BigInt(
                        Number(orderItem?.quantityRemaining || '0'),
                      ),
                    }),
                    orderbookOrderId: orderItem?.orderId || '',
                  },
                  options: {
                    toggle: true,
                  },
                } satisfies AddToCartData)
              : undefined;

            const price = orderItem
              ? {
                  symbolUrl: currencyData?.logoUri || '',
                  loading: false,
                  value: formatDisplay(unitPrice),
                }
              : {
                  symbolUrl: '',
                  loading: false,
                  value: '',
                  title: '',
                };

            const data = {
              userData,
              priceData,
              addToCartButtonProps: addToCartData
                ? {
                    addToCartData,
                    isAvailable: quantity > 0,
                    itemType: OrderItemType.BUY_ORDERBOOK,
                    onClickOrderModal,
                  }
                : undefined,
              loading: false,
              tokenId: String(tokenId),
              link: Routes.collectible({
                chainParam: chainId,
                collectionId: collectionAddress,
                tokenId,
                tab: 'details',
              }),
              name: collectibleMetadata?.name,
              image: String(collectibleMetadata?.image),
              price,
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

    const virtuosoKey = `${chainId}-${collectionAddress}-${orders.length}-${includeUserOrders}`;

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
);
