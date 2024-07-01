'use client';

import { useEffect } from 'react';

import { CurrencyAvatar } from '~/components/Avatars';
import { DEFAULT_PLATFORM_FEE_PERCENTAGE } from '~/config/consts';
import { useOrderbookIsValid } from '~/hooks/orderbook/useOrderbookIsValid';
import { useOrderbookIsValidBatch } from '~/hooks/orderbook/useOrderbookIsValidBatch';
import { useOrderbookOrders } from '~/hooks/orderbook/useOrderbookOrders';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import { getFrontEndFeeAmount, getPlatformFeeRecipient } from '~/lib/fees';
import { collectionQueries } from '~/lib/queries';
import { cartState, updateCartItemSubtotals } from '~/lib/stores/cart/Cart';
import type { CartItem } from '~/lib/stores/cart/types';

import { Accordion, Avatar, Flex, InformationIcon, Text, Tooltip } from '$ui';
import { OrderbookOrderButtons } from '../components/actions/OrderbookOrderButtons';
import { OrderbookOrderItem } from '../components/items/OrderbookOrderItem';
import { OrderSections } from './shared';
import { formatDisplay } from '@0xsequence/kit';
import { useQuery } from '@tanstack/react-query';
import { useSnapshot } from 'valtio';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

export const OrderbookOrderComponents = () => {
  const { address: accountAddress, isConnected, connector } = useAccount();
  const {
    cartItems = [],
    baseOrderInfo: { orderType },
  } = useSnapshot(cartState);
  const chainId = cartItems[0]?.chainId!;

  const { orders } = useOrderbookOrders({
    chainId: chainId,
    orderIds: cartItems.map((item) => item.orderId!),
  });

  const hasMultipleCurrencies =
    new Set(orders.map((o) => o.currency?.toLowerCase())).size > 1;

  const defaultOrder = orders[0];
  const defaultCurrency = defaultOrder?.currency || '';

  const {
    data: isOrderValidBatchData,
    isLoading: isLoadingOrderBatchValidity,
  } = useOrderbookIsValidBatch({
    chainId: chainId,
    requestIds: orders.map((o) => BigInt(o.orderId)),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    quantities: orders.map((o) => o.quantity),
  });

  const { data: royaltyPercentage, isLoading: isRoyaltyLoading } =
    useCollectionRoyalty({
      chainId,
      contractAddress: defaultOrder?.tokenContract!,
      tokenId: String(defaultOrder?.tokenId),
    });

  const { data: currencyMetadata, isLoading: isCurrencyMetadataLoading } =
    useQuery(
      collectionQueries.detail({
        chainID: String(chainId),
        collectionId: defaultCurrency,
      }),
    );

  useEffect(() => {
    if (orders && orders.length == cartItems.length) {
      const subTotals: bigint[] = [];
      cartItems.forEach((_, i) => {
        const quantity = cartItems[i]?.quantity;
        const pricePerToken = orders[i]?.pricePerToken;
        if (!quantity || !pricePerToken) return;
        const subTotal = quantity * pricePerToken;
        subTotals.push(subTotal);
      });
      updateCartItemSubtotals(subTotals);
    }
  }, [orders, cartItems]);

  // TODO: cart vs orders state sync...
  if (orders.length !== cartItems.length) {
    console.warn('orders and cart items are out of sync');
    return null;
  }

  const OrderItem = ({ item }: { item: CartItem }) => {
    const orderItemKey = `${item.chainId}-${item.collectibleMetadata.collectionAddress}-${item.collectibleMetadata.tokenId}-${orderType}}`;

    const order = orders.find((order) => order.orderId === item.orderId);

    const { data: isValidOrderData, isLoading: isLoadingOrderValidity } =
      useOrderbookIsValid({
        requestId: BigInt(order?.orderId || ''),
        quantity: BigInt(order?.quantity || 0),
        chainId: chainId,
      });

    const isValidOrder = isValidOrderData?.isValid || false;

    if (!order) {
      console.error('order not found');
      return null;
    }

    const maxQuantity = Number(order.quantity || 0);
    const price = (order.quantity * order.pricePerToken).toString();

    return (
      <OrderbookOrderItem
        maxQuantity={maxQuantity} // TODO: should default to MIN(oneUnit, maxQuantity)
        price={price}
        order={order}
        key={orderItemKey}
        item={item}
        isLoading={isLoadingOrderValidity}
        isOrderValid={isValidOrder}
      />
    );
  };

  // order summary calculations
  const currencyDecimals = currencyMetadata?.decimals || 0;
  const feePerceentage = DEFAULT_PLATFORM_FEE_PERCENTAGE;

  // TODO: this assumes all orders are the same currency
  const orderSubtotalRaw = cartItems.reduce(
    (acc, item) => acc + item.subtotal,
    BigInt(0),
  );

  const feeAmountRaw = getFrontEndFeeAmount(orderSubtotalRaw, feePerceentage);
  const royaltyAmountRaw = getFrontEndFeeAmount(
    orderSubtotalRaw,
    Number(royaltyPercentage || 0),
  );
  const orderTotalRaw = defaultOrder?.isListing
    ? orderSubtotalRaw + feeAmountRaw
    : orderSubtotalRaw - feeAmountRaw;

  const formattedTotal = formatUnits(orderTotalRaw, currencyDecimals);
  const formattedSubtotal = formatUnits(orderSubtotalRaw, currencyDecimals);
  const formattedFeeAmount = formatUnits(feeAmountRaw, currencyDecimals);
  const formattedRoyaltyAmount = formatUnits(
    royaltyAmountRaw,
    currencyDecimals,
  );

  const containsInvalidOrder =
    isOrderValidBatchData?.isValid.includes(false) || false;

  return (
    <>
      <OrderSections.Items>
        {cartItems.map((item, i) => (
          <OrderItem key={i} item={item} />
        ))}
      </OrderSections.Items>

      {hasMultipleCurrencies ? (
        <></>
      ) : (
        <OrderSections.Summary>
          <Flex className="flex-col gap-3">
            <Flex
              key={defaultCurrency}
              className="items-center justify-end gap-2"
            >
              <Avatar.Base className="h-10 w-10">
                <Avatar.Image src={currencyMetadata?.logoURI} />
                <Avatar.Fallback>{currencyMetadata?.symbol}</Avatar.Fallback>
              </Avatar.Base>

              <Text className="text-2xl font-semibold text-foreground">
                {formatDisplay(formattedTotal)} {currencyMetadata?.symbol}
              </Text>
            </Flex>
            <Accordion.Root
              type="multiple"
              // variant="secondary"
              className="w-full"
            >
              <Accordion.Item
                value="cart-fee-info"
                className="bg-transparent p-2 focus-within:ring-0"
              >
                <Accordion.Trigger className="justify-end p-0 text-xs uppercase text-foreground/50">
                  Estimated Total
                </Accordion.Trigger>

                <Accordion.Content className="overflow-x-auto overflow-y-hidden">
                  <Flex className="flex-col gap-2">
                    <Flex className="items-center justify-between">
                      <Text className="text-sm font-semibold text-foreground/70">
                        Subtotal
                      </Text>

                      <CurrencyAvatar
                        size="sm"
                        title={formattedSubtotal}
                        amount={formatDisplay(formattedSubtotal)}
                        currency={{
                          src: currencyMetadata?.logoURI,
                          symbol: currencyMetadata?.symbol,
                        }}
                      />
                    </Flex>

                    <Flex className="items-center justify-between">
                      <Flex className="items-center gap-2">
                        <Text
                          title="The platform fee is calculated using the total value of the order across all currencies"
                          className="text-sm text-foreground/70"
                        >
                          Platform Fee ({feePerceentage}%)
                        </Text>

                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            <InformationIcon className="h-4 w-4 text-sm text-foreground/30" />
                          </Tooltip.Trigger>

                          <Tooltip.Content>Paid by you.</Tooltip.Content>
                        </Tooltip.Root>
                      </Flex>

                      <CurrencyAvatar
                        size="sm"
                        title={formattedFeeAmount}
                        amount={formatDisplay(formattedFeeAmount)}
                        currency={{
                          src: currencyMetadata?.logoURI,
                          symbol: currencyMetadata?.symbol,
                        }}
                      />
                    </Flex>
                    <Flex className="items-center justify-between">
                      <Text className="text-sm text-foreground/70">Total</Text>

                      <CurrencyAvatar
                        size="sm"
                        title={formattedTotal}
                        amount={formatDisplay(formattedTotal)}
                        currency={{
                          src: currencyMetadata?.logoURI,
                          symbol: currencyMetadata?.symbol,
                        }}
                      />
                    </Flex>
                  </Flex>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </Flex>
        </OrderSections.Summary>
      )}

      <OrderSections.Buttons>
        <OrderbookOrderButtons
          orders={orders}
          isLoading={isLoadingOrderBatchValidity}
          erc20Amount={orderTotalRaw}
          erc20Symbol={currencyMetadata?.symbol || 'unknown'}
          erc20Decimals={currencyMetadata?.decimals || 0}
          platformFee={feeAmountRaw}
          erc20Address={defaultCurrency}
          frontEndFeeRecipient={getPlatformFeeRecipient(chainId)}
          hasMultipleCurrencies={hasMultipleCurrencies}
          containsInvalidOrder={containsInvalidOrder}
          frontendFeePercentage={feePerceentage}
        />
      </OrderSections.Buttons>
    </>
  );
};
