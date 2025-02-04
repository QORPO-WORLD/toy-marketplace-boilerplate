'use client';

import { env } from '~/env';

import { Button, toast } from '$ui';
import {
  useBalanceOfCollectible,
  useBuyModal,
  useCreateListingModal,
  useHighestOffer,
  useLowestListing,
  useMakeOfferModal,
  useSellModal,
  useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { usePathname } from 'next/navigation';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

type OrderSide = 'buy' | 'sell' | 'transfer' | 'order' | 'listing' | undefined;

type CollectibleActionButtonProps = {
  className?: string;
  tokenId: string;
  collectionAddress: Hex;
  collectibleName?: string;
  collectionChainId: string;
};

export const CollectibleActionButton = ({
  className,
  tokenId,
  collectionAddress,
  collectibleName,
  collectionChainId,
}: CollectibleActionButtonProps) => {
  const { address } = useAccount();
  const pathname = usePathname();

  const onError = (error: Error) => {
    toast.error(error.message);
  };
  const { show: showCreateListingModal } = useCreateListingModal({ onError });
  const { show: showMakeOfferModal } = useMakeOfferModal({ onError });
  const { show: showSellModal } = useSellModal({ onError });
  const { show: showBuyModal } = useBuyModal({ onError });
  const { show: showTransferModal } = useTransferModal();
  const { data: tokenBalancesData } = useBalanceOfCollectible({
    chainId: collectionChainId,
    collectionAddress,
    collectableId: tokenId,
    userAddress: address,
  });
  const collectibleBalance = tokenBalancesData?.balance;
  const userOwnsCollectible = !!collectibleBalance;
  const { data: highestOffer } = useHighestOffer({
    chainId: collectionChainId,
    collectionAddress,
    tokenId,
  });
  const { data: lowestListing } = useLowestListing({
    chainId: collectionChainId,
    collectionAddress,
    tokenId,
  });

  let orderSide: OrderSide = undefined;

  // sellable collectible
  if (userOwnsCollectible && highestOffer?.order) {
    orderSide = 'sell';
  }

  // transferable collectible
  if (userOwnsCollectible && !highestOffer?.order) {
    orderSide = pathname.includes('sell') ? 'transfer' : 'buy';
  }

  // offerable collectible
  if (!userOwnsCollectible && !lowestListing?.order) {
    orderSide = 'order';
  }

  // listable collectible
  if (userOwnsCollectible && !lowestListing?.order) {
    orderSide = pathname.includes('sell') ? 'listing' : 'order';
  }

  // inventory page
  if (pathname === '/inventory') {
    orderSide = 'listing';
  }

  // buyable collectible
  if (!userOwnsCollectible && lowestListing?.order) {
    orderSide = 'buy';
  }

  if (!orderSide) return null;

  let orderTypes:
    | Record<NonNullable<OrderSide>, { label: string; onClick: () => void }>
    | undefined = undefined;

  console.log('chainId', collectionChainId);

  orderTypes = {
    buy: {
      label: 'Buy',
      onClick: () => {
        if (!lowestListing || !collectibleName)
          throw new Error(
            'lowestListing and collectibleName are required for buy',
          );
        showBuyModal({
          tokenId,
          collectionAddress,
          chainId: collectionChainId,
          order: lowestListing.order!,
        });
      },
    },
    sell: {
      label: 'Sell',
      onClick: () => {
        if (!highestOffer || !collectibleName)
          throw new Error(
            'highestOffer and collectibleName are required for sell',
          );

        showSellModal({
          tokenId,
          collectionAddress,
          chainId: collectionChainId,
          order: highestOffer.order!,
        });
      },
    },
    transfer: {
      label: 'Transfer',
      onClick: () => {
        showTransferModal({
          collectibleId: tokenId,
          collectionAddress: collectionAddress,
          chainId: collectionChainId,
        });
      },
    },
    order: {
      label: 'Make offer',
      onClick: () => {
        showMakeOfferModal({
          collectionAddress,
          chainId: collectionChainId,
          collectibleId: tokenId,
        });
      },
    },
    listing: {
      label: 'Place offer',
      onClick: () => {
        showCreateListingModal({
          collectionAddress,
          chainId: collectionChainId,
          collectibleId: tokenId,
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
