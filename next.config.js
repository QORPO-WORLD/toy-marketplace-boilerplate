import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@0xsequence/marketplace-sdk'],
  basePath: '/market',
  assetPrefix: '/market/',
  reactStrictMode: true,
};

export default withVanillaExtract(config);
