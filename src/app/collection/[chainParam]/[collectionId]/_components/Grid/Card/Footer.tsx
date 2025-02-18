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
    <Flex className={cn(height, 'flex-1 items-center justify-between')}>
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
      <p className="text-[#483F50] text-center font-DMSans text-[1.25rem] font-normal leading-[1.08675rem] uppercase mb:text-[24px]">
        {order.priceAmountFormatted} ${currency?.symbol}
      </p>
      {order.marketplace && setMarketPlaceLogo(order.marketplace) && (
        <Image
          className="w-[1.375rem] aspect-square mb:w-[25px]"
          src={setMarketPlaceLogo(order.marketplace)}
          width={22}
          height={22}
          alt={order.marketplace}
        />
      )}
    </Flex>
  );
};
