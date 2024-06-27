import type { Currency } from '~/lib/queries/marketplace/marketplace.gen';

import { Avatar, Badge, Box, Flex, Text } from '$ui';
import type { OrderbookModalType } from '.';
import type { OrderbookOrder } from '@0xsequence/indexer';
import type { TokenMetadata } from '@0xsequence/metadata';
import { formatUnits } from 'viem';

interface Props {
  type: OrderbookModalType;
  bestOrder?: OrderbookOrder;
  tokenMetadata: TokenMetadata;
  currency: Currency;
}

export const BestOrder = ({
  bestOrder,
  type,
  tokenMetadata,
  currency,
}: Props) => {
  if (!bestOrder) return null;

  const MatchedOrderType = type === 'listing' ? 'Offer' : 'Listing';

  const availableQuantity = formatUnits(
    BigInt(bestOrder.quantityRemaining || 0),
    tokenMetadata.decimals || 0,
  );

  const oneUnit = 10 ** (tokenMetadata.decimals || 0);
  const unitPriceRaw = BigInt(oneUnit) * BigInt(bestOrder.pricePerToken);

  const unitPrice = formatUnits(BigInt(unitPriceRaw), currency.decimals || 0);

  return (
    <Box className="w-full rounded-xl bg-foreground/10 p-5">
      <Flex className="w-full flex-row items-center justify-between gap-2">
        <Text className="text-xs font-semibold text-foreground/50">
          Best {MatchedOrderType}
        </Text>
        <Flex className="flex-row gap-3">
          <Flex className="items-center justify-end gap-2">
            <Avatar.Base className="h-5 w-5">
              <Avatar.Image src={currency.imageUrl} />
              <Avatar.Fallback>{currency.symbol}</Avatar.Fallback>
            </Avatar.Base>

            <Text className="text-md break-words break-all font-bold text-foreground">
              {unitPrice} {currency.symbol}
            </Text>
          </Flex>
          <Badge className="h-6 rounded-sm" variant="success">
            <Flex className="items-center gap-2">
              <Text className="text-xs font-semibold text-foreground/50">
                Stock:{' '}
                <Text as="span" className="text-xs text-foreground/100">
                  {availableQuantity}
                </Text>
              </Text>
            </Flex>
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );
};
