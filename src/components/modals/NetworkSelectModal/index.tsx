'use client';

import { Box } from '$ui';
import { getChainLogo } from '../../../lib/utils/helpers';
import { useChain } from '@0xsequence/kit';
import clsx from 'clsx';
import Image from 'next/image';
import { useAccount, useSwitchChain } from 'wagmi';

export const NetworkSelectModalContent = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const { chains, switchChainAsync } = useSwitchChain();
  const { chainId } = useAccount();

  console.log(chains, chainId);

  const connectedChain = useChain();

  const onClickNetwork = async (chainId: number) => {
    try {
      await switchChainAsync({ chainId });
      if (onClose) onClose();
    } catch (err) {
      console.error('failed to switch network', err);
    }
  };

  const getChainName = (chain: string) => {
    if (chain === 'TOY (Testnet)') {
      return 'TOY CHAIN (Testnet)';
    }
    return chain;
  };
  console.log(chains, connectedChain);
  return (
    <div className="flex flex-col gap-[2.44rem] text-white font-main px-6">
      <p className="text-[2.25rem]">switch network</p>
      <div className="flex flex-col ">
        {chains.map((chain) => (
          <div
            className="flex gap-5 items-center cursor-pointer hover:bg-opacity-black p-4 rounded-[0.5rem]"
            key={chain.id}
            onClick={() => onClickNetwork(chain.id)}
          >
            <Image
              className="w-[3.625rem] aspect-square"
              src={getChainLogo(chain.id)}
              alt={chain.name}
              width={50}
              height={50}
            />
            <p className="text-[2rem] truncate">{getChainName(chain.name)}</p>

            <Box
              className={clsx(
                'h-[0.75rem] aspect-square rounded-full bg-success ml-auto',
                { 'opacity-0': chain.id !== connectedChain?.id },
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
