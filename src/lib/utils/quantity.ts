import { OrderItemType } from '~/lib/stores/cart/types';

import { BigIntMin } from './helpers';
import { parseUnits } from 'viem';

interface GetQuantityProps {
  type: OrderItemType;
  tokenDecimals?: number;
  tokenUserBalance?: bigint;
  tokenAvailableAmount?: bigint;
}

export const defaultSelectionQuantity = ({
  type,
  tokenDecimals: collectibleDecimals,
  tokenUserBalance: userBalance,
  tokenAvailableAmount: availableTokenAmount,
}: GetQuantityProps) => {
  const defaultQuantity = parseUnits('1', collectibleDecimals ?? 0);
  let value = defaultQuantity;

  switch (type) {
    case OrderItemType.BUY:
      value = availableTokenAmount
        ? BigIntMin(availableTokenAmount, defaultQuantity)
        : defaultQuantity;
      break;
    case OrderItemType.SELL:
      value = availableTokenAmount
        ? BigIntMin(availableTokenAmount, defaultQuantity)
        : defaultQuantity;
      break;
    case OrderItemType.TRANSFER:
      value = userBalance
        ? BigIntMin(userBalance, defaultQuantity)
        : defaultQuantity;
      break;
    default:
      break;
  }

  return value;
};
