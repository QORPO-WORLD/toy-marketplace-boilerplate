import { getMarketConfig } from '~/config/marketplace';
import '~/styles/globals.scss';
import { THEME_MANAGER_CLASSNAME } from '~/utils/theme';

import { cn } from '$ui';
import getWagmiCookieState from '../config/networks/wagmi/getWagmiCookie';
import { inter } from '../styles/fonts';
import { Layout } from './_layout';
import Providers from './_providers';
import type { Metadata } from 'next';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const marketConfig = await getMarketConfig();
  const wagmiInitState = await getWagmiCookieState();

  const { fontUrl, cssString, faviconUrl } = marketConfig;

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        {fontUrl ? <link href={fontUrl} rel="stylesheet" /> : null}
        <style>{cssString}</style>
      </head>
      <body className={cn(THEME_MANAGER_CLASSNAME, inter.className)}>
        <Providers wagmiInitState={wagmiInitState} marketConfig={marketConfig}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  const marketConfig = await getMarketConfig();
  return {
    title: {
      template: marketConfig.titleTemplate ?? '%s',
      default: marketConfig.title ?? '',
    },
    description: marketConfig.shortDescription ?? '',
    manifest: marketConfig.manifestUrl,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      type: 'website',
      title: marketConfig.title ?? '',
      description: marketConfig.shortDescription ?? '',
      images: [
        {
          url: marketConfig.ogImage ?? '',
          alt: marketConfig.title,
        },
      ],
    },
    appleWebApp: {
      title: marketConfig.title,
      statusBarStyle: 'default',
    },
  };
};
