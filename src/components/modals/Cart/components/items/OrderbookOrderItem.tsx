'use client';

import { CurrencyAvatar } from '~/components/Avatars';
import { classNames } from '~/config/classNames';
import { useCollectionType } from '~/hooks/collection/useCollectionType';
import { collectionQueries } from '~/lib/queries';
import { type OrderRequest } from '~/lib/sdk/orderbook/clients/Orderbook';
import { removeFromCart, editQuantity } from '~/lib/stores/cart/Cart';
import { type CartItem } from '~/lib/stores/cart/types';
import { formatDecimals } from '~/lib/utils/helpers';

import {
  Button,
  Grid,
  Flex,
  Text,
  Image,
  cn,
  AddIcon,
  CloseIcon,
  SubtractIcon,
} from '$ui';
import { QuantityModal } from './QuantityModal';
import { formatDisplay } from '@0xsequence/kit';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { parseUnits } from 'viem';

interface OrderbookOrderItemProps {
  item: CartItem;
  order: OrderRequest;
  isLoading: boolean;
  price?: string;
  maxQuantity: number;
  isOrderValid: boolean;
}

export const OrderbookOrderItem = ({
  item,
  order,
  isLoading,
  price,
  maxQuantity,
  isOrderValid,
}: OrderbookOrderItemProps) => {
  const { data: currencyMetadata, isLoading: isCurrencyMetadataLoading } =
    useQuery(
      collectionQueries.detail({
        chainID: item.chainId.toString(),
        collectionId: order.currency,
      }),
    );

  const { isERC1155 } = useCollectionType({
    chainId: item.chainId,
    collectionAddress: item.collectibleMetadata.collectionAddress,
  });

  const showQuantityAndSubtotal = isERC1155 && isOrderValid;

  return (
    <Grid.Root
      className={cn(classNames.orderCollectible, 'gap-y-4')}
      template={`
        [row1-start] "info" [row1-end]
       ${
         showQuantityAndSubtotal
           ? `
        [row2-start] "quantity" [row2-end]
        [row2-start] "subtotal" [row2-end]
        `
           : ''
       }
        / 100%
      `}
    >
      <Grid.Child name="info">
        <OrderCollectibleMetadata
          isOrderValid={isOrderValid}
          item={item}
          order={order}
          isLoading={isLoading}
          price={price}
          currencySymbol={currencyMetadata?.symbol || 'unknown'}
          currencyUrl={currencyMetadata?.logoURI || ''}
          maxQuantity={maxQuantity}
          currencyDecimals={currencyMetadata?.decimals || 0}
        />
      </Grid.Child>
      {showQuantityAndSubtotal ? (
        <>
          <Grid.Child name="quantity">
            <OrderCollectibleQuantity item={item} maxQuantity={maxQuantity} />
          </Grid.Child>
          <Grid.Child name="subtotal">
            <OrderCollectibleSubtotal
              item={item}
              currencyDecimals={currencyMetadata?.decimals || 0}
              currencyUrl={currencyMetadata?.logoURI || ''}
              isLoading={isLoading}
              price={price}
            />
          </Grid.Child>
        </>
      ) : null}
    </Grid.Root>
  );
};

interface OrderCollectibleMetadataProps extends OrderbookOrderItemProps {
  currencyUrl: string;
  currencySymbol: string;
  currencyDecimals: number;
}

