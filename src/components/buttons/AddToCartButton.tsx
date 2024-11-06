'use client';

import { Button } from '$ui';

const orderTypes = {
  buy: {
    label: 'Buy',
    onClick: () => {},
  },
  sell: {
    label: 'Sell',
    onClick: () => {},
  },
  transfer: {
    label: 'Transfer',
    onClick: () => {},
  },
  order: {
    label: 'Place offer',
    onClick: () => {},
  },
  listing: {
    label: 'Create Listing',
    onClick: () => {},
  },
};

type OrderSide = 'buy' | 'sell' | 'transfer' | 'order' | 'listing';

type AddToCartButtonProps = {
  className?: string;
  orderSide: OrderSide;
};

export const AddToCartButton = ({
  className,
  orderSide,
}: AddToCartButtonProps) => {
  const onClick = () => {};
  const { label } = orderTypes[orderSide];

  return (
    <Button onClick={onClick} className={className}>
      {label}
    </Button>
  );
};
