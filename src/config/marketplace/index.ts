import { builderMarketplaceApi } from '../consts';
import { MarketConfigSchema } from './schema';
import { type z } from 'zod';

export type MarketConfig = z.infer<typeof MarketConfigSchema> & {
  cssString: string;
  manifestUrl: string;
};

const fetchConfig = async () => {
  const response = await fetch(`${builderMarketplaceApi()}/config.json`);
  if (!response.ok) {
    console.error(response);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new Error(`Failed to fetch marketplace config: ${response.msg}`);
  }

  return MarketConfigSchema.parse(await response.json());
};

const fetchStyles = async () => {
  const response = await fetch(`${builderMarketplaceApi()}/styles.css`);
  const styles = await response.text();
  // React sanitizes this string, so we need to remove all quotes, they are not needed anyway
  return styles.replaceAll(/['"]/g, '');
};

export const getMarketConfig = async (): Promise<MarketConfig> => {
  const [config, cssString] = await Promise.all([fetchConfig(), fetchStyles()]);

  return {
    ...config,
    cssString,
    manifestUrl: `${builderMarketplaceApi()}/manifest.json`,
  };
};
