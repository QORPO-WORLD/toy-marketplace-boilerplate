import { toast } from 'react-toastify';

import type { NetworkConfig } from '~/config/networks/type';
import { getPublicClient } from '~/config/networks/wagmi/rpcClients';

import { Button, Text } from '$ui';
import type { Hex } from 'viem';

type OrderToastObject = {
  pending?: string;
  success?: string;
  error?: string;
  txHash: string;
  network: NetworkConfig;
  onSuccess?: () => void;
};

export const transactionNotification = async ({
  pending = 'Transaction Pending...',
  success = 'Transaction Successful!',
  error = 'An error occurred with your transaction',
  txHash,
  network,
  onSuccess,
}: OrderToastObject) => {
  const publicClient = getPublicClient(network.chainId);

  const transaction = publicClient.waitForTransactionReceipt({
    hash: txHash as Hex,
    confirmations: 5,
  });

  await toast.promise(
    transaction,
    {
      pending: {
        render() {
          return (
            <>
              <Text className="pb-2">{pending}</Text>
              <Button variant="muted" size="xs" asChild>
                <a
                  target="_blank"
                  href={`${network?.explorerUrl}/tx/${txHash}`}
                >
                  Click to view on {network?.explorerName}
                </a>
              </Button>
            </>
          );
        },
      },
      success: {
        render() {
          onSuccess && onSuccess();
          return (
            <>
              <Text className="pb-2">{success}</Text>
              <Button variant="muted" size="xs" asChild>
                <a
                  target="_blank"
                  href={`${network?.explorerUrl}/tx/${txHash}`}
                >
                  Click to view on {network?.explorerName}
                </a>
              </Button>
            </>
          );
        },
      },
      error: {
        render() {
          return (
            <>
              <Text className="pb-2">{error}</Text>
            </>
          );
        },
      },
    },
    {
      className: 'after:pointer-events-none',
      position: 'bottom-right',
      toastId: txHash,
    },
  );
};
