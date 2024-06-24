import React from 'react';

import { Box, Flex, Text } from '$ui';
import type { OrderbookModalType } from '.';

interface MatchingOrderInfo {
  type: OrderbookModalType;
  fillableAmount?: bigint;
  unfillableAmount?: bigint;
  tokenDecimal: number;
}

export const MatchingOrderInfo = ({
  type,
  fillableAmount,
  unfillableAmount,
  tokenDecimal,
}: MatchingOrderInfo) => {
  if (fillableAmount === undefined || unfillableAmount === undefined) {
    return null;
  }

  // const fillableFormatted = formatUnits(fillableAmount, tokenDecimal)
  // const unfillableFormatted = formatUnits(unfillableAmount, tokenDecimal)

  const orderType = type === 'listing' ? 'listing' : 'offer';

  if (unfillableAmount > 0n) {
    return null;
  }

  return (
    <Flex className="w-full flex-col gap-2">
      <Box className="w-full rounded-xl bg-success/20 p-5">
        <Text className="text-sm text-success">
          This {orderType} will be instantly fulfilled
        </Text>
      </Box>
    </Flex>
  );
};
