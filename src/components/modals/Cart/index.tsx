'use client';

import { useState } from 'react';

import { OrderItemType } from '~/api/types/order';
import { MarketplaceLabel } from '~/app/_components/MarketplaceLabel';
import { Spinner } from '~/components/Spinner';
import { classNames } from '~/config/classNames';
import { useExchange } from '~/hooks/data';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import {
  areTermsAccepted,
  setTermsAccepted as setTermsAcceptedStorage,
} from '~/legal/termsAcceptance';
import {
  cartState,
  clearOverrideCartState,
  overrideCart,
  resetCart,
  toggleCart,
} from '~/lib/stores';
import { transactionState } from '~/lib/stores/Transaction';

import { Button, Flex, Text, Box, cn, CollapseIcon } from '$ui';
import { OrderRenderer } from './type';
import Link from 'next/link';
import { useSnapshot } from 'valtio';

export const OrderCart = ({ className }: { className?: string }) => {
  const termsAcceptedStorage = areTermsAccepted();
  const [termsAccepted, setTermsAccepted] = useState(termsAcceptedStorage);
  const isDesktop = useIsMinWidth('@xl');

  const {
    cartItems,
    baseOrderInfo: { chainId, exchangeAddress, orderType },
    override,
  } = useSnapshot(cartState);

  const { data: exchangeResp } = useExchange({
    chainId,
    exchangeAddress,
  });

  const exchange = exchangeResp?.data;

  const { transactionPending } = useSnapshot(transactionState);

  const showOverlay = transactionPending || !termsAccepted || override;

  const onClickReadMore = () => {
    if (!isDesktop) {
      toggleCart();
    }
  };

  const onClickAcceptTerms = () => {
    setTermsAcceptedStorage();
    setTermsAccepted(true);
  };

  const OverlayLegalContent = () => {
    return (
      <Flex className="flex-col items-center justify-center gap-6 p-4">
        <Text className="text-center text-sm font-extrabold text-foreground/90">
          I verify that I have read the Terms of Use and Privacy Policy
        </Text>
        <Flex className="mt-auto w-full flex-col items-center justify-center gap-3">
          <Button
            onClick={onClickAcceptTerms}
            label="Accept"
            className="w-full"
          />
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/terms" onClick={onClickReadMore}>
              Read more
            </Link>
          </Button>
        </Flex>
      </Flex>
    );
  };

  const getFormattedOrderType = (orderType: OrderItemType | undefined) => {
    switch (orderType) {
      case OrderItemType.BUY_AMM:
        return 'Buy Order';
      case OrderItemType.SELL_AMM:
        return 'Sell Order';
      case OrderItemType.DEPOSIT:
        return 'Deposit Order';
      case OrderItemType.WITHDRAW:
        return 'Withdraw Order';
      case OrderItemType.TRANSFER:
        return 'Transfer Order';
      case OrderItemType.BUY_ORDERBOOK:
        return 'Buy Order';
      case OrderItemType.SELL_ORDERBOOK:
        return 'Sell Order';
      case OrderItemType.UNKNOWN:
        return 'Unknown Order';
      default:
        return orderType;
    }
  };

  const formatttedOrderType = getFormattedOrderType(orderType);

  return (
    <Flex
      className={cn(
        classNames.orderCart,
        'relative h-full w-full flex-col rounded-md bg-foreground/5',
        className,
      )}
      // template={`
      //     [row1-start] "cart-header" max-content [row1-end]
      //     [row2-start] "cart-items" 1fr [row2-end]
      //     [row3-start] "cart-info" [row3-end]
      //     [row4-start] "cart-actions" [row4-end]
      //     / 100%
      // `}
    >
      <Flex
        className={cn(
          classNames.orderCartTopHeader,
          'items-center justify-between rounded-t-md border-b border-b-border bg-foreground/10 py-1 pl-4 pr-1',
        )}
      >
        <Text className="text-sm font-semibold text-foreground/90">
          {formatttedOrderType}
        </Text>

        <Button variant="ghost" onClick={() => toggleCart()}>
          <CollapseIcon />
        </Button>
      </Flex>

      {exchange && (
        <Flex
          className={cn(
            classNames.orderCartSubHeader,
            'gap-1 border-b border-b-border px-3 py-2',
          )}
        >
          <MarketplaceLabel
            size="sm"
            collectionName={exchange.collection.name}
            currencySymbol={exchange.currency.symbol}
            collectionIconUrl={exchange.collection.iconUrl}
            currencyIconUrl={exchange.currency.iconUrl}
            lpFee={exchange.lpFeePercentage}
          />
        </Flex>
      )}

      <Flex
        className={cn(
          classNames.orderCartTopHeader,
          'items-center justify-between border-b border-b-border px-3 py-3',
        )}
      >
        <Text className="text-sm text-foreground/70">
          {cartItems.length} Collectible{cartItems.length > 1 ? 's' : ''}
        </Text>

        <Button
          variant="ghost"
          size="xs"
          label="Clear All"
          onClick={() => resetCart()}
        />
      </Flex>

      <Box
        className={cn(
          'absolute left-0 top-0 z-50 rounded-[inherit]',
          showOverlay ? 'flex h-full w-full' : 'hidden',
          'items-center justify-center opacity-90',
          'bg-background/50 backdrop-blur-md',
        )}
      >
        {!termsAccepted ? <OverlayLegalContent /> : null}
        {termsAccepted && transactionPending ? <OverlayLoadingContent /> : null}
        {termsAccepted && !transactionPending && override ? (
          <OverlayOverrideCart />
        ) : null}
      </Box>

      <OrderRenderer />
    </Flex>
  );
};

const OverlayLoadingContent = () => {
  return (
    <Box className="flex-col items-center justify-center">
      <Text className="text-lg font-semibold text-foreground/90">
        Transaction Pending...
      </Text>
      <Spinner />
    </Box>
  );
};

const OverlayOverrideCart = () => {
  return (
    <Flex className="flex-col items-center justify-center gap-6 p-4 animate-in fade-in-70 zoom-in-90">
      <Text className="text-center text-sm font-bold text-foreground/90">
        You are adding conflicting items to cart. Clear cart to proceed
      </Text>
      <Flex className="mt-auto w-full flex-col items-center justify-center gap-3">
        <Button
          variant="warning"
          onClick={overrideCart}
          label="Clear Cart"
          className="w-full"
        />
        <Button
          onClick={clearOverrideCartState}
          variant="ghost"
          className="w-full"
          label="Cancel"
        />
      </Flex>
    </Flex>
  );
};
