// import { defaultPlatformFeePercentage } from "~/config/consts";
import { type MarketConfig } from '~/config/marketplace';

import { observable } from '@legendapp/state';

export const marketConfig$ = observable<MarketConfig>();

// interface ConfigState {
//   MarketConfig?: Partial<MarketConfig>;
//   collectionFeePercentageMap: Map<string, number>;
// }

// export const setMarketConfig = (config: MarketConfig) => {
//   if (configState.MarketConfig) {
//     configState.MarketConfig = {
//       ...configState.MarketConfig,
//       ...config,
//     };
//   } else {
//     configState.MarketConfig = config;
//   }

//   if (config.collections?.length) {
//     for (const collectionConfig of config.collections) {
//       configState.collectionFeePercentageMap.set(
//         collectionConfig.collectionAddress.toLowerCase(),
//         collectionConfig.marketplaceFeePercentage,
//       );
//     }
//   }
// };

// export const getMarketplaceCurrencyOptions = (
//   chainId: number,
//   collectionAddress: string,
// ): string[] => {
//   return (
//     configState.MarketConfig?.collections?.find(
//       (c) =>
//         c.collectionAddress.toLowerCase() === collectionAddress.toLowerCase() &&
//         c.chainId === chainId,
//     )?.currencyOptions ?? []
//   );
// };

// export const getMarketplaceFeeBasis = (
//   collectionAddress: string | undefined,
// ) => {
//   return getMarketplaceFeePercentage(collectionAddress) * 100;
// };

// export const configState = proxy<ConfigState>({
//   MarketConfig: undefined,
//   collectionFeePercentageMap: new Map(),
// });
