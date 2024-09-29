import { Logo } from '~/components/Logo';
import { truncateAtMiddle } from '~/lib/utils/helpers';
import { ssrClient } from '~/sdk-config';

import Link from 'next/link';

export async function HeaderLogo() {
  const { getMarketplaceConfig } = ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();
  return (
    <Link
      prefetch={false}
      href="/"
      className="my-auto flex items-center text-xl font-bold text-foreground/90"
    >
      {!marketplaceConfig.logoUrl && marketplaceConfig.title ? (
        truncateAtMiddle(marketplaceConfig.title, 20)
      ) : (
        <Logo
          logoUrl={marketplaceConfig.logoUrl}
          className="h-[calc(var(--headerHeight)-10px)] md:max-h-full"
        />
      )}
    </Link>
  );
}
