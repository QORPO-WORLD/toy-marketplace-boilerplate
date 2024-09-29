import { type MarketplaceConfig } from '@0xsequence/marketplace-sdk';

import { observable } from '@legendapp/state';

export const marketplaceConfig$ = observable<MarketplaceConfig>();
