'use client';

import { classNames } from '~/config/classNames';
import { useOrderItemMaxQuantity } from '~/hooks/cart/useOrderItemMaxQuantity';
import { useCollectionType } from '~/hooks/collection/useCollectionType';
import type { CartItem } from '~/lib/stores/cart/types';

import { Grid, Flex, Text, Image, cn, CloseIcon } from '$ui';
import QuantityInput from './QuantityInput';
import { CartItemEditQuantityModal } from './QuantityModal';
import { removeFromCart } from '~/lib/stores/cart/Cart';

interface TransferOrderItemProps {
  item: CartItem;
  isLoading: boolean;
}

export const TransferOrderItem = ({ item }: TransferOrderItemProps) => {
  const { isERC1155, isLoading: isCollectionTypeLoading } = useCollectionType({
    chainId: item.chainId,
    collectionAddress: item.collectibleMetadata.collectionAddress,
  });

  return (
    <Grid.Root
      className={cn(classNames.orderCollectible, 'gap-y-4')}
      template={`
        [row1-start] "info" [row1-end]
        [row2-start] "quantity" [row2-end]
        / 100%
        `}
    >
      <Grid.Child id="info">
        <OrderCollectibleMetadata item={item} />
      </Grid.Child>

      {!isCollectionTypeLoading && isERC1155 && (
        <Grid.Child name="quantity">
          <OrderCollectibleQuantity item={item} />
        </Grid.Child>
      )}
    </Grid.Root>
  );
};

interface OrderCollectibleMetadataProps {
  item: CartItem;
}

const OrderCollectibleMetadata = ({ item }: OrderCollectibleMetadataProps) => {
  return (
    <Grid.Root
      className={cn(classNames.orderCollectibleInfo, 'gap-x-4 gap-y-1')}
      template={`
        [row1-start] "img name remove-btn" [row1-end]
        [row2-start] "img tokenid tokenid" 20px [row2-end]
        [row2-start] "img each-price each-price" 30px [row2-end]
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
        <Text as="span" className="text-xs text-foreground/50">
          #{item.collectibleMetadata.tokenId}
        </Text>
      </Grid.Child>

      <Grid.Child
        id="remove-btn"
        onClick={() => removeFromCart(item)}
        className="cursor-pointer text-foreground/30 hover:text-foreground/50"
      >
        <CloseIcon />
      </Grid.Child>

      <Grid.Child name="name">
        <Text
          className="text-sm uppercase max-lines-[2]"
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
  const { getMaxQuantity } = useOrderItemMaxQuantity({
    chainId: item.chainId,
    itemType: item.itemType,
    collectionAddress: item.collectibleMetadata.collectionAddress,
    exchangeAddress: item.exchangeAddress || undefined,
    tokenId: item.collectibleMetadata.tokenId,
  });

  return (
    <Flex className="max-w-full items-center gap-3">
      <QuantityInput
        item={item}
        onChange={editQuantity}
        maxQuantity={getMaxQuantity}
        readonly
      />

      <CartItemEditQuantityModal item={item} />
    </Flex>
  );
};
