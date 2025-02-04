'use client';

import { env } from '~/env';

import { Button, Flex, Text, toast } from '$ui';
import { useCollectableData } from '../_hooks/useCollectableData';
import { OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
  useBalanceOfCollectible,
  useBuyModal,
  useCreateListingModal,
  useCurrencies,
  useCurrencyOptions,
  useHighestOffer,
  useLowestListing,
  useMakeOfferModal,
  useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

interface CollectibleTradeActionsProps {
  chainId: number;
  tokenId: string;
  collectionAddress: Hex;
  isYour?: boolean;
}
export const CollectibleTradeActions = ({
  isYour,
  chainId,
  tokenId,
  collectionAddress,
}: CollectibleTradeActionsProps) => {
  const onError = (error: Error) => {
    toast.error(error.message);
  };
  const { data: collectionDataOrder } = useFloorOrder({
    chainId: String(chainId),
    collectionAddress,
  });

  const { show: showListModal } = useCreateListingModal({ onError });
  const { show: showOfferModal } = useMakeOfferModal({
    onError,
  });
  const { show: showSellModal } = useSellModal({ onError });
  const { show: showBuyModal } = useBuyModal({
    onSuccess(hash) {
      console.log('Buy transaction sent with hash: ', hash);
    },
    onError,
  });
  const currencyOptions = useCurrencyOptions({
    collectionAddress,
  });
  const { data: currencies } = useCurrencies({
    chainId,
    currencyOptions,
  });

  const currencyAddresses = currencies?.map((c) => c.contractAddress) || [];

  const { data: highestOffer, isLoading: isLoadingHighestOffer } =
    useHighestOffer({
      chainId: String(chainId),
      collectionAddress,
      tokenId: tokenId,
      filter: {
        currencies: currencyAddresses,
      },
      query: {
        enabled: !!currencies,
      },
    });

  const { data: lowestListing, isLoading: loadingLowestListing } =
    useLowestListing({
      chainId: String(chainId),
      collectionAddress,
      tokenId,
      query: {
        enabled: !!currencies,
      },
    });

  const { collectionMetadata } = useCollectableData();

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { address, isConnected } = useAccount();

  const { data: userBalanceResp, isLoading: isBalanceLoading } =
    useBalanceOfCollectible({
      chainId: chainId,
      collectionAddress,
      collectableId: tokenId,
      userAddress: address,
      query: {
        enabled: !!isConnected && !!address,
      },
    });

  const tokenBalance = userBalanceResp?.balance;

  const item721AlreadyOwned = !!tokenBalance && !isERC1155;

  const isLoading =
    isLoadingHighestOffer ||
    loadingLowestListing ||
    (isConnected && isBalanceLoading);

  const onClickBuy = () => {
    showBuyModal({
      chainId: String(chainId),
      collectionAddress,
      tokenId,
      order: lowestListing!.order!,
    });
  };

  const onClickSell = () => {
    showSellModal({
      collectionAddress,
      chainId: String(chainId),
      tokenId,
      order: highestOffer!.order!,
    });
  };

  const onClickOffer = () => {
    showOfferModal({
      collectionAddress,
      chainId: String(chainId),
      collectibleId: tokenId,
    });
  };

  const onClickList = () => {
    showListModal({
      collectionAddress,
      chainId: String(chainId),
      collectibleId: tokenId,
    });
  };

  const buyDisabled =
    !isConnected || !lowestListing?.order || item721AlreadyOwned;
  const offerDisabled = !isConnected || item721AlreadyOwned;
  const listingDisabled = !isConnected || !tokenBalance;
  const sellDisabled = !isConnected || !highestOffer?.order || !tokenBalance;

  return (
    <Flex className="flex-col gap-4">
      <Flex className="flex-row gap-3 flex-1 w-full mb:flex-col">
        {lowestListing?.order && !isYour && (
          <Button
            size="lg"
            className="btn-main flex-1"
            loading={isLoading}
            disabled={buyDisabled}
            onClick={onClickBuy}
          >
            <Text className="text-inherit">Buy</Text>
          </Button>
        )}
        {!offerDisabled && listingDisabled && (
          <Button
            className="btn-main variant-black flex-1 "
            onClick={onClickOffer}
            size="lg"
            loading={false}
            disabled={offerDisabled}
          >
            <Text className="text-inherit">make Offer</Text>
          </Button>
        )}
        {!sellDisabled && (
          <Button
            className="btn-main w-full "
            size="lg"
            loading={isLoading}
            disabled={sellDisabled}
            onClick={onClickSell}
          >
            <Text className="text-inherit text-center">Sell</Text>
          </Button>
        )}
        {!listingDisabled && (
          <Button
            className="btn-main w-full variant-black "
            onClick={onClickList}
            size="lg"
            loading={false}
            disabled={listingDisabled}
          >
            <Text className="text-inherit text-center">place offer</Text>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
