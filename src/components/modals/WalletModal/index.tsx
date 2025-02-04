'use client';

import { useState } from 'react';

import ENSName from '~/components/ENSName';

import { sequence } from '0xsequence';
import { Button, CheckmarkIcon, CopyIcon, Flex, Text, WalletIcon } from '$ui';
import { useAccount, useDisconnect } from 'wagmi';

export const WalletModalContent = () => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const [copied, setCopied] = useState(false);

  const onDisconnectClick = () => {
    disconnect();
  };

  const openWalletSequence = async () => {
    let wallet: sequence.provider.SequenceProvider | undefined;
    try {
      wallet = sequence.getWallet();
      if (wallet) {
        void wallet.openWallet();
      }
    } catch (e) {
      console.error('Error opening wallet', e);
    }
  };

  return (
    <>
      <Flex className="mb-5 flex-col items-start justify-between mb:overflow-hidden">
        <Flex className="items-center gap-3 font-medium text-foreground/80">
          <WalletIcon />
          <Text className="text-[1rem] font-main uppercase text-3xl">
            TOY WALLET
          </Text>
        </Flex>
        <Flex className="w-full text-white mb:overflow-hidden">
          <Text className="ml-1 mt-2 text-[1rem] text-white md:block font-main mb:truncate">
            <ENSName address={address} />
          </Text>

          <Button
            className="ml-1 pt-1"
            size="xs"
            variant="ghost"
            onClick={() => {
              if (!address) return;

              void navigator.clipboard.writeText(address);
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 3000);
            }}
          >
            {copied ? (
              <CheckmarkIcon className="h-4 w-4" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </Flex>
      </Flex>

      <Flex className="mb-2 w-full flex-col gap-3">
        {connector?.id === 'sequence' && (
          <Button
            className="w-full justify-start"
            variant="secondary"
            onClick={openWalletSequence}
          >
            <WalletIcon />
            Open Wallet
          </Button>
        )}

        <button
          className="w-full justify-center bg-white text-[#DC5378] text-2xl font-main rounded-[2.6875rem] h-14 hover:opacity-70 transition-all transition-duration-200"
          onClick={onDisconnectClick}
        >
          {/* <DisconnectIcon /> */}
          Disconnect
        </button>
      </Flex>
    </>
  );
};
