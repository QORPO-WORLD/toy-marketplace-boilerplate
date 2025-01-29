import { Logo } from '~/components/Logo';
import { ssrClient } from '~/config/marketplace-sdk/ssr';

import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link
      prefetch={false}
      href="https://playontoy.com"
      className="my-auto flex items-center text-xl font-bold text-foreground/90 shrink-0"
    >
      <Logo />
    </Link>
  );
}