const OrderCollectibleMetadata = ({
  item,
  price,
  isLoading,
  currencyUrl,
  currencySymbol,
  maxQuantity,
  currencyDecimals,
  isOrderValid,
}: OrderCollectibleMetadataProps) => {
  const { isERC1155, isLoading: isCollectionTypeLoading } = useCollectionType({
    chainId: item.chainId,
    collectionAddress: item.collectibleMetadata.collectionAddress,
  });

  const formattedPrice = price
    ? formatDecimals(ethers.BigNumber.from(price), currencyDecimals)
    : undefined;

  const displayPrice = !isLoading ? formattedPrice : '-------';

  return (
    <Grid.Root
      className={cn(classNames.orderCollectibleInfo, 'gap-x-3')}
      template={`
        [row1-start] "img tokenid remove-btn" 20px [row1-end]
        [row2-start] "img name name" [row2-end]
        [row3-start] "img price price" [row3-end]
        [row4-start] "img error error" [row4-end]
        / minmax(42px, 66px) 1fr max-content
        `}
    >
      <Grid.Child name="img">
        <Image.Base
          src={item.collectibleMetadata.imageUrl}
          alt={item.collectibleMetadata.name}
          containerClassName="aspect-square rounded-md bg-foreground/5"
        />
      </Grid.Child>

      <Grid.Child name="tokenid">
        <Text as="span" className="text-xs text-foreground/40">
          #{item.collectibleMetadata.tokenId}
        </Text>
      </Grid.Child>

      <Grid.Child name="price" className="pt-2">
        {displayPrice !== undefined && !isERC1155 && (
          <CurrencyAvatar
            size="sm"
            loading={isLoading}
            amount={displayPrice}
            currency={{
              src: currencyUrl,
              symbol: currencySymbol,
            }}
          />
        )}
      </Grid.Child>

      {!displayPrice && !isLoading && (
        <Grid.Child name="error">
          <Text
            loading={isLoading}
            as="span"
            className="text-xs font-medium text-destructive"
          >
            Unavailable
          </Text>
        </Grid.Child>
      )}

      {!isOrderValid && (
        <Grid.Child name="error">
          <Text
            loading={isLoading}
            as="span"
            className="text-xs font-medium text-destructive"
          >
            Invalid order
          </Text>
        </Grid.Child>
      )}

      <Grid.Child
        id="remove-btn"
        onClick={() => removeFromCart(item)}
        className="cursor-pointer text-foreground/30 hover:text-foreground/50"
      >
        <CloseIcon />
      </Grid.Child>

      <Grid.Child name="name">
        <Text
          className="text-sm max-lines-[3]"
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
  maxQuantity: number;
}

const OrderCollectibleQuantity = ({
  maxQuantity,
  item,
}: OrderCollectibleQuantityProps) => {
  const maxQuantityBn = BigInt(maxQuantity);
  const one = parseUnits('1', item.collectibleMetadata.decimals || 0);

  const onMaxQuantitySelected = async () => {
    editQuantity(item, maxQuantityBn);
  };

  const onSub = async () => {
    editQuantity(item, item.quantity - one);
  };

  const onAdd = async () => {
    if (maxQuantity && item.quantity + one >= maxQuantity) {
      editQuantity(item, maxQuantityBn);
    } else {
      editQuantity(item, item.quantity + one);
    }
  };

  return (
    <Flex className="max-w-full items-center justify-end gap-3">
      <Flex className="h-fit w-full items-center overflow-auto border border-input bg-background">
        <Button
          className="px-3 ring-offset-4"
          size="xs"
          variant="ghost"
          onClick={onSub}
          disabled={item.quantity <= one}
        >
          <SubtractIcon className="h-3 w-3" />
        </Button>
        <Text className="ellipsis flex-1 px-2 text-sm text-foreground/80">
          {formatDecimals(item.quantity, item.collectibleMetadata.decimals)}
        </Text>
        <Button
          className="ring-offset-4"
          size="xs"
          variant="ghost"
          onClick={onAdd}
          disabled={maxQuantityBn == item.quantity}
        >
          <AddIcon className="h-4 w-4" />
        </Button>
      </Flex>
      <Button
        size="xs"
        variant="muted"
        className="flex-1"
        disabled={maxQuantityBn == item.quantity}
        onClick={onMaxQuantitySelected}
      >
        MAX
      </Button>

      <QuantityModal item={item} maxQuantity={maxQuantity} />
    </Flex>
  );
};

interface OrderCollectibleSubtotalProps {
  item: CartItem;
  currencyUrl: string;
  currencyDecimals: number;
  isLoading: boolean;
  price?: string;
}

const OrderCollectibleSubtotal = ({
  item,
  currencyUrl,
  currencyDecimals,
  isLoading,
}: OrderCollectibleSubtotalProps) => {
  const subtotalNum = formatDecimals(
    ethers.BigNumber.from(item.subtotal),
    currencyDecimals,
  );

  const quantityNum = formatDecimals(
    ethers.BigNumber.from(item.quantity),
    item.collectibleMetadata.decimals,
  );

  const eachNum = Number(subtotalNum) / Number(quantityNum);
  const each = formatDisplay(eachNum);

  const subtotal = formatDecimals(item.subtotal, currencyDecimals);

  return (
    <Flex className="w-full flex-col justify-end gap-2">
      <Flex className="w-full items-center justify-between">
        <Text className="text-xs font-medium uppercase text-foreground/60">
          Unit Price
        </Text>

        <CurrencyAvatar
          size="sm"
          currency={{
            src: currencyUrl,
            symbol: '',
          }}
          amount={each}
          title={eachNum + ''}
          loading={isLoading}
        />
      </Flex>

      <Flex className="w-full items-center justify-between">
        <Text className="text-xs font-medium uppercase text-foreground/60">
          Subtotal
        </Text>

        <CurrencyAvatar
          size="sm"
          currency={{
            src: currencyUrl,
            symbol: '',
          }}
          amount={subtotal}
          title={isLoading ? 'loading..' : 'SUBTOTAL: ' + subtotalNum}
          loading={isLoading}
        />
      </Flex>
    </Flex>
  );
};
