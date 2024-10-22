import { OverwriteCookie } from '~/dev/types';

import { config } from './config';
import { type Env } from '@0xsequence/marketplace-sdk';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { cookies, headers } from 'next/headers';

export const ssrClient = () => {
  const cookieJar = cookies();

  const headersList = headers();

  console.log('cookieJar', cookieJar);
  console.log('headersList', headersList);

  const projectId =
    cookieJar.get(OverwriteCookie.MARKETPLACE_PROJECT)?.value || '34598';
  // env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID;

  const marketplaceEnv = (cookieJar.get(OverwriteCookie.MARKETPLACE_ENV)
    ?.value || 'development') as Env;

  const builderEnv = (cookieJar.get(OverwriteCookie.BUILDER_ENV)?.value ||
    'production') as Env;

  const metadataEnv = (cookieJar.get(OverwriteCookie.METADATA_ENV)?.value ||
    'production') as Env;

  const indexerEnv = (cookieJar.get(OverwriteCookie.INDEXER_ENV)?.value ||
    'production') as Env;

  return createSSRClient({
    cookie: headersList.get('cookie') || '',
    config: {
      ...config,
      projectId,
      _internal: {
        devAccessKey: 'AQAAAAAAAALqQrVIDQd03id03-auO31aLwg',
        nextAccessKey: 'AQAAAAAAAIcmrjntYCvGTL15FFHVD2ic_dE',
        builderEnv,
        marketplaceEnv,
        metadataEnv,
        indexerEnv,
      },
    },
  });
};
