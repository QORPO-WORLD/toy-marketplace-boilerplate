import { OrderItemType } from '~/api';
import {
  cartState,
  settingsState,
  updateCartItemSubtotals,
} from '~/lib/stores';
import { getFrontEndFeeAmount } from '~/sdk/niftyswap-v2';

import { useOrderSummary } from '../data';
import { useSnapshot } from 'valtio';

interface Props {
  feesOnTop: {
    feePercentage: number;
    feeRecipient: string;
  };
}

export const useOrderSummaryData = ({ feesOnTop }: Props) => {
  const {
    baseOrderInfo: { chainId, exchangeAddress, orderType },
    orderData,
  } = useSnapshot(cartState);
  const { slippageTolerancePercent } = useSnapshot(settingsState);

  const {
    data: orderSummaryResponse,
    isLoading,
    isError,
    error,
  } = useOrderSummary({
    chainId: chainId,
    niftyswapExchangeAddress: exchangeAddress,
    orderType: orderType,
    tokenIds: orderData.tokenIds || [],
    tokenAmounts: orderData?.tokenAmounts || [],
    slippagePercentage: slippageTolerancePercent,
  });

  const data = orderSummaryResponse?.data;

  const orderSubtotal = data?.orderSubtotal;
  const estimatedTotal = data?.estimatedTotal;
  const itemSubtotals = data?.itemSubtotals;

  const totalLpFee = data?.totalLpFee;
  const totalRoyaltyFee = data?.totalRoyaltyFee;

  const lpFeePercentage = data?.lpFeePercentage;
  const royaltyFeePercentage = data?.royaltyFeePercentage;

  const slippagePercentage = data?.slippagePercentage;
  const slippageAmount = data?.slippageAmount;

  const frontEndFeePercentage = feesOnTop.feePercentage;
  const frontEndFeeRecipient = feesOnTop.feeRecipient;
  const totalFrontEndFee = orderSubtotal
    ? getFrontEndFeeAmount(orderSubtotal, feesOnTop.feePercentage)
    : 0n;

  let totalWithSlippage = data?.totalWithSlippage;

  if (totalWithSlippage) {
    switch (orderType) {
      case OrderItemType.BUY_AMM:
        totalWithSlippage += totalFrontEndFee;
        break;
      case OrderItemType.SELL_AMM:
      default:
        totalWithSlippage -= totalFrontEndFee;
    }
  }

  if (
    itemSubtotals &&
    // make sure debounced value matches state value before updating subtotal state *
    orderData.tokenIds.length === orderData?.tokenIds.length
  ) {
    updateCartItemSubtotals(itemSubtotals.map(BigInt));
  }

  // reset subtotals if there is an error
  if (isError) {
    updateCartItemSubtotals(orderData.tokenIds.map((_) => 0n));
  }

  return {
    isOrderSummaryLoading: isLoading,
    itemSubtotals,
    orderSubtotal,
    estimatedTotal,
    totalLpFee,
    lpFeePercentage,
    totalRoyaltyFee,
    royaltyFeePercentage,
    frontEndFeePercentage,
    totalFrontEndFee,
    frontEndFeeRecipient,
    slippagePercentage,
    slippageAmount,
    totalWithSlippage,
    isError,
    error,
  };
};
