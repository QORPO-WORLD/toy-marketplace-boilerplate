'use client';

import ENSName from '~/components/ENSName';
import { InfoBox } from '~/components/InfoGrid';
import { Spinner } from '~/components/Spinner';
import type { MarketConfig } from '~/config/marketplace';
import { indexerQueries } from '~/lib/queries';
import { compareAddress } from '~/lib/utils/helpers';

import { Tabs, Flex, Text, Grid } from '$ui';
import { InventoryCollectiblesContent } from './Content/CollectiblesContent';
import { InventoryFilters } from './Filters';
import { ContractType, type TokenBalance } from '@0xsequence/indexer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type InventoryTabsProps = {
  chainId: number;
  inventoryAddress: string;
  marketConfig: MarketConfig;
};

const inventoryTabsList = {
  collectibles: 'collectibles',
} as const;

export const InventoryTabs = ({
  chainId,
  inventoryAddress,
  marketConfig,
}: InventoryTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const currSearchParams = useSearchParams();
  // Next is missing .set on the searchParams hook, so we need to recreate it
  const searchParams = new URLSearchParams(currSearchParams?.toString());

  const activeTab =
    searchParams?.get('activeTab') ?? inventoryTabsList.collectibles;
  searchParams.set('activeTab', activeTab);

  const {
    data: userTokenBalancesRespPage,
    isLoading: isUserTokenBalancesLoading,
    isError: isUserTokenBalancesError,
  } = useInfiniteQuery(
    indexerQueries.tokenBalance({
      chainId,
      includeMetadata: false,
      accountAddress: inventoryAddress,
    }),
  );

  if (isUserTokenBalancesLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (isUserTokenBalancesError) {
    return (
      <Text className="w-full text-center text-destructive">
        Error occured. Failed to fetch the wallet collectible balances.
      </Text>
    );
  }

  if (!userTokenBalancesRespPage) {
    return <Text className="w-full text-center text-pink">Empty.</Text>;
  }

  const userTokenBalancesResp = userTokenBalancesRespPage.pages[0];

  // collectible balances and counts
  const collectionBalances = userTokenBalancesResp?.balances.filter(
    (b) => b.contractType != ContractType.ERC20,
  );

  const filteredCollecionBalances: TokenBalance[] = collectionBalances!.filter(
    (c) =>
      !!marketConfig?.collections?.find(
        (wcc) =>
          compareAddress(wcc.collectionAddress, c.contractAddress) &&
          wcc.chainId === c.chainId,
      ),
  );

  const totalCollections = filteredCollecionBalances.length;
  const totalCollectibles = filteredCollecionBalances.reduce(
    (p, c) => p + Number(c.balance),
    0,
  );

  return (
    <Grid.Root className="w-full grid-cols-2 grid-rows-2 gap-0 md:grid-cols-4 md:grid-rows-1 md:gap-8">
      <InfoBox label="Address" transparent>
        <Text className="overflow-hidden text-lg font-semibold uppercase">
          <ENSName address={inventoryAddress} truncateAt={6} />
        </Text>
      </InfoBox>

      <InfoBox label="Collections" transparent>
        <Text className="text-lg font-medium">{totalCollections}</Text>
      </InfoBox>

      <InfoBox label="Collectibles" transparent>
        <Text className="text-lg font-medium">{totalCollectibles}</Text>
      </InfoBox>

      <Tabs.Root
        orientation="horizontal"
        activationMode="manual"
        defaultValue={inventoryTabsList.collectibles}
        // variant="secondary"
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
            <InventoryFilters
              totalResults={totalCollectibles}
              hasExcess={false}
            />
            <InventoryCollectiblesContent
              collectionBalances={filteredCollecionBalances}
            />
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </Grid.Root>
  );
};
