'use client';

import { Spinner } from '~/components/Spinner';
import { ConnectButton } from '~/components/buttons/ConnectButton';
import { NetworkSelectModalContent } from '~/components/modals/NetworkSelectModal';
import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, Image, Text } from '$ui';
import { InventoryTabs } from './_components/Tabs';
import { useAccount } from 'wagmi';

const Inventory = ({ marketplaceConfig }: { marketplaceConfig: MarketplaceConfig }) => {
  const {
    isConnected,
    chain,
    chainId: walletChainId,
    isConnecting,
    address,
  } = useAccount();

  const supportedChain = walletChainId == chain?.id;

  if (isConnecting) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (!isConnected) {
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

  return (
    <InventoryTabs
      chainId={walletChainId!}
      inventoryAddress={address!}
      marketplaceConfig={marketplaceConfig}
    />
  );
};

export default Inventory;

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
