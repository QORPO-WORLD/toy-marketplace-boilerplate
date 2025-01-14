import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
  ),
});

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['@0xsequence/marketplace-sdk'],
  basePath: '/market',
  assetPrefix: '/market/',
  reactStrictMode: true,
};

export default withVanillaExtract(config);
