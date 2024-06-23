'use client';

import { DEFAULT_NETWORK } from '~/config/consts';

import { Button } from 'system';
import { useSwitchChain } from 'wagmi';

interface Props {
  targetChainId: number | undefined;
}

export const NetworkSwitchButton = ({ targetChainId }: Props) => {
  const { switchChain } = useSwitchChain();

  return (
    <Button
      className="w-full"
      label={'SWITCH NETWORK'}
      onClick={() => switchChain({ chainId: targetChainId ?? DEFAULT_NETWORK })}
    />
  );
};
