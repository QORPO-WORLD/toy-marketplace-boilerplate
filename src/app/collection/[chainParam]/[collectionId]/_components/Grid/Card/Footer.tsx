import { Flex, Text, cn } from '~/components/ui';

import { setMarketPlaceLogo } from '../../../../../../../lib/utils/helpers';
import { type Order as OrderType } from '@0xsequence/marketplace-sdk';
import { useCurrencies } from '@0xsequence/marketplace-sdk/react';
import { TokenMetadata } from '@0xsequence/metadata';
import Image from 'next/image';

type FooterProps = {
  tokenMetadata: TokenMetadata;
  order?: OrderType;
};

export const Footer = ({ tokenMetadata, order }: FooterProps) => {
  const { name } = tokenMetadata;

  const height = 'h-[1.5rem]';
  return (
    <>
      {/* <Text
        className={cn(
          height,
          'md:text-md text-left text-xl font-main uppercase text-[#483F50] max-lines-[1]',
        )}
      >
        #{truncateMiddle(tokenId, 10) || '--'}
      </Text> */}

      <Text
        className={cn(
          height,
          'md:text-md text-left text-xl font-main uppercase text-[#483F50] max-lines-[1] truncate mb:text-[24px] mb:mb-3',
        )}
        title={name}
      >
        {name || '<unknown>'}
      </Text>

      {order && <Order height={height} order={order} />}
    </>
  );
};

type OrderProps = {
  height: string;
  order: OrderType;
};

const Order = ({ height, order }: OrderProps) => {
  const { data: currencies } = useCurrencies({
    chainId: order.chainId,
  });

  const currency = currencies?.find(
    (c) => c.contractAddress === order.priceCurrencyAddress,
  );

  return (
    <Flex
      className={cn(height, 'flex-1 items-end justify-between gap-[0.4rem]')}
    >
      {/* <Flex className="items-center gap-2">
        <Avatar.Base size="xs">
          <Avatar.Image src={currency?.imageUrl} />
          <Avatar.Fallback>{currency?.name}</Avatar.Fallback>
        </Avatar.Base>
        <Text
          className="ellipsis text-sm md:text-base"
          title={String(currency?.name)}
        >
          {order.priceAmountFormatted || 'N/A'} {currency?.symbol}
        </Text>
      </Flex>
      <Badge variant="success">
        Stock: <span className="ml-1">{order.quantityRemainingFormatted}</span>
      </Badge> */}
      <img
        className="w-[1.375rem] aspect-square mb:w-[25px]"
        src={getCurrencyLogoByChainId(order.chainId)}
        alt="logo"
      />
      <p className="text-[#483F50] mr-auto font-DMSans text-[1.25rem] font-normal leading-[1.08675rem] uppercase mb:text-[24px]">
        {Number(order.priceAmountFormatted) <= 0.00001
          ? '0.00001'
          : Number(order.priceAmountFormatted).toFixed(3)}{' '}
        ${currency?.symbol}
      </p>
      {order.marketplace && setMarketPlaceLogo(order.marketplace) && (
        <Image
          className="w-[1.375rem] aspect-square mb:w-[25px]"
          src={setMarketPlaceLogo(
            order.marketplace,
            order.collectionContractAddress,
          )}
          width={22}
          height={22}
          alt={order.marketplace}
        />
      )}
    </Flex>
  );
};
