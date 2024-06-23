import { memo } from 'react';

import { classNames } from '~/config/classNames';
import { truncateAtMiddle } from '~/utils/helpers';

import { NetworkIcon } from './NetworkLabel';
import NextLink from 'next/link';
import { Avatar, Flex, Image, Text, cn } from 'system';

/* ************* CURRENCY AVATAR ***************** */
type CurrencyAvatarProps = {
  amount: number | string;
  currency: { src: string | undefined; symbol: string | undefined };
  title?: string | number;

  className?: string;
  justify?: 'justify-center' | 'justify-start' | 'justify-end';

  size?: 'default' | 'sm' | 'lg';

  loading?: boolean;
};

export const CurrencyAvatar = ({
  amount,
  currency,
  title,
  justify,
  className,
  size = 'default',
  loading = false,
}: CurrencyAvatarProps) => {
  return (
    <Flex
      className={cn(
        classNames.currencyAvatar,
        'text-foreground/80 items-center gap-2',
        justify,
        className,
      )}
    >
      <Avatar.Base size={size} className={`${loading ? 'loading' : ''}`}>
        <Avatar.Image src={currency.src} alt={currency.symbol} />
        <Avatar.Fallback>{currency.symbol?.slice(0, 2)}</Avatar.Fallback>
      </Avatar.Base>
      <Text
        className={cn(
          'text-sm font-medium text-inherit',
          loading ? 'loading' : '',
        )}
        // size={size}
        title={title ? (loading ? 'loading..' : String(title)) : undefined}
      >
        {amount} {currency.symbol}
      </Text>
    </Flex>
  );
};

/* ************* CURRENCY PAIR ***************** */
type CurrencyPairAvatarProps = {
  assetAmount: number | string;
  assetCurrency: { src: string; symbol: string };

  tokenAmount: number | string;
  tokenCurrency: { src: string; symbol: string };

  justify?: 'justify-center' | 'justify-start' | 'justify-end';
  className?: string;
};

export const CurrencyPairAvatar = ({
  assetAmount,
  assetCurrency,
  tokenAmount,
  tokenCurrency,
  justify,
  className,
}: CurrencyPairAvatarProps) => {
  return (
    <Flex
      className={cn(classNames.currencyPairAvatar, 'flex-col gap-2', className)}
    >
      <CurrencyAvatar
        amount={assetAmount}
        currency={assetCurrency}
        justify={justify}
      />
      <CurrencyAvatar
        amount={tokenAmount}
        currency={tokenCurrency}
        justify={justify}
      />
    </Flex>
  );
};

/* ************* COLLECTION AVATAR ***************** */
type CollectionAvatarProps = {
  name: string;
  src: string;
  chainId?: number;

  justify?: 'justify-center' | 'justify-start' | 'justify-end';
};

export const CollectionAvatar = ({
  name,
  src,
  chainId,
  justify = 'justify-start',
}: CollectionAvatarProps) => {
  return (
    <Flex
      className={cn(classNames.collectionAvatar, 'items-center gap-2', justify)}
    >
      <Avatar.Base>
        <Avatar.Image src={src} />
      </Avatar.Base>

      <Text className="text-foreground/90 font-medium">{name}</Text>
      {chainId ? <NetworkIcon size="sm" chainId={chainId} /> : null}
    </Flex>
  );
};

/* ************* POOL AVATAR ***************** */
type PoolAvatarProps = {
  name: string;
  src: string;
  tokenId?: number | string;
  chainId?: number;

  link?: string | object;

  nameClassName?: string;
  imageClassName?: string;

  loading?: boolean;
  justify?: 'justify-center' | 'justify-start' | 'justify-end';
};

export const PoolAvatar = memo(
  ({
    name,
    src,
    tokenId,
    chainId,
    nameClassName,
    imageClassName,
    loading = false,
    justify = 'justify-center',
    link,
  }: PoolAvatarProps) => {
    const hasName = name && !loading;

    const Content = () => (
      <>
        <Image.Base
          src={src}
          className={cn('h-[40px] w-[30px] min-w-[30px]', imageClassName)}
          loading={loading}
        />

        <Flex className="h-full flex-col justify-center">
          <Flex className="items-center gap-2">
            <Text
              className={cn(
                !hasName
                  ? 'text-foreground/30 font-light italic'
                  : 'text-foreground/90 font-medium',
                'max-lines-[1]',
                link
                  ? 'hover:text-foreground/80 hover:underline hover:underline-offset-2'
                  : '',
                nameClassName,
              )}
              loading={loading}
              title={name}
            >
              {name || '<unknown>'}
            </Text>

            {chainId ? (
              <Flex className="min-w-[20px]">
                <NetworkIcon chainId={chainId} loading={loading} />
              </Flex>
            ) : null}
          </Flex>

          {tokenId ? (
            <Text
              className={cn('text-foreground/40 text-left')}
              as="span"
              loading={loading}
              title={`${tokenId}`}
            >
              #{truncateAtMiddle(`${tokenId}`, 10)}
            </Text>
          ) : null}
        </Flex>
      </>
    );

    return (
      <Flex
        // {...linkProps}
        asChild={!!link}
        className={cn(
          classNames.poolAvatar,
          'w-fit justify-center gap-3',
          justify,
        )}
      >
        {!!link ? (
          <NextLink href={link as string}>
            <Content />
          </NextLink>
        ) : (
          <Content />
        )}
      </Flex>
    );
  },
);

PoolAvatar.displayName = 'PoolAvatar';
