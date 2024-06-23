import { z } from "zod";

export const MarketConfigSchema = z.object({
  hasCustomConfig: z.boolean().optional(),
  dormantMarketplaceDomain: z.boolean().optional(),
  projectId: z.number(), // builder project Id
  publisherId: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  socials: z
    .object({
      twitter: z.string().optional(),
      website: z.string().optional(),
      discord: z.string().optional(),
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  faviconUrl: z.string(),
  landingBannerUrl: z.string(),
  logoUrl: z.string().optional(),
  fontUrl: z.string().optional(),
  ogImage: z.string().optional(),
  titleTemplate: z.string(),
  disableLiquidityProviderTools: z.boolean().optional(),
  walletOptions: z.array(
    z.enum([
      "sequence",
      "metamask",
      "walletconnect",
      "coinbase",
      "injected",
      "ledger",
    ]),
  ),
  collections: z.array(
    z.object({
      collectionAddress: z.string(),
      chainId: z.number(),
      exchanges: z.array(z.string()).optional(),
      marketplaceFeePercentage: z.number(),
      bannerUrl: z.string().optional(),
      currencyOptions: z.array(z.string()).optional(),
    }),
  ),
  landingPageLayout: z.union([
    z.literal("default"),
    z.literal("big_left_banner"),
    z.literal("floating_header"),
  ]),
});
