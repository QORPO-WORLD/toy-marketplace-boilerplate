'use client';

import { OrderCart } from '~/components/modals/Cart';
import { TransactionConfirmationModal } from '~/components/modals/Cart/components/transactionConfirmation';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import {
  onTransactionConfirmationModelClose,
  transactionState,
} from '~/lib/stores/Transaction';
import { cartState, setCartOpen } from '~/lib/stores/cart/Cart';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Grid, Dialog, cn } from '$ui';
import { useSnapshot } from 'valtio';

export const OrderCartGrid = () => {
  const { isCartOpen } = useSnapshot(cartState);

  const { transactionConfirmationModelState } = useSnapshot(transactionState);

  const largerThanSm = useIsMinWidth('@sm');

  if (!largerThanSm && isCartOpen) {
    return (
      <>
        <Dialog.Root open={isCartOpen} onOpenChange={setCartOpen}>
          <Dialog.BaseContent
            hideCloseButton
            container={getThemeManagerElement()}
            className="h-full w-full bg-background/95 p-1"
          >
            <OrderCart className="h-dvh max-w-[98vw]" />
          </Dialog.BaseContent>
        </Dialog.Root>

        {transactionConfirmationModelState.open ? (
          <TransactionConfirmationModal
            {...transactionConfirmationModelState}
            onOpenChange={onTransactionConfirmationModelClose}
          />
        ) : null}
      </>
    );
  }

  return (
    <Grid.Child
      name="order-cart"
      className={cn(
        'sticky right-[--orderCartRightOffset] top-[--headerHeight] border border-border',
        'w-[350px] rounded-md bg-background',
        // 'transition-all',
        isCartOpen
          ? 'sticky right-[--orderCartRightOffset] top-[--headerHeight] flex animate-in fade-in slide-in-from-bottom-10'
          : 'none fixed right-[-400px]',
      )}
      style={{
        height: 'calc(100vh - var(--headerHeight) - 10px)',
      }}
    >
      {isCartOpen ? <OrderCart /> : null}

      {transactionConfirmationModelState.open ? (
        <TransactionConfirmationModal
          {...transactionConfirmationModelState}
          onOpenChange={onTransactionConfirmationModelClose}
        />
      ) : null}
    </Grid.Child>
  );
};
