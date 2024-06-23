import { getMarketConfig } from '~/config/marketplace';

import { BigLeftBanner } from './_landing/layouts/BigLeftBanner';
import { DefaultLayout } from './_landing/layouts/DefaultLayout';
import { FloatingBanner } from './_landing/layouts/FloatingHeader';

const LandingPage = async () => {
  const marketConfig = await getMarketConfig();

  switch (marketConfig.landingPageLayout) {
    case 'floating_header': {
      return <FloatingBanner {...marketConfig} />;
    }
    case 'big_left_banner': {
      return <BigLeftBanner {...marketConfig} />;
    }
    case 'default': {
      return <DefaultLayout {...marketConfig} />;
    }
  }
};

export default LandingPage;

export const runtime = 'edge';
