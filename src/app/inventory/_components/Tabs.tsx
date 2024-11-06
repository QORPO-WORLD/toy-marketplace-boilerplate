'use client';

import ENSName from '~/components/ENSName';
import { InfoBox } from '~/components/InfoGrid';
import { Spinner } from '~/components/Spinner';

import { Tabs, Flex, Text, Grid, Button } from '$ui';
import { InventoryCollectiblesContent } from './InventoryCollectiblesContent';
import { ContractType, type TokenBalance } from '@0xsequence/indexer';
import { compareAddress } from '@0xsequence/marketplace-sdk';
import {
  useMarketplaceConfig,
  useTokenBalances,
} from '@0xsequence/marketplace-sdk/react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type InventoryTabsProps = {
  chainId: number;
  accountAddress: string;
};

const inventoryTabsList = {
  collectibles: 'collectibles',
} as const;

export const InventoryTabs = ({
  chainId,
  accountAddress,
}: InventoryTabsProps) => {
  const config = useMarketplaceConfig();
  const router = useRouter();
  const pathname = usePathname();

  const currSearchParams = useSearchParams();
  // Next is missing .set on the searchParams hook, so we need to recreate it
  const searchParams = new URLSearchParams(currSearchParams?.toString());

  const activeTab =
    searchParams?.get('activeTab') ?? inventoryTabsList.collectibles;
  searchParams.set('activeTab', activeTab);

  const {
    data: balancesData,
    isLoading: balancesLoading,
    isError: errorGettingBalances,
  } = useTokenBalances({
    chainId,
    accountAddress,
  });

  if (balancesLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (errorGettingBalances) {
    return (
      <Text className="w-full text-center text-destructive">
        Error occured. Failed to fetch the wallet collectible balances.
      </Text>
    );
  }

  if (!balancesData) {
    return <Text className="w-full text-center text-pink">Empty.</Text>;
  }

  const balances = balancesData.pages[0];

  // collectible balances and counts
  const collectionBalances = balances?.balances.filter(
    (b) => b.contractType != ContractType.ERC20,
  );

  const filteredCollecionBalances: TokenBalance[] = collectionBalances!.filter(
    (balanceCollection) =>
      !!config.data?.collections?.find(
        (marketplaceCollection) =>
          compareAddress(
            marketplaceCollection.collectionAddress,
            balanceCollection.contractAddress,
          ) &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
          marketplaceCollection.chainId === balanceCollection.chainId,
      ),
  );

  const totalCollections = filteredCollecionBalances.length;
  const totalCollectibles = filteredCollecionBalances.reduce(
    (p, c) => p + Number(c.balance),
    0,
  );

  return (
    <>
      <Grid.Root className="w-full grid-cols-2 grid-rows-2 gap-0 md:grid-cols-4 md:grid-rows-1 md:gap-8">
        <InfoBox label="Address" transparent>
          <Text className="overflow-hidden text-lg font-semibold uppercase">
            <ENSName address={accountAddress} truncateAt={6} />
          </Text>
        </InfoBox>

        <InfoBox label="Collections" transparent>
          <Text className="text-lg font-medium">{totalCollections}</Text>
        </InfoBox>

        <InfoBox label="Collectibles" transparent>
          <Text className="text-lg font-medium">{totalCollectibles}</Text>
        </InfoBox>
      </Grid.Root>

      <Tabs.Root
        orientation="horizontal"
        activationMode="manual"
        defaultValue={inventoryTabsList.collectibles}
        value={activeTab}
        onValueChange={(val) => {
          if (val) {
            searchParams.set('activeTab', val);
            router.replace(`${pathname}?${searchParams.toString()}`);
          }
        }}
      >
        <Tabs.Content value={inventoryTabsList.collectibles}>
          <Flex className="flex-col gap-14">
            <InventoryCollectiblesContent
              collectionBalances={filteredCollecionBalances}
            />
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};
