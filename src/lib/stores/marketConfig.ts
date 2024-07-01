import type { MarketConfig } from '~/config/marketplace';

import { observable } from '@legendapp/state';

export const marketConfig$ = observable<MarketConfig>();
