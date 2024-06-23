'use client';

import { Routes } from '~/routes';

import Link from 'next/link';
import { Button, CubeIcon } from 'system';
import { useAccount } from 'wagmi';

export function InventoryButton() {
  const { address, isConnected, chainId } = useAccount();

  return (
    <Button asChild variant="muted" className="backdrop-blur">
      <Link
        href={Routes.inventory({
          address,
          isConnected,
          chainParam: chainId,
        })}
      >
        <CubeIcon />
        <span className="hidden md:inline">Inventory</span>
      </Link>
    </Button>
  );
}
