import { classNames } from '~/config/classNames';
import { ssrClient } from '~/config/marketplace-sdk/ssr';
import '~/styles/globals.scss';

import { cn } from '$ui';
import { Layout } from './_layout';
import Providers from './_providers';
import type { Metadata } from 'next';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getInitialState, getMarketplaceConfig, config } = ssrClient();
  const { fontUrl, cssString, faviconUrl } = await getMarketplaceConfig();
  const initialState = await getInitialState();

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        {fontUrl ? <link href={fontUrl} rel="stylesheet" /> : null}
        <style>{cssString}</style>
      </head>
      <body className={cn(classNames.themeManager, 'bg-[#CBBFD0]')}>
        <Providers sdkInitialState={initialState} sdkConfig={config}>
          <Layout>{children}</Layout>
        </Providers>
        <svg className="svg-path">
          <clipPath id="nft-card-clip-path" clipPathUnits="objectBoundingBox">
            <path d="M0.298,0.001 L0.137,0.001 C0.061,0.001,0,0.042,0,0.093 L0,0.91 C0,0.96,0.061,1,0.137,1 H0.863 C0.939,1,1,0.96,1,0.91 V0.093 C1,0.042,0.939,0.001,0.863,0.001 L0.702,0.001 L0.694,0.002 C0.676,0.004,0.659,0.009,0.644,0.017 L0.627,0.025 C0.606,0.036,0.581,0.041,0.556,0.041 H0.444 C0.419,0.041,0.394,0.036,0.373,0.025 L0.356,0.017 C0.341,0.009,0.324,0.004,0.306,0.002 L0.298,0.001"></path>
          </clipPath>
        </svg>
      </body>
    </html>
  );
}

export const generateMetadata = async (): Promise<Metadata> => {
  const { getMarketplaceConfig } = ssrClient();
  const marketplaceConfig = await getMarketplaceConfig();
  return {
    title: {
      template: marketplaceConfig.titleTemplate ?? '%s',
      default: marketplaceConfig.title ?? '',
    },
    description: marketplaceConfig.shortDescription ?? '',
    manifest: marketplaceConfig.manifestUrl,
    twitter: {
      card: 'summary_large_image',
    },
    openGraph: {
      type: 'website',
      title: marketplaceConfig.title ?? '',
      description: marketplaceConfig.shortDescription ?? '',
      images: [
        {
          url: marketplaceConfig.ogImage ?? '',
          alt: marketplaceConfig.title,
        },
      ],
    },
    appleWebApp: {
      title: marketplaceConfig.title,
      statusBarStyle: 'default',
    },
  };
};

export const runtime = 'edge';
