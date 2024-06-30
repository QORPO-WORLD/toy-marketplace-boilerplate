import { Avatar, Badge, Flex, Text, cn } from '~/components/ui';
import { marketplaceQueries } from '~/lib/queries';
import { type CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { textClassName, truncateAtMiddle } from '~/lib/utils/helpers';

import { useQuery } from '@tanstack/react-query';

export const Footer = (params: CollectibleOrder) => {
  const { tokenId, name } = params.metadata;
  const order = params.order;

  const { data: currencies } = useQuery(
    marketplaceQueries.currencies({
      chainId: params.order?.chainId!, //TODO:
    }),
  );

  const getCurrency = (address: string) => {
    return currencies?.currencies.find((c) => c.contractAddress === address);
  };

  const currency = getCurrency(order?.priceCurrencyAddress!);

  // TODO

  const price = order?.priceAmountNet / 10 ** currency?.decimals;

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

      {order && (
        <Flex className={cn(height, 'flex-1 items-center justify-between')}>
          <Flex className="items-center gap-2">
            <Avatar.Base size="xs">
              <Avatar.Image src={currency?.imageUrl} />
              <Avatar.Fallback>{currency?.name}</Avatar.Fallback>
            </Avatar.Base>
            <Text
              className={cn(
                'ellipsis text-sm md:text-base',
                textClassName(!order.priceAmountFormatted),
              )}
              title={String(currency?.name)}
            >
              {price || 'N/A'}
            </Text>
          </Flex>
          <Badge variant="success">
            Stock: <span className="ml-1">{order.quantityRemaining}</span>
          </Badge>
        </Flex>
      )}
    </>
  );
};
