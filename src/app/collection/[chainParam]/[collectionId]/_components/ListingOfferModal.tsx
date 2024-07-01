import type { OrderbookModalType } from '~/components/modals/OrderModalContent';
import { OrderForm } from '~/components/modals/OrderModalContent/OrderForm';
import { Dialog, Flex } from '~/components/ui';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import {
  collectableQueries,
  collectionQueries,
  currencyQueries,
} from '~/lib/queries';
import {
  type Order,
  OrderSide,
  OrderStatus as OrderStatusMarket,
} from '~/lib/queries/marketplace/marketplace.gen';
import { getThemeManagerElement } from '~/lib/utils/theme';

import {
  OrderStatus as OrderStatusIndexer,
  type OrderbookOrder,
} from '@0xsequence/indexer';
import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useQuery } from '@tanstack/react-query';

export type CollectionOfferModalState = {
  chainId: number;
  collectionAddress: string;
  tokenId: string;
  type: OrderbookModalType;
  bestListing?: Order;
};

interface Store {
  open: boolean;
  state: CollectionOfferModalState;
}

export const CollectionOfferModal$ = observable<Store>({
  open: false,
  state: {
    chainId: 0,
    collectionAddress: '',
    tokenId: '',
    type: 'offer',
    bestListing: undefined,
  },
});

export const CollectionOfferModal = observer(() => {
  const {
    open,
    state: { chainId, collectionAddress, tokenId, bestListing, type },
  } = CollectionOfferModal$;

  const collectionMetadata = useQuery(
    collectionQueries.detail({
      chainID: chainId.get().toString(),
      collectionId: collectionAddress.get(),
    }),
  );
  const tokenMetadata = useQuery(
    collectableQueries.detail({
      chainID: chainId.get().toString(),
      contractAddress: collectionAddress.get(),
      tokenIDs: [tokenId.get()],
    }),
  );

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { data: royaltyPercentage } = useCollectionRoyalty({
    chainId: chainId.get(),
    contractAddress: collectionAddress.get(),
    tokenId: tokenId.get(),
  });

  const { data: currencies } = useQuery(
    currencyQueries.list({
      chainId: chainId.get(),
    }),
  );

  //TODO, unify Order and OrderbookOrder
  let order: OrderbookOrder | undefined;
  const listing = bestListing.get();
  if (listing) {
    order = {
      orderId: listing.orderId,
      tokenContract: '',
      tokenId: listing.tokenId,
      isListing: listing.side === OrderSide.listing,
      quantity: listing.quantityInitial,
      quantityRemaining: listing.quantityRemaining,
      currencyAddress: listing.priceCurrencyAddress,
      pricePerToken: listing.priceAmount,
      expiry: listing.validUntil,
      orderStatus: getOrderStatus(listing.status),
      createdBy: listing.createdBy,
      createdAt: 0,
      orderbookContractAddress: SEQUENCE_MARKET_V1_ADDRESS,
    } satisfies OrderbookOrder;
  }
  const title = type.get() == 'offer' ? 'Create an offer' : 'Make a listing';

  return (
    <Flex className="w-full flex-col gap-3">
      <Dialog.Root
        open={open.get()}
        onOpenChange={(isOpen) => open.set(isOpen)}
      >
        <Dialog.BaseContent
          container={getThemeManagerElement()}
          className="max-h-screen max-w-[700px] p-5"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title>{title}</Dialog.Title>
          {collectionMetadata.data && tokenMetadata.data && currencies && (
            <OrderForm
              type={type.get()}
              chainId={chainId.get()}
              collectionMetadata={collectionMetadata.data}
              tokenMetadata={tokenMetadata.data}
              currencyOptions={currencies.currencies}
              isERC1155={isERC1155}
              bestOrder={order}
              setOpen={(isOpen) => open.set(isOpen)}
              royaltyPercentage={royaltyPercentage}
            />
          )}
        </Dialog.BaseContent>
      </Dialog.Root>
    </Flex>
  );
});

export const getOrderStatus = (
  status: OrderStatusMarket,
): OrderStatusIndexer => {
  switch (status) {
    case OrderStatusMarket.active:
      return OrderStatusIndexer.OPEN;
    case OrderStatusMarket.filled:
    case OrderStatusMarket.expired:
    case OrderStatusMarket.inactive:
    case OrderStatusMarket.unknown:
      return OrderStatusIndexer.CLOSED;
    case OrderStatusMarket.cancelled:
      return OrderStatusIndexer.CANCELLED;
  }
};
