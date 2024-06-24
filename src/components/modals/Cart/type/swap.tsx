'use client';

import { CurrencyAvatar } from '~/components/Avatars';
import { getPlatformFeeRecipient } from '~/config';
import { useOrderSummaryData } from '~/hooks/cart/useOrderSummaryData';
import { useExchange } from '~/hooks/data';
import { cartState } from '~/lib/stores';
import { getMarketplaceFeePercentage } from '~/lib/stores/marketConfig';
import { formatDecimals, formatDisplay } from '~/utils/helpers';

import {
  Accordion,
  Avatar,
  Flex,
  InformationIcon,
  Text,
  Tooltip,
  toast,
} from '$ui';
import { OrderButtons } from '../components/actions/OrderButtons';
import { SwapOrderItem } from '../components/items/SwapOrderItem';
import { OrderSections } from './shared';
import { useSnapshot } from 'valtio';

export const SwapOrderComponents = () => {
  const {
    cartItems,
    baseOrderInfo: { collectionAddress, exchangeAddress, chainId },
  } = useSnapshot(cartState);

  const { data: exchangeResp } = useExchange({
    chainId,
    exchangeAddress,
  });

  const exchange = exchangeResp?.data;

  const marketplaceFeePercentage =
    getMarketplaceFeePercentage(collectionAddress);

  const {
    orderSubtotal,
    estimatedTotal,
    totalLpFee,
    totalRoyaltyFee,
    lpFeePercentage,
    royaltyFeePercentage,
    isOrderSummaryLoading,
    frontEndFeePercentage,
    totalFrontEndFee,
    frontEndFeeRecipient,
    slippagePercentage,
    slippageAmount,
    totalWithSlippage,
    isError,
  } = useOrderSummaryData({
    feesOnTop: {
      feePercentage: marketplaceFeePercentage,
      feeRecipient: getPlatformFeeRecipient(chainId || ''),
    },
  });

  if (isError) {
    toast.error('Order summary estimation failed', {
      toastId: `order-data-error`,
      position: 'bottom-right',
    });
  }

  const formattedOrderSubtotal = orderSubtotal
    ? formatDecimals(orderSubtotal, exchange?.currency.decimals)
    : '0';

  const formattedEstimatedTotal = estimatedTotal
    ? formatDecimals(estimatedTotal, exchange?.currency.decimals)
    : '0';

  const formattedTotalLpFee = totalLpFee
    ? formatDecimals(totalLpFee, exchange?.currency.decimals)
    : '0';

  const formattedTotalFrontEndFee = totalFrontEndFee
    ? formatDecimals(totalFrontEndFee, exchange?.currency.decimals)
    : '0';

  const formattedTotalRoyaltyFee = totalRoyaltyFee
    ? formatDecimals(totalRoyaltyFee, exchange?.currency.decimals)
    : '0';

  const formattedSlippageAmount = slippageAmount
    ? formatDecimals(slippageAmount, exchange?.currency.decimals)
    : '0';

  const formattedTotalWithSlippage = totalWithSlippage
    ? formatDecimals(totalWithSlippage, exchange?.currency.decimals)
    : '0';

  return (
    <>
      <OrderSections.Items>
        {cartItems.map((item, i) => (
          <SwapOrderItem
            key={i}
            item={item}
            isLoading={isOrderSummaryLoading}
          />
        ))}
      </OrderSections.Items>

      <OrderSections.Summary>
        {/* <Flex className="justify-between items-center">
          <Text className="text-sm text-foreground/70">Subtotal</Text>
  
          <CurrencyAvatar
            title={formattedOrderSubtotal}
            amount={orderSubtotal ? formatDisplay(formattedOrderSubtotal) : '-'}
            currency={{
              src: exchange?.currency.iconUrl,
              symbol: exchange?.currency.symbol
            }}
          />
        </Flex> */}

        <Flex className="items-center justify-end gap-2">
          <Avatar.Base className="h-10 w-10">
            <Avatar.Image src={exchange?.currency.iconUrl} />
            <Avatar.Fallback>{exchange?.currency.symbol}</Avatar.Fallback>
          </Avatar.Base>

          <Text className="break-words break-all text-2xl font-bold text-foreground">
            {estimatedTotal ? formatDisplay(formattedTotalWithSlippage) : '-'}{' '}
            {exchange?.currency.symbol}
          </Text>
        </Flex>

        {/* <CurrencyAvatar
          title={formattedTotalWithSlippage}
          amount={
            estimatedTotal ? formatDisplay(formattedTotalWithSlippage) : '-'
          }
          currency={{
            src: exchange?.currency.iconUrl,
            symbol: exchange?.currency.symbol
          }}
        /> */}

        <Accordion.Root
          type="multiple"
          // variant="secondary"
          className="w-full"
        >
          <Accordion.Item
            value="cart-fee-info"
            className="bg-transparent p-2 focus-within:ring-0"
          >
            <Accordion.Trigger className="justify-end p-0 text-sm font-medium text-foreground/50">
              Estimated Total
              {/* <Flex className="justify-between items-center w-full"> */}
              {/* <Flex className="justify-between gap-3"> */}
              {/* <Accordion.Chevron /> */}
              {/* </Flex> */}
              {/* <CurrencyAvatar
                  title={formattedTotalWithSlippage}
                  amount={
                    estimatedTotal
                      ? formatDisplay(formattedTotalWithSlippage)
                      : '-'
                  }
                  currency={{
                    src: exchange?.currency.iconUrl,
                    symbol: exchange?.currency.symbol
                  }}
                /> */}
              {/* </Flex> */}
            </Accordion.Trigger>

            <Accordion.Content className="overflow-x-auto overflow-y-hidden">
              <Flex className="flex-col gap-2">
                <Flex className="flex-wrap items-center justify-between">
                  <Text className="text-sm font-semibold text-foreground/70">
                    Subtotal
                  </Text>

                  <CurrencyAvatar
                    size="sm"
                    title={formattedOrderSubtotal}
                    amount={
                      orderSubtotal
                        ? formatDisplay(formattedOrderSubtotal)
                        : '-'
                    }
                    currency={{
                      src: exchange?.currency.iconUrl,
                      symbol: exchange?.currency.symbol,
                    }}
                  />
                </Flex>

                <Flex className="flex-wrap items-center justify-between">
                  <Text className="text-sm text-foreground/70">
                    LP Fee ({lpFeePercentage}%)
                  </Text>

                  <CurrencyAvatar
                    size="sm"
                    title={formattedTotalLpFee}
                    amount={
                      totalLpFee ? formatDisplay(formattedTotalLpFee) : '-'
                    }
                    currency={{
                      src: exchange?.currency.iconUrl,
                      symbol: exchange?.currency.symbol,
                    }}
                  />
                </Flex>

                <Flex className="flex-wrap items-center justify-between">
                  <Text className="text-sm text-foreground/70">
                    Royalty Fee ({royaltyFeePercentage}%)
                  </Text>

                  <CurrencyAvatar
                    size="sm"
                    title={formattedTotalRoyaltyFee}
                    amount={
                      totalRoyaltyFee
                        ? formatDisplay(formattedTotalRoyaltyFee)
                        : '-'
                    }
                    currency={{
                      src: exchange?.currency.iconUrl,
                      symbol: exchange?.currency.symbol,
                    }}
                  />
                </Flex>

                <Flex className="flex-wrap items-center justify-between">
                  <Text className="text-sm text-foreground/70">
                    Platform Fee ({frontEndFeePercentage}%)
                  </Text>

                  <CurrencyAvatar
                    size="sm"
                    title={formattedTotalFrontEndFee}
                    amount={
                      totalFrontEndFee
                        ? formatDisplay(formattedTotalFrontEndFee)
                        : '-'
                    }
                    currency={{
                      src: exchange?.currency.iconUrl,
                      symbol: exchange?.currency.symbol,
                    }}
                  />
                </Flex>

                <Flex className="flex-wrap items-center justify-between">
                  <Flex className="flex-row gap-1">
                    <Text className="text-sm text-foreground/30">
                      Slippage ({slippagePercentage}%)
                    </Text>

                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <InformationIcon className="h-4 w-4 text-sm text-foreground/30" />
                      </Tooltip.Trigger>

                      <Tooltip.Content>
                        Unused amount is refunded, configurable in wallet
                        settings.
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Flex>

                  <CurrencyAvatar
                    size="sm"
                    title={formattedSlippageAmount}
                    amount={
                      estimatedTotal
                        ? formatDisplay(formattedSlippageAmount)
                        : '-'
                    }
                    currency={{
                      src: exchange?.currency.iconUrl,
                      symbol: exchange?.currency.symbol,
                    }}
                  />
                </Flex>
              </Flex>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </OrderSections.Summary>

      <OrderSections.Buttons>
        <OrderButtons
          erc20Amount={totalWithSlippage}
          platformFee={totalFrontEndFee}
          isLoading={isOrderSummaryLoading}
          frontEndFeeRecipient={frontEndFeeRecipient}
        />
      </OrderSections.Buttons>
    </>
  );
};
