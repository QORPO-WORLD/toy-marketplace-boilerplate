'use client';

import { Routes } from '~/lib/routes';

import { Button, CubeIcon } from '$ui';
import Link from 'next/link';

export function InventoryButton() {
  return (
    <Button asChild variant="muted" className="backdrop-blur">
      <Link href={Routes.inventory()}>
        <CubeIcon />
        <span className="hidden md:inline">Inventory</span>
      </Link>
    </Button>
  );
}
