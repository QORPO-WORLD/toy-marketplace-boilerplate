import { getMarketConfig } from '~/config/marketplace';
import { createWagmiConfig } from '~/config/networks/wagmi';

import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

const getWagmiCookieState = async () => {
  const marketConfig = await getMarketConfig();
  const wagmiConfig = createWagmiConfig(marketConfig);
  const headersList = headers();

  return cookieToInitialState(wagmiConfig, headersList.get('cookie'));
};

export default getWagmiCookieState;
