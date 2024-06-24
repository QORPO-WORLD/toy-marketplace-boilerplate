'use client';

import { classNames } from '~/config/classNames';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import { cartState, setCartOpen } from '~/lib/stores';
import {
  onTransactionConfirmationModelClose,
  transactionState,
} from '~/lib/stores/Transaction';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Grid, Dialog, cn } from '$ui';
import { OrderCart } from '../../modules/Cart';
import { TransactionConfirmationModal } from '../../modules/Cart/components/transactionConfirmation';
import { Footer } from './Footer';
import { Header } from './Header';
import { useSnapshot } from 'valtio';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <></>;
};

//TODO...
const RouteLoadingBar = () => {
  // const { isFinished, progress, animationDuration } = useNProgress({
  //   isAnimating: isLoading,
  //   incrementDuration: 1600,
  //   minimum: 0.05
  // })
  // return (
  //   <Box
  //     className={cn(
  //       'fixed left-0 top-0 z-[1000] h-[2px] transition-all',
  //       isFinished ? 'bg-transparent' : 'bg-primary'
  //     )}
  //     style={{
  //       width: `${isFinished ? 0 : progress * 100}vw`
  //     }}
  //   />
  // )
};

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
