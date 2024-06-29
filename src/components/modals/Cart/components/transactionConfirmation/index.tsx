'use client';

import { useEffect, useRef, useState } from 'react';

import { getChain } from '~/config/networks';
import useElementDimensions from '~/hooks/ui/useElementDimensions';
import { type CartItem } from '~/lib/stores/cart/types';
import { OrderItemType } from '~/lib/stores/cart/types';
import { truncateAtMiddle, formatDecimals } from '~/lib/utils/helpers';
import { getThemeManagerElement } from '~/lib/utils/theme';

import {
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

  const network = getChain(cartItems[0]?.chainId || 1);

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore -- TODO: fix this
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
  const { itemType, collectibleMetadata, quantity } = item;

  const { name, decimals, imageUrl } = collectibleMetadata;

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

    case OrderItemType.BUY: {
      return (
        <Flex className="w-full flex-col items-center gap-4">
          <Text className={'text-center uppercase text-foreground/60'}>
            {renderQuantity()} {name}
          </Text>

          <Image.Base src={imageUrl} containerClassName="h-[300px]" />
        </Flex>
      );
    }
    case OrderItemType.SELL: {
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
};
