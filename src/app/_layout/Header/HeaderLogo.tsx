import { Logo } from '~/components/Logo';
import { getMarketConfig } from '~/config/marketplace';
import { truncateAtMiddle } from '~/lib/utils/helpers';

import Link from 'next/link';

export async function HeaderLogo() {
  const marketConfig = await getMarketConfig();
  return (
    <Link
      prefetch={false}
      href="/"
      className="my-auto flex items-center text-xl font-bold text-foreground/90"
    >
      {!marketConfig.logoUrl && marketConfig.title ? (
        truncateAtMiddle(marketConfig.title, 20)
      ) : (
        <Logo
          logoUrl={marketConfig.logoUrl}
          className="h-[calc(var(--headerHeight)-10px)] md:max-h-full"
        />
      )}
    </Link>
  );
}
