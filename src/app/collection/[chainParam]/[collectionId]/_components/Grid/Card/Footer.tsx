import { Avatar, Badge, Flex, Text, cn } from '~/components/ui';
import { currencyQueries } from '~/lib/queries';
import {
  type Order,
  type CollectibleOrder,
} from '~/lib/queries/marketplace/marketplace.gen';
import {
  formatDecimals,
  formatDisplay,
  textClassName,
  truncateAtMiddle,
} from '~/lib/utils/helpers';

import { useQuery } from '@tanstack/react-query';

export const Footer = ({ metadata, order }: CollectibleOrder) => {
  const { tokenId, name } = metadata;

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
          textClassName(!!name),
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
  order: Order;
};

const Order = ({ height, order }: OrderProps) => {
  const { data: currencies } = useQuery(
    currencyQueries.list({
      chainId: order.chainId,
    }),
  );
  const currency = currencies?.currencies.find(
    (c) => c.contractAddress === order.priceCurrencyAddress,
  );

  const price = currency
    ? formatDisplay(formatDecimals(order.priceAmountNet, currency.decimals))
    : null;

  return (
    <Flex className={cn(height, 'flex-1 items-center justify-between')}>
      <Flex className="items-center gap-2">
        <Avatar.Base size="xs">
          <Avatar.Image src={currency?.imageUrl} />
          <Avatar.Fallback>{currency?.name}</Avatar.Fallback>
        </Avatar.Base>
        <Text
          className="ellipsis text-sm md:text-base"
          title={String(currency?.name)}
        >
          {price || 'N/A'}
        </Text>
      </Flex>
      <Badge variant="success">
        Stock: <span className="ml-1">{order.quantityRemaining}</span>
      </Badge>
    </Flex>
  );
};
