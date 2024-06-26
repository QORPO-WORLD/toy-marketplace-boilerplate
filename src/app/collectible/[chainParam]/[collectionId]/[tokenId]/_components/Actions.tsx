'use client';

import { use, useState } from 'react';

import { OrderModalContent } from '~/components/modals/OrderModalContent';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { indexerQueries, marketplaceQueries } from '~/lib/queries';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, ScrollArea, Text } from '$ui';
import { useCollectableData } from '../_hooks/useCollectableData';
import { SortOrder } from '@0xsequence/indexer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface CollectibleTradeActionsProps {
  chainId: number;
  tokenId: string;
  collectionAddress: string;
}
export const CollectibleTradeActions = ({
  chainId,
  tokenId,
  collectionAddress,
}: CollectibleTradeActionsProps) => {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  //TODO: Add default currencies
  const currencies = [
    '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    '0xad9f61563b104281b14322fec8b42eb67711bf68',
  ];

  const { data: bestOffers, isLoading: isLoadingBestOffers } = useQuery(
    marketplaceQueries.topOrder({
      chainId,
      collectionAddress,
      currencyAddresses: currencies,
      orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
      tokenIDs: [tokenId],
      isListing: false,
      priceSort: SortOrder.DESC,
    }),
  );

  const bestOffer = bestOffers?.orders[0];

  const { data: bestListings, isLoading: isLoadingBestListings } = useQuery(
    marketplaceQueries.topOrder({
      chainId,
      collectionAddress,
      currencyAddresses: currencies,
      orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
      tokenIDs: [tokenId],
      isListing: true,
      priceSort: SortOrder.DESC,
    }),
  );

  const bestListing = bestListings?.orders[0];

  const { collectionMetadata } = useCollectableData();

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalance, isLoading: isBalanceLoading } = useInfiniteQuery({
    ...indexerQueries.tokenBalance({
      chainId: chainId,
      contractAddress: collectionAddress,
      tokenId,
      includeMetadata: false,
      accountAddress: address as string,
    }),
    enabled: !!isConnected && !!address,
  });

  const hasUserBalance = userBalance?.pages?.[0]?.balances[0]?.balance;

  const item721AlreadyOwned = !!hasUserBalance && !isERC1155;

  const isLoading =
    isLoadingBestOffers ||
    isLoadingBestListings ||
    (isConnected && isBalanceLoading);

  const onClickBuy = () => {
    // if (!bestListing) return;
    // _addToCart_({
    //   type: CartType.ORDERBOOK,
    //   item: {
    //     chainId,
    //     itemType: OrderItemType.BUY_ORDERBOOK,
    //     collectibleMetadata: {
    //       collectionAddress: bestListing.tokenContract,
    //       tokenId: bestListing.tokenId,
    //       name: collectibleMetadata?.name || '',
    //       imageUrl: collectibleMetadata?.image || '',
    //       decimals: collectibleMetadata?.decimals || 0,
    //       chainId,
    //     },
    //     quantity: defaultSelectionQuantity({
    //       type: OrderItemType.BUY_ORDERBOOK,
    //       tokenDecimals: collectibleMetadata?.decimals || 0,
    //       tokenUserBalance: BigInt(userBalance?.toString() || 0),
    //       tokenAvailableAmount: BigInt(Number(bestListing.quantityRemaining)),
    //     }),
    //     orderbookOrderId: bestListing.orderId,
    //   },
    //   options: {
    //     toggle: true,
    //   },
    // });
  };

  const onClickSell = () => {
    // if (!bestOffer) return;
    // _addToCart_({
    //   type: CartType.ORDERBOOK,
    //   item: {
    //     chainId,
    //     itemType: OrderItemType.SELL_ORDERBOOK,
    //     collectibleMetadata: {
    //       collectionAddress: bestOffer.tokenContract,
    //       tokenId: bestOffer.tokenId,
    //       name: collectibleMetadata?.name || '',
    //       imageUrl: collectibleMetadata?.image || '',
    //       decimals: collectibleMetadata?.decimals || 0,
    //       chainId,
    //     },
    //     quantity: defaultSelectionQuantity({
    //       type: OrderItemType.SELL_ORDERBOOK,
    //       tokenDecimals: collectibleMetadata?.decimals || 0,
    //       tokenUserBalance: BigInt(userBalance?.toString() || 0),
    //       tokenAvailableAmount: BigInt(Number(bestOffer.quantityRemaining)),
    //     }),
    //     orderbookOrderId: bestOffer.orderId,
    //   },
    //   options: {
    //     toggle: true,
    //   },
    // });
  };

  const buyDisabled = !bestListing || item721AlreadyOwned;
  const offerDisabled = !isConnected;
  const listingDisabled = !isConnected || !hasUserBalance;
  const sellDisabled = !bestOffer || !hasUserBalance;

  return (
    <Flex className="flex-col gap-4">
      <Flex className="flex-row gap-4">
        <Button
          size="lg"
          className="w-full justify-between"
          loading={isLoading}
          disabled={buyDisabled}
          onClick={onClickBuy}
        >
          <Text className="text-inherit">Buy</Text>
        </Button>
        <Flex className="w-full flex-col gap-3">
          <Dialog.Root
            open={isOfferModalOpen}
            onOpenChange={(isOpen) => setIsOfferModalOpen(isOpen)}
          >
            <Dialog.Trigger asChild>
              <Button
                className="w-full justify-between"
                size="lg"
                loading={false}
                disabled={offerDisabled}
              >
                <Text className="text-inherit">Offer</Text>
              </Button>
            </Dialog.Trigger>

            <Dialog.BaseContent
              container={getThemeManagerElement()}
              className="max-h-screen max-w-[700px] p-5"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Dialog.Title>Create an offer</Dialog.Title>
              <OrderModalContent
                chainId={chainId}
                collectionAddress={collectionAddress}
                tokenId={tokenId}
                bestOrder={bestListing}
                open={isOfferModalOpen}
                setOpen={setIsOfferModalOpen}
                type="offer"
              />
            </Dialog.BaseContent>
          </Dialog.Root>
        </Flex>
      </Flex>
      <Flex className="flex-row gap-4">
        <Button
          className="w-full justify-between"
          size="lg"
          loading={isLoading}
          disabled={sellDisabled}
          onClick={onClickSell}
        >
          <Text className="text-inherit">Sell</Text>
        </Button>

        <Flex className="w-full flex-col gap-3">
          <Dialog.Root
            open={isListingModalOpen}
            onOpenChange={(isOpen) => setIsListingModalOpen(isOpen)}
          >
            <Dialog.Trigger asChild>
              <Button
                className="w-full justify-between"
                size="lg"
                loading={false}
                disabled={listingDisabled}
              >
                <Text className="text-inherit">List</Text>
              </Button>
            </Dialog.Trigger>

            <Dialog.BaseContent
              container={getThemeManagerElement()}
              className="flex max-w-[700px] flex-col overflow-hidden p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <ScrollArea.Base viewportClassName="max-h-screen">
                <Flex className="h-full w-full flex-col gap-4 p-5">
                  <Dialog.Title>Make a listing</Dialog.Title>

                  <OrderModalContent
                    chainId={chainId}
                    collectionAddress={collectionAddress}
                    tokenId={tokenId}
                    bestOrder={bestOffer}
                    open={isListingModalOpen}
                    setOpen={setIsListingModalOpen}
                    type="listing"
                  />
                </Flex>
              </ScrollArea.Base>
            </Dialog.BaseContent>
          </Dialog.Root>
        </Flex>
      </Flex>
    </Flex>
  );
};
