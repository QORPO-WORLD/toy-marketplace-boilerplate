import { BigIntMin, compareAddress } from '~/lib/utils/helpers';

import { useOrderbookIsValid } from './useOrderbookIsValid';
import { type OrderbookOrder } from '@0xsequence/indexer';
import { formatUnits } from 'viem';

interface Props {
  selectedTokenAmountRaw: bigint;
  selectedPerTokenPriceRaw: bigint;
  selectedCurrencyAddress: string;
  tokenDecimal: number;
  chainId: number;
  bestOrder?: OrderbookOrder;
}

export const useOrderbookOrderMatch = ({
  bestOrder,
  tokenDecimal,
  selectedTokenAmountRaw,
  selectedPerTokenPriceRaw,
  selectedCurrencyAddress,
  chainId,
}: Props): {
  matched: boolean;
  fillableTokenAmountRaw?: bigint;
  unfillableTokenAmountRaw?: bigint;
} => {
  const { data } = useOrderbookIsValid({
    requestId: BigInt(bestOrder?.orderId || 0),
    quantity: selectedTokenAmountRaw,
    chainId,
  });

  if (!bestOrder || selectedTokenAmountRaw <= 0n || data?.isValid !== true) {
    return {
      matched: false,
    };
  }

  if (
    compareAddress(bestOrder.currencyAddress, selectedCurrencyAddress) &&
    bestOrder.pricePerToken === selectedPerTokenPriceRaw.toString()
  ) {
    const fillable = BigIntMin(
      selectedTokenAmountRaw,
      BigInt(bestOrder.quantityRemaining),
    );

    const fillableFormatted = formatUnits(fillable, tokenDecimal);

    const unfillable = selectedTokenAmountRaw - fillable;

    const unfillableFormatted = formatUnits(unfillable, tokenDecimal);

    // const selectedTokenAmountFormatted = formatUnits(
    //   selectedTokenAmountRaw,
    //   tokenDecimal
    // )

    return {
      matched: true,
      fillableTokenAmountRaw: fillable,
      unfillableTokenAmountRaw: unfillable,
    };
  }

  return {
    matched: false,
  };
};
