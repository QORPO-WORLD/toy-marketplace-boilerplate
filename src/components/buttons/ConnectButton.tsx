'use client';

import type { ComponentProps } from 'react';

import { Button } from '$ui';
import styles from './ConnectButton.module.scss';
import { useOpenConnectModal } from '@0xsequence/kit';
import { useAccount } from 'wagmi';

export const ConnectButton = ({
  onClick,
}: {
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: ComponentProps<typeof Button>['size'];
}) => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { address } = useAccount();

  if (address) return null;

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenConnectModal(true);
    onClick?.(e);
  };
  console.log(window.innerHeight);

  return (
    <button type="button" className={styles.wallet} onClick={handleOnClick}>
      {window.innerWidth > 768 ? 'Connect the TOY wallet' : 'Connect wallet'}
    </button>
  );
};
