'use client';

import { formatDecimals, formatDisplay } from '~/api';
import { CurrencyAvatar } from '~/components/Avatars';
import { classNames } from '~/config/classNames';
import { useOrderItemMaxQuantity } from '~/hooks/cart/useOrderItemMaxQuantity';
import { useExchange } from '~/hooks/data';
import type { CartItem } from '~/lib/stores';
import { editQuantity, removeFromCart } from '~/lib/stores';

import {
  Grid,
  Flex,
  Button,
  Text,
  Image,
  cn,
  CloseIcon,
  AddIcon,
  LoadingIcon,
  SubtractIcon,
} from '$ui';
import { CartItemEditQuantityModal } from './QuantityModal';
import * as ethers from 'ethers';
import { parseUnits } from 'viem';

interface SwapOrderItemProps {
  item: CartItem;
  isLoading: boolean;
}

export const SwapOrderItem = ({ item, isLoading }: SwapOrderItemProps) => {
  return (
    <Grid.Root
      className={cn(classNames.orderCollectible, 'gap-y-4')}
      template={`
        [row1-start] "info" [row1-end]
        [row2-start] "quantity" [row2-end]
        [row2-start] "subtotal" [row2-end]
        / 100%
        `}
    >
      <Grid.Child id="info">
        <OrderCollectibleMetadata item={item} />
      </Grid.Child>

      <Grid.Child name="quantity">
        <OrderCollectibleQuantity item={item} />
      </Grid.Child>

      <Grid.Child name="subtotal">
        <OrderCollectibleSubtotal item={item} isLoading={isLoading} />
      </Grid.Child>
    </Grid.Root>
  );
};

interface OrderCollectibleMetadataProps {
  item: CartItem;
}

const OrderCollectibleMetadata = ({ item }: OrderCollectibleMetadataProps) => {
  return (
    <Grid.Root
      className={cn(classNames.orderCollectibleInfo, 'gap-x-4')}
      template={`
        [row1-start] "img tokenid remove-btn" [row1-end]
        [row2-start] "img name name" [row2-end]
        / minmax(42px, 56px) 1fr max-content
        `}
    >
      <Grid.Child name="img">
        <Image.Base
          src={item.collectibleMetadata.imageUrl}
          alt={item.collectibleMetadata.name}
          containerClassName="bg-foreground/5 rounded-md aspect-square"
        />
      </Grid.Child>

      <Grid.Child name="tokenid">
        <Text as="span" className="text-sm text-foreground/40">
          #{item.collectibleMetadata.tokenId}
        </Text>
      </Grid.Child>

      <Grid.Child
        id="remove-btn"
        onClick={() => removeFromCart(item)}
        className="text-foreground/30 hover:text-foreground/50 focus:text-foreground/50"
      >
        <CloseIcon />
      </Grid.Child>

      <Grid.Child name="name">
        <Text
          className="text-sm font-medium max-lines-[1]"
          title={item.collectibleMetadata.name}
        >
          {item.collectibleMetadata.name}
        </Text>
      </Grid.Child>
    </Grid.Root>
  );
};

interface OrderCollectibleQuantityProps {
  item: CartItem;
}

const OrderCollectibleQuantity = ({ item }: OrderCollectibleQuantityProps) => {
  const { getMaxQuantity, maxQuantity, isLoading } = useOrderItemMaxQuantity({
    chainId: item.chainId,
    itemType: item.itemType,
    collectionAddress: item.collectibleMetadata.collectionAddress,
    exchangeAddress: item.exchangeAddress || undefined,
    tokenId: item.collectibleMetadata.tokenId,
  });

  const onMaxQuantitySelected = async () => {
    const maxQuantity = await getMaxQuantity();

    if (maxQuantity) {
      editQuantity(item, maxQuantity);
    }
  };

  const onSub = async () => {
    const one = parseUnits('1', item.collectibleMetadata.decimals || 0);
    editQuantity(item, item.quantity - one);
  };

  const onAdd = async () => {
    const maxQuantity = await getMaxQuantity();
    const one = parseUnits('1', item.collectibleMetadata.decimals || 0);

    if (maxQuantity && item.quantity + one >= maxQuantity) {
      editQuantity(item, maxQuantity);
    } else {
      editQuantity(item, item.quantity + one);
    }
  };

  return (
    <Flex className="max-w-full items-center justify-end gap-3">
      <Flex className="h-fit w-full items-center overflow-auto rounded-sm border border-input bg-background">
        <Button
          className="px-3 ring-offset-4"
          size="xs"
          variant="ghost"
          onClick={onSub}
        >
          <SubtractIcon className="h-4 w-4" />
        </Button>
        <Text className="ellipsis flex-1 px-2 text-sm text-foreground/80">
          {formatDecimals(item.quantity, item.collectibleMetadata.decimals)}
        </Text>
        <Button
          className="ring-offset-4"
          size="xs"
          variant="ghost"
          onClick={onAdd}
          disabled={isLoading || maxQuantity === item.quantity}
        >
          {!isLoading ? (
            <AddIcon className="h-4 w-4" />
          ) : (
            <LoadingIcon className="h-4 w-4" />
          )}
        </Button>
      </Flex>

      <Button
        size="xs"
        variant="muted"
        className="flex-1"
        disabled={isLoading || maxQuantity === item.quantity}
        onClick={onMaxQuantitySelected}
      >
        MAX
      </Button>

      <CartItemEditQuantityModal item={item} />
    </Flex>
  );
};

interface OrderCollectibleSubtotalProps {
  item: CartItem;
  isLoading: boolean;
}

const OrderCollectibleSubtotal = ({ item }: OrderCollectibleSubtotalProps) => {
  const { data: exchangeResponse, isLoading: isExchangeLoading } = useExchange({
    chainId: item.chainId,
    exchangeAddress: item.exchangeAddress || undefined,
  });

  const exchange = exchangeResponse?.data || null;

  const subtotalNum = formatDecimals(
    ethers.BigNumber.from(item.subtotal),
    exchange?.currency.decimals || 0,
  );

  const quantityNum = formatDecimals(
    ethers.BigNumber.from(item.quantity),
    item.collectibleMetadata.decimals,
  );

  const eachNum = Number(subtotalNum) / Number(quantityNum);
  const each = formatDisplay(eachNum);

  const subtotal = formatDisplay(
    formatDecimals(item.subtotal, exchange?.currency.decimals || 0),
  );

  return (
    <Flex className="w-full flex-col justify-end gap-2">
      <Flex className="w-full items-center justify-between">
        <Text className="text-xs font-medium uppercase text-foreground/60">
          Unit Price
        </Text>

        <CurrencyAvatar
          size="sm"
          currency={{
            src: exchange?.currency?.iconUrl,
            symbol: '',
          }}
          amount={each}
          title={isExchangeLoading ? 'loading..' : eachNum + ''}
          loading={isExchangeLoading}
        />
      </Flex>

      <Flex className="w-full items-center justify-between">
        <Text className="text-xs font-medium uppercase text-foreground/60">
          Subtotal
        </Text>

        <CurrencyAvatar
          size="sm"
          currency={{
            src: exchange?.currency?.iconUrl,
            symbol: '',
          }}
          amount={subtotal}
          title={isExchangeLoading ? 'loading..' : 'SUBTOTAL: ' + subtotalNum}
          loading={isExchangeLoading}
        />
      </Flex>
    </Flex>
  );
};
