import { Logo } from '~/components/Logo';
import { getMarketConfig } from '~/config/marketplace';

import Link from 'next/link';

export function HeaderLogo() {
  return (
    <Link
      prefetch={false}
      href="/"
      className="my-auto flex items-center text-xl font-bold text-foreground/90"
    >
      <Logo />
    </Link>
  );
}
