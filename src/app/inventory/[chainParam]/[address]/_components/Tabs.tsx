'use client';

import ENSName from '~/components/ENSName';
import { InfoBox } from '~/components/InfoGrid';
import { Spinner } from '~/components/Spinner';
import { useWalletBalances } from '~/hooks/data';
import { marketConfig$ } from '~/lib/stores/marketConfig';
import { compareAddress } from '~/utils/address';

import { Tabs, Flex, Text, Grid } from '$ui';
import { InventoryCollectiblesContent } from './Content/CollectiblesContent';
import { InventoryFilters } from './Filters';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type InventoryTabsProps = {
  chainId: number;
  inventoryAddress: string;
};

const inventoryTabsList = {
  collectibles: 'collectibles',
} as const;

export const InventoryTabs = ({
  chainId,
  inventoryAddress,
}: InventoryTabsProps) => {
  const marketConfig = marketConfig$.get();
  const router = useRouter();
  const pathname = usePathname();

  const currSearchParams = useSearchParams();
  // Next is missing .set on the searchParams hook, so we need to recreate it
  const searchParams = new URLSearchParams(currSearchParams?.toString());

  const activeTab =
    searchParams?.get('activeTab') ?? inventoryTabsList.collectibles;
  searchParams.set('activeTab', activeTab);

  const {
    data: userTokenBalancesResp,
    isLoading: isUserTokenBalancesLoading,
    isError: isUserTokenBalancesError,
  } = useWalletBalances({
    chainId: String(chainId),
    address: inventoryAddress,
  });

  if (isUserTokenBalancesLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (isUserTokenBalancesError || userTokenBalancesResp?.error) {
    return (
      <Text className="w-full text-center text-destructive">
        Error occured. Failed to fetch the wallet collectible balances.
      </Text>
    );
  }

  if (!userTokenBalancesResp || userTokenBalancesResp.data === null) {
    return <Text className="w-full text-center text-pink">Empty.</Text>;
  }

  // collectible balances and counts
  console.log(userTokenBalancesResp);
  const collectionBalances = userTokenBalancesResp.balances.filter(
    (b) => b.contractType != 'ERC20',
  );

  const filteredCollecionBalances: TokenBalance[] = collectionBalances.filter(
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
