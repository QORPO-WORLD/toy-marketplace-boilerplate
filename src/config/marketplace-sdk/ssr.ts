import { config } from './config';
import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { headers } from 'next/headers';

export const ssrClient = async() => {
  const headersList = headers();

  return createSSRClient({
    cookie: headersList.get('cookie') || '',
    config: {
      ...config,
    },
  });
};
