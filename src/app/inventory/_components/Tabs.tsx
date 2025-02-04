'use client';

import { useEffect, useState } from 'react';
import { IoDiamondSharp } from 'react-icons/io5';

import ENSName from '~/components/ENSName';
import { InfoBox } from '~/components/InfoGrid';
import { Spinner } from '~/components/Spinner';

import { Flex, Grid, Tabs, Text } from '$ui';
import {
  getChainNamebySymbol,
  getCurrencyLogoByChainId,
} from '../../../lib/utils/helpers';
import sequence from '../../../sequence/Sequence';
import ActivityWrapper from './Activyty';
import { InventoryCollectiblesContent } from './InventoryCollectiblesContent';
import { ContractType, type TokenBalance } from '@0xsequence/indexer';
import { useAddFundsModal } from '@0xsequence/kit-checkout';
import { compareAddress } from '@0xsequence/marketplace-sdk';
import {
  useListBalances,
  useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import '@0xsequence/waas';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAccount, useBalance } from 'wagmi';

type InventoryTabsProps = {
  chainId: number;
  accountAddress: string;
};

type BalanceProps = {
  data: BalanceData;
};

interface BalanceData {
  dp: {
    id: string;
    last_refresh_points: number;
    loyalty_points: number;
    loyalty_points_for_next_tier: number;
    loyalty_points_instant: number;
    loyalty_points_nfts: number;
    loyalty_points_qorpo: number;
    current_tier_id: string;
    current_tier_name: string;
    next_tier_id: string | null;
    next_tier_name: string | null;
    last_refresh_timestamp: string;
    next_refresh_timestamp: string;
  };
  ccash: {
    currency: string;
    amount: number;
  };
}

const inventoryTabsList = {
  collectibles: 'collectibles',
} as const;

