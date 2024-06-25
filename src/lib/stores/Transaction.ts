import type { OrderItemType } from '~/types/OrderItemType';

import type { CartItem } from './cart/Cart';
import { proxy } from 'valtio';

interface TransactionState {
  transactionPending: boolean;
  transactionConfirmationModelState: {
    open: boolean;
    cartType: OrderItemType | undefined;
    cartItems: readonly CartItem[];
    transactionId: string;
  };
}

const defaultTransactionState = (): TransactionState => ({
  transactionPending: false,
  transactionConfirmationModelState: {
    open: false,
    cartType: undefined,
    cartItems: [],
    transactionId: '',
  },
});

export const transactionState = proxy<TransactionState>(
  defaultTransactionState(),
);

export const setTransactionPendingState = (isTxPending: boolean) => {
  transactionState.transactionPending = isTxPending;
};

export const onTransactionFinish = (
  arg: Omit<TransactionState['transactionConfirmationModelState'], 'open'>,
) => {
  transactionState.transactionConfirmationModelState = {
    cartItems: arg.cartItems,
    cartType: arg.cartType,
    open: true,
    transactionId: arg.transactionId,
  };
};

export const onTransactionConfirmationModelClose = () => {
  transactionState.transactionConfirmationModelState = {
    cartItems: [],
    cartType: undefined,
    open: false,
    transactionId: '',
  };
};
