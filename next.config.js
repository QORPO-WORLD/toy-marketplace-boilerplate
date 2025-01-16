import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@0xsequence/marketplace-sdk'],
  basePath: '/market',
  assetPrefix: '/market/',
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase from default
    },
  },
};

export default withVanillaExtract(config);
