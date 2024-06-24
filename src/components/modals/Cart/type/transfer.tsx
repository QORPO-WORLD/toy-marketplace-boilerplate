'use client';

import { cartState } from '~/lib/stores';

import { OrderButtons } from '../components/actions/OrderButtons';
import { TransferOrderItem } from '../components/items/TransferOrderItem';
import { OrderSections } from './shared';
import { useSnapshot } from 'valtio';

export const TransferOrderComponents = () => {
  const { cartItems } = useSnapshot(cartState);

  return (
    <>
      <OrderSections.Items>
        {cartItems.map((item, i) => {
          return <TransferOrderItem key={i} item={item} isLoading={false} />;
        })}
      </OrderSections.Items>

      <OrderSections.Summary>
        <></>
      </OrderSections.Summary>

      <OrderSections.Buttons>
        <OrderButtons isLoading={false} />
      </OrderSections.Buttons>
    </>
  );
};
