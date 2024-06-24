'use client';

import { useEffect, useRef, useState } from 'react';

import { getNetworkConfigAndClients } from '~/api';
import { OrderItemType } from '~/api/types/order';
import { useCollectibleMetadata } from '~/hooks/data';
import useElementDimensions from '~/hooks/ui/useElementDimentions';
import type { CartItem } from '~/lib/stores';
import {
  formatDecimals,
  formatDisplay,
  truncateAtMiddle,
} from '~/utils/helpers';
import { getThemeManagerElement } from '~/utils/theme';

import {
  Avatar,
  Badge,
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  Dialog,
  Flex,
  Image,
  LinkIcon,
  Text,
  cn,
} from '$ui';
import { getSubTitleFromCartData, getTitleFromCartData } from './utils';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

type TransactionConfitmationModalProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;

  cartType: OrderItemType | undefined;
  cartItems: readonly CartItem[];

  transactionId: string;
};

export const TransactionConfirmationModal = ({
  open,
  onOpenChange,
  cartType,
  cartItems,
  transactionId,
}: TransactionConfitmationModalProps) => {
  if (!cartType) return null;

  const title = getTitleFromCartData({ cartType, cartItems });
  const subTitle = getSubTitleFromCartData({ cartType, cartItems });

  const { networkConfig: network } = getNetworkConfigAndClients(
    cartItems[0]?.chainId,
  );

  const maxW = 'max-w-xs sm:max-w-sm md:max-w-md';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.BaseContent
        className={cn(maxW, 'px-0 py-4')}
        container={getThemeManagerElement()}
      >
        <Box className={maxW}>
          <Flex className="flex-col gap-2">
            <Text className="text-center font-medium uppercase text-foreground/50">
              {subTitle}
            </Text>

            <CartItems items={cartItems} />

            {transactionId ? (
              <Flex className="mx-auto mt-6 items-center gap-4">
                <Text className="text-sm uppercase text-foreground/40">
                  Transaction Details
                </Text>

                <Button asChild variant="secondary" size="sm">
                  <a
                    href={`${network?.explorerUrl}/tx/${transactionId}`}
                    target="_blank"
                  >
                    <LinkIcon />
                    {truncateAtMiddle(transactionId, 12)}
                  </a>
                </Button>
              </Flex>
            ) : null}

            <Flex className="mt-4">
              <TransactionConfirmationFooter cartType={cartType} />
            </Flex>
          </Flex>
        </Box>
      </Dialog.BaseContent>
    </Dialog.Root>
  );
};

const CartItems = ({ items }: { items: readonly CartItem[] }) => {
  const boxRef = useRef<HTMLDivElement>();

  const [activeIndex, setActiveIndex] = useState(0);
  const { ref: elementRef, dimensions } = useElementDimensions();

  const prevActiveIndex = useRef(0);
  useEffect(() => {
    if (!dimensions.width) return;

    const num = dimensions.width * activeIndex;

    if (boxRef.current) {
      boxRef.current.scrollTo({
        left: Number(num.toFixed(2)),
        behavior: 'smooth',
      });
    }

    prevActiveIndex.current = activeIndex;
  }, [activeIndex]);

  if (items.length === 1) {
    return (
      <Flex className="mx-auto w-full max-w-full">
        <CartItemBox {...items[0]} />
      </Flex>
    );
  }

  return (
    <Flex className="items-center">
      <Button
        variant="ghost"
        onClick={() => {
          if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
          }
        }}
      >
        <ChevronLeftIcon />
      </Button>

      <Flex
        // @ts-ignore
        ref={boxRef}
        className={cn('flex-1 gap-5', 'no-scrollbar snap-x overflow-x-auto')}
      >
        {items.map((item, i) => {
          return (
            <Flex
              key={i}
              ref={i === 0 ? elementRef : null}
              className="min-w-full snap-center"
            >
              <CartItemBox key={i} {...item} />
            </Flex>
          );
        })}
      </Flex>

      <Button
        variant="ghost"
        onClick={() => {
          if (activeIndex < items.length - 1) {
            setActiveIndex(activeIndex + 1);
          }
        }}
      >
        <ChevronRightIcon />
      </Button>
    </Flex>
  );
};

const CartItemBox = (item: CartItem) => {
  const {
    chainId,
    itemType,
    collectibleMetadata,
    exchangeAddress,
    quantity,
    subtotal,
  } = item;

  const { name, tokenId, decimals, imageUrl } = collectibleMetadata;

  const exchange = exchangeData?.data;

  const { data: lpTokenMetadataResp, isLoading: isLpTokenMetadataLoading } =
    useCollectibleMetadata({
      chainID: String(exchange?.chainId),
      contractAddress: exchange?.exchangeAddress,
      tokenIDs: [tokenId],
    });

  const lpTokenMetadata = lpTokenMetadataResp?.data[0];

  const subtotalNum = formatDecimals(
    ethers.BigNumber.from(subtotal),
    exchange?.currency.decimals || 0,
  );
  const quantityNum = formatDecimals(ethers.BigNumber.from(quantity), decimals);

  const eachNum = Number(subtotalNum) / Number(quantityNum);
  const each = formatDisplay(eachNum);

  const collectibleHasDecimals = (collectibleMetadata.decimals || 0) > 0;
  const formatQuantity = formatDecimals(quantity, decimals);

  const renderQuantity = () => {
    if (collectibleHasDecimals) {
      return `${formatQuantity} x`;
    } else {
      return null;
    }
  };

  switch (itemType) {
    case OrderItemType.TRANSFER: {
      return (
        <Flex className="w-full flex-col items-center gap-4">
          <Text className="text-center uppercase text-foreground/60">
            {renderQuantity()} {name}
          </Text>

          <Image.Base src={imageUrl} containerClassName="h-[300px]" />
        </Flex>
      );
    }

    case OrderItemType.BUY_ORDERBOOK: {
      if (isError) return null;

      return (
        <Flex className="w-full flex-col items-center gap-4">
          <Text className={'text-center uppercase text-foreground/60'}>
            {renderQuantity()} {name}
          </Text>

          <Image.Base src={imageUrl} containerClassName="h-[300px]" />
        </Flex>
      );
    }
    case OrderItemType.SELL_ORDERBOOK: {
      if (isError) return null;

      return (
        <Flex className="w-full flex-col items-center gap-4">
          <Text className="text-center uppercase text-foreground/60">
            {renderQuantity()} {name}
          </Text>

          <Image.Base src={imageUrl} containerClassName="h-[300px] w-full" />
        </Flex>
      );
    }
  }

  return null;
};

type TransactionConfirmationFooterProps = {
  cartType: OrderItemType;
};

const TransactionConfirmationFooter = ({
  cartType,
}: TransactionConfirmationFooterProps) => {
  switch (cartType) {
    case OrderItemType.DEPOSIT: {
      return (
        <Text className="px-4 text-center text-sm uppercase text-foreground/50">
          <Text className="text-center uppercase text-destructive">
            Do not burn this SFT
          </Text>
          if you do, you will lose your liquidity. the wallet that holds this
          sft will have exclusive access to your position
        </Text>
      );
    }
  }

  return <></>;
};
