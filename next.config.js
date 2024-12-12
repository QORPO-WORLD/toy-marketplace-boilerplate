import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

await import('./src/env.js');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@0xsequence/marketplace-sdk'],
  basePath: '/market'
};

export default withVanillaExtract(config);
