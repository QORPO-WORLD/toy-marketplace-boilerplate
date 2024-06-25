'use client';

// import useCollectionParams from '../../../../../../_hooks/useCollectionParams';
// import { OrderbookActivity } from './OrderbookActivity';
// import { OrderbookBuy } from './OrderbookBuy';
// import { OrderbookSell } from './OrderbookSell';

interface collectionContentProps {
  chainId: number;
  collectionId: string;
}

export const OrderBookContent = ({
  chainId,
  collectionId,
}: collectionContentProps) => {
  // const { mode } = useCollectionParams();
  // switch (mode.toLowerCase()) {
  //   case 'sell':
  //     return <OrderbookSell chainId={chainId} collectionId={collectionId} />;
  //   case 'buy':
  //     return <OrderbookBuy chainId={chainId} collectionId={collectionId} />;
  //   case 'activity':
  //     return (
  //       <OrderbookActivity chainId={chainId} collectionId={collectionId} />
  //     );
  //   default:
  //     return <></>;
  // }
};
