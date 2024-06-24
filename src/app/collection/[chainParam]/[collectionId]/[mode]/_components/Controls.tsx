'use client';

import { Routes } from '~/routes';

import { BaseCollectionControls } from '../../../_components';
import useCollectionParams from '../../../_hooks/useCollectionParams';
import { useRouter } from 'next/navigation';

const CollectionControls = () => {
  const { chainId, collectionId, mode } = useCollectionParams();
  const router = useRouter();

  return (
    <BaseCollectionControls
      tabValues={[
        { label: 'Buy', value: 'buy' },
        { label: 'Sell', value: 'sell' },
        { label: 'Your Activity', value: 'activity' },
      ]}
      tabRoot={{
        defaultValue: mode,
        onValueChange: (newMode: string) => {
          router.replace(
            Routes.orderbookCollection({
              chainParam: chainId,
              collectionId,
              mode: newMode as any,
            }),
          );
        },
      }}
    />
  );
};

export default CollectionControls;
