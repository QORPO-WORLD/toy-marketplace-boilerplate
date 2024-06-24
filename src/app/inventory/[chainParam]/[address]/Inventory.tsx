'use client';

import { useEffect } from 'react';

import { Spinner } from '~/components/Spinner';
import { ConnectButton } from '~/components/buttons/ConnectButton';
import { NetworkSelectModalContent } from '~/components/modals/NetworkSelectModal';
import { getChainId } from '~/config/networks';
import { Routes } from '~/lib/routes';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, Image, Text } from '$ui';
import { InventoryTabs } from './_components/Tabs';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useAccount, useEnsAddress } from 'wagmi';

const Inventory = ({
  chainParam,
  queryAccountAddress,
}: {
  chainParam: string;
  queryAccountAddress: string;
}) => {
  const {
    isConnected,
    chain,
    chainId: walletChainId,
    isConnecting,
    address,
  } = useAccount();

  const supportedChain = walletChainId == chain?.id;
  const { address: inventoryAddress, isLoading } =
    useAddressFromQueryString(queryAccountAddress);
  const router = useRouter();
  const chainId = getChainId(chainParam);

  useEffect(() => {
    if (isConnecting || isLoading) return; // wait for the address to be resolved and the wallet to be connected
    if (inventoryAddress == address && walletChainId == chainId) return; // if the user is already on the right inventory page
    router.push(
      Routes.inventory({
        address: inventoryAddress,
        isConnected,
        chainParam: chainId,
      }),
    );
  }, [
    isConnected,
    chainId,
    walletChainId,
    address,
    isConnecting,
    isLoading,
    inventoryAddress,
    router,
  ]);

  if (isLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  const isUserNotConnected = queryAccountAddress === 'connect' && !isConnected;

  // when user is fetching own Inventory but isn't connected
  if (isUserNotConnected) {
    return (
      <Flex className="my-auto flex-col items-center justify-center gap-4">
        <Image.Base
          alt="Cube"
          src="/images/cubes.svg"
          className="h-[80px] w-[80px]"
        />

        <Text className="text-xl font-extrabold" as="h4">
          Not Connected
        </Text>
        <Text className="text-center font-medium text-foreground/50">
          Connect your wallet to see your inventory
        </Text>
        <ConnectButton variant="secondary" />
      </Flex>
    );
  }

  if (!supportedChain) {
    return (
      <Flex className="h-2/3 flex-col items-center justify-center">
        <Text className="pb-6 text-center text-xl text-destructive">
          The connected network is not supported
        </Text>
        <SwitchNetworkButton />
      </Flex>
    );
  }

  if (!inventoryAddress) {
    return (
      <Text className="w-full text-center text-xl text-destructive">
        The provided address/ENS Name is wrong or invalid
      </Text>
    );
  }

  if (!chainId) {
    return (
      <Text className="w-full text-center text-xl text-destructive">
        The provided chain is wrong or invalid
      </Text>
    );
  }

  return (
    <InventoryTabs chainId={chainId} inventoryAddress={inventoryAddress} />
  );
};

export default Inventory;

const useAddressFromQueryString = (
  query: string,
): { address: string | undefined; isLoading: boolean } => {
  // TODO: Refactor this
  const { isConnected, address } = useAccount();
  const { data, isLoading: isEnsLoading } = useEnsAddress({
    name: query,
    chainId: 1,
  });

  if (query === 'me' && isConnected && address) {
    return { address: address, isLoading: false };
  }

  if (ethers.utils.isAddress(query)) {
    return { address: query, isLoading: false };
  }

  // if it's a ENS name
  if (query.trim().endsWith('.eth') && data) {
    return { address: data, isLoading: isEnsLoading };
  }

  return { address: undefined, isLoading: false };
};

const SwitchNetworkButton = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Switch Network</Button>
      </Dialog.Trigger>

      <Dialog.BaseContent
        className="max-w-sm"
        container={getThemeManagerElement()}
        title="Switch Network"
      >
        <NetworkSelectModalContent />
      </Dialog.BaseContent>
    </Dialog.Root>
  );
};