export const InventoryTabs = ({
  chainId,
  accountAddress,
}: InventoryTabsProps) => {
  const { triggerAddFunds: toggleAddFunds } = useAddFundsModal();
  const config = useMarketplaceConfig();
  const router = useRouter();
  const pathname = usePathname();
  const [idToken, setIdToken] = useState<string | null>(null);
  const { address, isConnected, chain } = useAccount();
  const { data: walletData } = useBalance({
    address,
  });
  const [isActivity, setIsActivity] = useState(false);

  const { data } = useQuery<BalanceProps>({
    queryKey: ['qorpobalance', idToken],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BALANCE_URL}?token=${idToken}`).then(
        (res) => res.json(),
      ),
    enabled: idToken !== null,
    refetchInterval: 100000,
  });

  useEffect(() => {
    const getIdToken = async () => {
      try {
        const signedIn = await sequence.isSignedIn();
        if (!signedIn) return;
        const { idToken } = await sequence.getIdToken();
        setIdToken(idToken);
      } catch (error) {
        console.error('Error getting ID token:', error);
      }
    };

    void getIdToken();
  }, [isConnected, address]);

  const currSearchParams = useSearchParams();
  const searchParams = new URLSearchParams(currSearchParams?.toString());

  const activeTab =
    searchParams?.get('activeTab') ?? inventoryTabsList.collectibles;
  searchParams.set('activeTab', activeTab);

  const {
    data: balancesData,
    isLoading: balancesLoading,
    isError: errorGettingBalances,
  } = useListBalances({
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

  const balances = balancesData?.pages[0];

  const isEmptyInventory = !balances || balances.balances.length === 0;

  // collectible balances and counts
  const collectionBalances = balances?.balances.filter(
    (b) => b.contractType != ContractType.ERC20,
  );

  const filterCollecionBalances = (): TokenBalance[] | [] => {
    if (collectionBalances === undefined) return [];
    return collectionBalances.filter(
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
  };

  const filteredCollecionBalances = filterCollecionBalances();

  return (
    <>
      {chain?.id && (
        <Grid.Root className="w-full grid-cols-2 grid-rows-2 gap-0 md:grid-cols-4 md:grid-rows-1 md:gap-8 rounded-[1.5625rem] border border-white bg-main-gradient backdrop-blur-[0.625rem] hover:z-10 relative">
          <InfoBox
            label="token"
            transparent
            i={
              <div className="relative">
                <img
                  className="w-[1.3rem] aspect-square ml-auto peer"
                  src="/market/icons/info.svg"
                  alt="i-logo"
                />
                <div className="absolute left-[100%] top-[50%] translate-y-[-50%] translate-x-[2%] w-96 p-4 bg-[#483F50] rounded-3xl shadow-lg tooltip font-DMSans text-white selection:none hidden peer-hover:block">
                  <p>
                    <strong>How to Get Testnet $TOY Tokens?</strong>
                    <br />
                    Earn 1 Testnet $TOY for every CCASH earned in Citizen
                    Conflict by creating a TOY Wallet. Use it to test
                    transactions and explore the TOY CHAIN Testnet. A TOY Wallet
                    is required for full access.
                  </p>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-2 text-white">
              <img
                className="w-[1.5625rem] aspect-square"
                src={getCurrencyLogoByChainId(chain?.id)}
                alt="logo"
              />
              <p className="text-lg font-medium ">
                {getChainNamebySymbol(walletData?.symbol)}
              </p>
            </div>
          </InfoBox>

          <InfoBox label="Balance" transparent>
            <Text className="text-lg font-medium  font-DMSans text-[1.25rem] tracking-[-0.07rem]">
              <p className=" text-xl font-bold ">
                {parseFloat(walletData?.formatted || '0').toFixed(3)}{' '}
                {walletData?.symbol}
              </p>
            </Text>
          </InfoBox>

          <InfoBox label="Address" transparent>
            <Text className="overflow-hidden text-lg font-semibold uppercase font-DMSans text-[1.25rem]  tracking-[-0.07rem]">
              <ENSName address={accountAddress} truncateAt={6} />
            </Text>
          </InfoBox>
          <div className="w-full flex justify-end items-center text-2xl gap-4 pr-4 opacity-50">
            <button
              className="bg-white p-2 px-4 text-[#E15975] rounded-[2.69rem]"
              // onClick={() =>
              //   toggleAddFunds({
              //     walletAddress: recipientAddress,
              //   })
              // }
            >
              Deposit
            </button>
            <button
              className="bg-white p-2 px-4 text-[#E15975] rounded-[2.69rem]"
              // onClick={() =>
              //   toggleAddFunds({
              //     walletAddress: recipientAddress,
              //   })
              // }
            >
              withdraw
            </button>
          </div>
        </Grid.Root>
      )}
      <Grid.Root className="w-full grid-cols-2 grid-rows-2 gap-0 md:grid-cols-4 md:grid-rows-1 md:gap-8 rounded-[1.5625rem] border border-white bg-main-gradient backdrop-blur-[0.625rem] mt-[1rem] hover:z-10">
        <InfoBox
          label="Diamond points"
          transparent
          i={
            <div className="relative">
              <img
                className="w-[1.3rem] aspect-square ml-auto peer"
                src="/market/icons/info.svg"
                alt="i-logo"
              />
              <div className="absolute left-[100%] top-[50%] translate-y-[-50%] translate-x-[2%] w-96 p-4 bg-[#483F50] rounded-3xl shadow-lg tooltip font-DMSans text-white selection:none hidden peer-hover:block">
                <p className="font-thin">
                  <span className="font-extrabold">
                    Can I Earn Diamond Points on TOY Testnet?
                  </span>
                  <br />
                  Yes. Diamond Points, QORPO’s loyalty currency, can be earned
                  by participating in the TOY CHAIN Testnet and creating a TOY
                  Wallet. These points will later convert into $TOY during the
                  biggest airdrop yet.
                </p>
              </div>
            </div>
          }
        >
          <IoDiamondSharp
            color="white"
            className="w-[1.4313rem] h-[1.54313rem]"
          />
        </InfoBox>

        <InfoBox label="Balance" transparent>
          <Text className="text-lg font-medium  font-DMSans text-[1.25rem] tracking-[-0.07rem]">
            {data?.data.dp.loyalty_points || '0'}
          </Text>
        </InfoBox>
      </Grid.Root>

      {filteredCollecionBalances.length && (
        <div className="mt-4 px-4">
          <ul className="flex gap-4 items-center">
            <li
              className={clsx(
                ' px-2 py-1 rounded-[1.25rem] uppercase font-DMSans font-bold cursor-pointer',
                {
                  'bg-white text-main': !isActivity,
                  'text-white opacity-40': isActivity,
                },
              )}
              onClick={() => setIsActivity(false)}
            >
              <p>collected</p>
            </li>
            <li
              className={clsx(
                ' px-2 py-1 rounded-[1.25rem] uppercase font-DMSans font-bold cursor-pointer',
                {
                  'bg-white text-main': isActivity,
                  'text-white opacity-40': !isActivity,
                },
              )}
              onClick={() => setIsActivity(true)}
            >
              <p>activity</p>
            </li>
          </ul>
        </div>
      )}

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
          <Flex className="flex-col gap-4">
            {filteredCollecionBalances.length ? (
              isActivity ? (
                <div className="max-w-[100vw] px-8 py-4 md:grid-rows-1 md:gap-8 rounded-[1.5625rem] border border-white bg-[#574d5fcc] backdrop-blur-[0.625rem]">
                  <ActivityWrapper
                    filteredCollecionBalances={filteredCollecionBalances}
                  />
                </div>
              ) : (
                <InventoryCollectiblesContent
                  collectionBalances={filteredCollecionBalances}
                />
              )
            ) : (
              <div className="max-w-[100vw] px-4 py-4 md:px-3 md:grid-rows-1 md:gap-8 rounded-[1.5625rem] min-h-[56dvh] border border-white bg-[#574d5fcc] backdrop-blur-[0.625rem] flex flex-col items-center justify-center">
                <Text className="text-white text-center text-3xl">
                  you have no assets
                </Text>
              </div>
            )}
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};
