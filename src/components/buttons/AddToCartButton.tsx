'use client';

import { Button } from '$ui';
import { Order } from '@0xsequence/marketplace-sdk';
import {
  useCreateListingModal,
  useMakeOfferModal,
  useSellModal,
  useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { Hex } from 'viem';

type OrderSide = 'buy' | 'sell' | 'transfer' | 'order' | 'listing';

type AddToCartButtonProps = {
  className?: string;
  orderSide: OrderSide;
  tokenId: string;
  collectionAddress: string;
  chainId: string;
  receivedOffer?: Order;
  collectibleName?: string;
};

export const AddToCartButton = ({
  className,
  orderSide,
  tokenId,
  collectionAddress,
  chainId,
  receivedOffer,
  collectibleName,
}: AddToCartButtonProps) => {
  const { show: showCreateListingModal } = useCreateListingModal();
  const { show: showMakeOfferModal } = useMakeOfferModal();
  const { show: showSellModal } = useSellModal();
  const { show: showTransferModal } = useTransferModal();

  const orderTypes = {
    buy: {
      label: 'Buy',
      // TODO: Implement buy
      onClick: () => {
        console.log('buy');
      },
    },
    sell: {
      label: 'Sell',
      onClick: () => {
        if (!receivedOffer || !collectibleName)
          throw new Error(
            'receivedOffer and collectibleName are required for sell',
          );

        showSellModal({
          tokenId,
          collectionAddress,
          chainId,
          order: receivedOffer!,
          collectibleName: collectibleName!,
        });
      },
    },
    transfer: {
      label: 'Transfer',
      onClick: () => {
        showTransferModal({
          tokenId,
          collectionAddress: collectionAddress as Hex,
          chainId,
        });
      },
    },
    order: {
      label: 'Place offer',
      onClick: () => {
        showMakeOfferModal({
          collectionAddress,
          chainId,
          collectibleId: tokenId,
        });
      },
    },
    listing: {
      label: 'Create Listing',
      onClick: () => {
        showCreateListingModal({
          collectionAddress: '0x0',
          chainId: '1',
          collectibleId: '0',
        });
      },
    },
  };
  const { label } = orderTypes[orderSide];

  return (
    <Button onClick={orderTypes[orderSide].onClick} className={className}>
      {label}
    </Button>
  );
};
