'use client';

import { useState } from 'react';

import { ORDERBOOK_CONTRACT_ADDRESS } from '~/config/consts';
import {
  useCollectibleBalance,
  useDefaultCurrencies,
  useCollectibleMetadata,
  useCollectionMetadata,
} from '~/hooks/data';
import { useOrderbookTopOrders } from '~/hooks/orderbook';
import { _addToCart_ } from '~/lib/stores';
import { CartType } from '~/lib/stores/cart/types';
import { OrderModalContent } from '~/modals/OrderModalContent';
import { defaultSelectionQuantity } from '~/utils/quantity';
import { getThemeManagerElement } from '~/utils/theme';

import { Button, Dialog, Flex, ScrollArea, Text } from '$ui';
import { SortOrder } from '@0xsequence/indexer';
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

  const { data: defaultCurrencies, isLoading: isLoadingCurrencies } =
    useDefaultCurrencies({
      chainId: chainId,
      collectionAddress: collectionAddress,
    });

  const currencies =
    defaultCurrencies?.data.map((c) => c.contractAddress) || [];

  const { data: bestOffers, isLoading: isLoadingBestOffers } =
    useOrderbookTopOrders(chainId, {
      collectionAddress,
      currencyAddresses: currencies,
      orderbookContractAddress: ORDERBOOK_CONTRACT_ADDRESS,
      tokenIDs: [tokenId],
      isListing: false,
      priceSort: SortOrder.DESC,
    });

  const bestOffer = bestOffers?.orders[0];

  const { data: bestListings, isLoading: isLoadingBestListings } =
    useOrderbookTopOrders(chainId, {
      collectionAddress,
      currencyAddresses: currencies,
      orderbookContractAddress: ORDERBOOK_CONTRACT_ADDRESS,
      tokenIDs: [tokenId],
      isListing: true,
      priceSort: SortOrder.DESC,
    });

  const bestListing = bestListings?.orders[0];

  const {
    data: collectiblesMetadata,
    isLoading: isLoadingCollectibleMetadata,
  } = useCollectibleMetadata({
    chainID: String(chainId),
    contractAddress: collectionAddress,
    tokenIDs: [tokenId],
  });
  const collectibleMetadata = collectiblesMetadata?.data[0];

  const { data: collectionMetadata, isLoading: isCollectionMetadataLoading } =
    useCollectionMetadata({
      chainID: String(chainId),
      contractAddress: collectionAddress,
    });

  const isERC1155 = collectionMetadata?.data?.contractInfo.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalance, isLoading: isBalanceLoading } =
    useCollectibleBalance({
      chainId: chainId,
      userAddress: address as string,
      contractAddress: collectionAddress,
      tokenId: tokenId,
    });

  const hasUserBalance = userBalance?.gt(0);

  const item721AlreadyOwned = hasUserBalance && !isERC1155;

  const isLoading =
    isLoadingCurrencies ||
    isLoadingBestOffers ||
    isLoadingBestListings ||
    isLoadingCollectibleMetadata ||
    (isConnected && isBalanceLoading) ||
    isCollectionMetadataLoading;

  const onClickBuy = () => {
    if (!bestListing) return;

    _addToCart_({
      type: CartType.ORDERBOOK,
      item: {
        chainId,
        itemType: OrderItemType.BUY_ORDERBOOK,
        collectibleMetadata: {
          collectionAddress: bestListing.tokenContract,
          tokenId: bestListing.tokenId,
          name: collectibleMetadata?.name || '',
          imageUrl: collectibleMetadata?.image || '',
          decimals: collectibleMetadata?.decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.BUY_ORDERBOOK,
          tokenDecimals: collectibleMetadata?.decimals || 0,
          tokenUserBalance: BigInt(userBalance?.toString() || 0),
          tokenAvailableAmount: BigInt(Number(bestListing.quantityRemaining)),
        }),
        orderbookOrderId: bestListing.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  const onClickSell = () => {
    if (!bestOffer) return;

    _addToCart_({
      type: CartType.ORDERBOOK,
      item: {
        chainId,
        itemType: OrderItemType.SELL_ORDERBOOK,
        collectibleMetadata: {
          collectionAddress: bestOffer.tokenContract,
          tokenId: bestOffer.tokenId,
          name: collectibleMetadata?.name || '',
          imageUrl: collectibleMetadata?.image || '',
          decimals: collectibleMetadata?.decimals || 0,
          chainId,
        },
        quantity: defaultSelectionQuantity({
          type: OrderItemType.SELL_ORDERBOOK,
          tokenDecimals: collectibleMetadata?.decimals || 0,
          tokenUserBalance: BigInt(userBalance?.toString() || 0),
          tokenAvailableAmount: BigInt(Number(bestOffer.quantityRemaining)),
        }),
        orderbookOrderId: bestOffer.orderId,
      },
      options: {
        toggle: true,
      },
    });
  };

  const buyDisabled = !bestListing || item721AlreadyOwned;
  const offerDisabled = !isConnected;
  const listingDisabled = !isConnected || !hasUserBalance;

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
              onOpenAutoFocus={(e) => e.preventDefault()} // to prevent a Tooltip in Dialog to open by default
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
          // button disabled until a new flow is figured out
          // disabled={sellDisabled}
          disabled
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
              onOpenAutoFocus={(e) => e.preventDefault()} // to prevent a Tooltip in Dialog to open by default
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
