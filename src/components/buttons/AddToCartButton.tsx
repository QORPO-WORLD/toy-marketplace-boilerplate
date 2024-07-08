'use client';

import {
  CollectionOfferModal$,
  type CollectionOfferModalState,
} from '~/app/collection/[chainParam]/[collectionId]/_components/ListingOfferModal';
import { useCartItem } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import {
  addCollectibleOrderToCart,
  addTransferOrderToCart,
} from '~/lib/stores/cart/Cart';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Button } from '$ui';
import type { ContractType } from '@0xsequence/metadata';
import { usePathname } from 'next/navigation';

enum ButtonLabel {
  PLACE_OFFER = 'Place offer',
  REMOVE_FROM_CART = 'Remove from cart',
  ADD_TO_CART = 'Add to cart',
  SELL = 'Sell',
  CREATE_LISTING = 'Create Listing',
  REMOVE_FROM_TRANSFERS = 'Remove from transfers',
  TRANSFER = 'Transfer token',
}

type AddToCartButtonProps = {
  className?: string;
  chainId: number;
  collectionId: string;
  collectibleOrder: CollectibleOrder;
  contractType?: ContractType;
};

export const AddToCartButton = ({
  className,
  chainId,
  collectionId,
  collectibleOrder,
  contractType,
}: AddToCartButtonProps) => {
  const itemType = useOrderItemFromPath();
  const order = collectibleOrder.order;

  let onClick: () => void;
  let label: ButtonLabel;

  const cartItem = useCartItem({
    collectibleOrder,
    chainId,
    collectionId,
    itemType,
  });

  //TODO: Hide transfer button, until its implemented
  if (itemType === OrderItemType.TRANSFER) {
    return null;
  }

  switch (itemType) {
    case OrderItemType.BUY:
      if (cartItem) {
        onClick = () =>
          addCollectibleOrderToCart({
            collectibleOrder,
            itemType: OrderItemType.BUY,
          });
        label = ButtonLabel.REMOVE_FROM_CART;
      } else {
        onClick = () => {
          if (order) {
            addCollectibleOrderToCart({
              collectibleOrder,
              itemType: OrderItemType.BUY,
            });
          } else {
            const state: CollectionOfferModalState = {
              chainId,
              type: 'offer',
              collectionAddress: collectionId,
              tokenId: collectibleOrder.metadata.tokenId,
            };

            CollectionOfferModal$.state.set(state);
            CollectionOfferModal$.open.set(true);
          }
        };
        label = order ? ButtonLabel.ADD_TO_CART : ButtonLabel.PLACE_OFFER;
      }
      break;
    case OrderItemType.SELL:
      onClick = () => {
        const state: CollectionOfferModalState = {
          chainId,
          type: 'listing',
          collectionAddress: collectionId,
          tokenId: collectibleOrder.metadata.tokenId,
          bestListing: collectibleOrder.order,
        };

        CollectionOfferModal$.state.set(state);
        CollectionOfferModal$.open.set(true);
      };
      label = ButtonLabel.SELL;
      break;

    case OrderItemType.TRANSFER:
      onClick = () =>
        addTransferOrderToCart({
          metadata: collectibleOrder.metadata,
          itemType: OrderItemType.TRANSFER,
          contractType: contractType!,
        });
      label = cartItem
        ? ButtonLabel.REMOVE_FROM_TRANSFERS
        : ButtonLabel.TRANSFER;
      break;
    default:
      const _: never = itemType;
      return _;
  }

  return (
    <Button onClick={onClick} className={className}>
      {label}
    </Button>
  );
};

const useOrderItemFromPath = () => {
  const path = usePathname();
  if (path.startsWith('/inventory')) {
    return OrderItemType.TRANSFER;
  } else if (path.endsWith('/buy')) {
    return OrderItemType.BUY;
  } else if (path.endsWith('/sell')) {
    return OrderItemType.SELL;
  }
  return OrderItemType.BUY;
};
