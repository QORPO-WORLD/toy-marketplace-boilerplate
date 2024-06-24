import { getMarketConfig } from '~/config/marketplace';

import CollectionView from './_components/View';

const Page = async () => {
  return <CollectionView whitelabelProps={await getMarketConfig()} />;
};

export default Page;

export const runtime = 'edge';
