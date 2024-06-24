'use client';

import { NetworkIcon } from '~/components/NetworkLabel';
import { SUPPORTED_NETWORKS } from '~/config/networks/config';
import { useIsClient } from '~/hooks/ui/useIsClient';
import { NetworkSelectModalContent } from '~/modals/NetworkSelectModal';
import { getThemeManagerElement } from '~/utils/theme';

import { Button, Dialog } from '$ui';
import { useAccount } from 'wagmi';

export const NetworkButton = () => {
  const { chain } = useAccount();
  const isClient = useIsClient();
  if (!isClient)
    return (
      <Button variant="muted">
        <div className="h-6 w-6"></div>
      </Button>
    );

  if (chain?.id) {
    const getNetworkButton = () => {
      if (!SUPPORTED_NETWORKS.map((n) => n.chainId).includes(chain?.id)) {
        return <Button variant="destructive" label="Unsupported Network" />;
      }
      return (
        <Button
          variant="muted"
          className="backdrop-blur"
          aria-label="Select network"
        >
          <NetworkIcon chainId={chain?.id} />
        </Button>
      );
    };

    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>{getNetworkButton()}</Dialog.Trigger>

        <Dialog.BaseContent
          className="sm:max-w-[450px]"
          container={getThemeManagerElement()}
          title="Switch Network"
        >
          <NetworkSelectModalContent />
        </Dialog.BaseContent>
      </Dialog.Root>
    );
  }
  return <></>;
};
