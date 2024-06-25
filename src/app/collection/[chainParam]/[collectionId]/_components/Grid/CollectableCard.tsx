'use client';

import type { ComponentProps } from 'react';
import { memo } from 'react';

import { classNames } from '~/config/classNames';
import { useCartItem } from '~/hooks/cart/useCartItem';
import { textClassName, truncateAtMiddle } from '~/utils/helpers';

import { Avatar, Badge, Flex, Image, Text, cn, Box } from '$ui';
import type { AddToCartButtonProps } from '../../../../../../components/buttons/AddToCartButton';
import { AddToCartButton } from '../../../../../../components/buttons/AddToCartButton';
import type { TokenBalance } from '@0xsequence/indexer';
import NextLink from 'next/link';
import type { UrlObject } from 'url';

export type CollectibleCardData = CardProps | undefined | null;
export type CardProps = {
  loading?: boolean;
  tokenId: string;
  link: string | UrlObject;
  name?: string;
  image: string;
  price?: {
    loading?: boolean;
    symbolUrl?: string;
    value: string | number;
    title?: number | string;
    className?: string;
  };
  className?: string;
  userData?: Pick<TokenBalance, 'balance'>;
  priceData?: CollectiblePriceData;
  addToCartButtonProps?: AddToCartButtonProps;
  badges?: Badge[];
};

export type Badge = {
  label: string;
  value?: string;
  variant?: ComponentProps<typeof Badge>['variant'];
  title?: string | number;
  loading?: boolean;
};

export const CollectibleCard = ({ data }: { data: CollectibleCardData }) => {
  if (!data) {
    return (
      <Card
        loading
        image=""
        link=""
        tokenId="-"
        name="-"
        price={{ symbolUrl: '', value: '' }}
        badges={[
          {
            loading: true,
            label: '',
            value: '',
            variant: 'muted',
          },
        ]}
      />
    );
  }
  return <Card {...data} key={data.tokenId} />;
};

const Card = memo(
  ({
    tokenId,
    link,
    loading,
    name,
    image,
    price,
    badges,
    addToCartButtonProps,
  }: CardProps) => {
    const addToCartData = addToCartButtonProps?.addToCartData;
    const { cartItem } = useCartItem(addToCartData);

    return (
      <article
        className={cn(
          classNames.collectibleSelectionIndicator,
          `relative flex h-full w-full flex-col align-top`,
          'rounded-md bg-foreground/5 outline outline-2 outline-transparent',
          !!cartItem
            ? `${getOrderTypeOutlineColor(addToCartData?.item.itemType)}`
            : '',
          'z-10 overflow-hidden !outline transition-all',
        )}
      >
        <NextLink href={link} className="peer h-full p-2">
          <Image.Base
            src={image}
            containerClassName="bg-foreground/10 aspect-square rounded-sm"
            className="aspect-square rounded-[inherit]"
            loading={loading}
          />
          <Footer
            tokenId={tokenId}
            name={name}
            loading={loading}
            price={price}
            badges={badges}
          />
        </NextLink>
        {addToCartButtonProps && (
          <AddToCartButton
            className={cn(
              'bottom-0 m-0 w-full !rounded-none ease-in-out hover:visible peer-hover:visible',
              '[@media(hover:hover)]:invisible [@media(hover:hover)]:absolute',
            )}
            {...addToCartButtonProps}
          />
        )}
      </article>
    );
  },
);

const Footer = ({
  tokenId,
  name,
  loading,
  price,
  badges,
}: {
  tokenId: CardProps['tokenId'];
  name: CardProps['name'];
  loading: CardProps['loading'];
  price: CardProps['price'];
  badges: CardProps['badges'];
}) => {
  const hasName = loading ? true : !!name;
  const hasUnitPrice = !!price?.value && !loading;

  const height = 'h-[24px]';
  return (
    <>
      <Text
        className={cn(
          height,
          'md:text-md text-left text-xs font-medium text-foreground/50 max-lines-[1]',
        )}
      >
        #{truncateAtMiddle(tokenId, 10) || '--'}
      </Text>

      <Text
        className={cn(
          height,
          'md:text-md ellipsis block text-left font-semibold text-foreground',
          textClassName(!hasName),
        )}
        loading={loading}
        title={name}
      >
        {name || '<unknown>'}
      </Text>

      {price && (
        <Flex
          className={cn(height, 'flex-1 items-center gap-2', price.className)}
        >
          <Avatar.Base size="xs">
            <Avatar.Image src={price.symbolUrl} />
            <Avatar.Fallback>{price.title}</Avatar.Fallback>
          </Avatar.Base>

          <Text
            className={cn(
              'ellipsis text-sm md:text-base',
              textClassName(!hasUnitPrice),
            )}
            loading={price.loading}
            title={String(price.title)}
          >
            {price.value || 'N/A'}
          </Text>
        </Flex>
      )}

      <Box className="h-7 w-full">
        <Flex
          className={cn(
            'no-scrollbar relative mt-2 flex-1 gap-2 overflow-y-scroll md:mt-0',
          )}
        >
          {badges?.map((b, i) => (
            <Badge
              key={i}
              loading={b?.loading}
              variant={b.variant}
              title={
                b.title
                  ? b?.loading
                    ? 'loading..'
                    : String(b?.title)
                  : undefined
              }
            >
              {b.value ? (
                <>
                  {b.label}: <span className="ml-1">{b.value}</span>
                </>
              ) : (
                <>{b.label}</>
              )}
            </Badge>
          ))}
        </Flex>
      </Box>
    </>
  );
};

export const getOrderTypeOutlineColor = (type?: OrderItemType) => {
  switch (type) {
    case OrderItemType.TRANSFER: {
      return '!outline-pink';
    }
    default:
      return '!outline-foreground/50';
  }
};

CollectibleCard.displayName = 'CollectibleCard';
