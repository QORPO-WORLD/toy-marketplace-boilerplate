'use client';

import type { ComponentProps } from 'react';

import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';

import { Grid, Tabs, cn } from '$ui';
import { useRouter } from 'next/navigation';

const CollectionControls = ({
  chainId,
  collectionId,
  mode,
}: {
  chainId: number;
  collectionId: string;
  mode?: 'buy' | 'sell';
}) => {
  const router = useRouter();

  return (
    <BaseCollectionControls
      tabValues={[
        { label: 'Buy', value: 'buy' },
        { label: 'Sell', value: 'sell' },
      ]}
      tabRoot={{
        defaultValue: mode,
        onValueChange: (newMode: string) => {
          router.replace(
            Routes.collection({
              chainParam: chainId,
              collectionId,
              mode: newMode as 'buy' | 'sell',
            }),
          );
        },
      }}
    />
  );
};

export default CollectionControls;

type BaseCollectionControlsProps = {
  tabRoot: ComponentProps<typeof Tabs.Root>;
  tabValues: { label: string; value: string }[];
};

export const BaseCollectionControls = ({
  tabRoot,
  tabValues,
}: BaseCollectionControlsProps) => {
  return (
    <Grid.Root
      className={cn(classNames.collectionControls, 'w-full bg-background')}
      template={`
      [row1-start] "collection-control-mode collection-control-search-input collection-control-tabs"  [row1-end]
      / 1fr 
      `}
    >
      <Grid.Child name="collection-control-mode">
        <Tabs.Root {...tabRoot}>
          <Tabs.List>
            {tabValues.map((t, i) => (
              <Tabs.Trigger key={i} value={t.value}>
                {t.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Grid.Child>
    </Grid.Root>
  );
};
