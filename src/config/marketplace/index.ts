import { env } from '~/env';

import { builderMarketplaceApi } from '../consts';
import { MarketConfigSchema } from './schema';
import { type z } from 'zod';

export type MarketConfig = z.infer<typeof MarketConfigSchema> & {
  cssString: string;
  manifestUrl: string;
  origin: string;
};

const domain = env.NEXT_PUBLIC_DOMAIN;
const hostname = new URL(domain).hostname;
const endpoint = builderMarketplaceApi() + hostname;

const fetchConfig = async () => {
  const response = await fetch(`${endpoint}/config.json`);
  return MarketConfigSchema.parse(await response.json());
};

const fetchStyles = async () => {
  const response = await fetch(`${endpoint}/styles.css`);
  const styles = await response.text();
  // React sanitizes this string, so we need to remove all quotes, they are not needed anyway
  return styles.replaceAll(/['"]/g, '');
};

export const getMarketConfig = async (): Promise<MarketConfig> => {
  const [config, cssString] = await Promise.all([fetchConfig(), fetchStyles()]);

  return {
    ...config,
    cssString,
    manifestUrl: `${endpoint}/manifest.json`,
    origin: domain,
  };
};
