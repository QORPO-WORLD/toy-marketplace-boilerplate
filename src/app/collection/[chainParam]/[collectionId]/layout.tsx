import { getMarketConfig } from '~/config/marketplace';
import { getChainId } from '~/config/networks';
import type { Routes } from '~/lib/routes';
import { compareAddress } from '~/lib/utils/helpers';

import CollectionBanner from './[mode]/_components/Banner';
import CollectionControls from './[mode]/_components/Controls';
import CollectionHeader from './[mode]/_components/Header';
import { CollectionViewPageLayout } from './[mode]/_components/Layout';
import { CollectionSidebar } from './[mode]/_components/Sidebar';

const Layout = async ({
  params: { chainParam, collectionId, mode },
  children,
}: {
  children: React.ReactNode;
  params: typeof Routes.collection.params;
}) => {
  const chainId = getChainId(chainParam)!;
  const marketConfig = await getMarketConfig();

  const collectionConfig = marketConfig.collections?.find(
    (c) =>
      compareAddress(c.collectionAddress, collectionId) && chainId == c.chainId,
  );

  return (
    <CollectionViewPageLayout
      collectionConfig={collectionConfig}
      banner={<CollectionBanner bannerUrl={collectionConfig?.bannerUrl} />}
      sidebar={
        <CollectionSidebar chainId={chainId} collectionAddress={collectionId} />
      }
      header={
        <CollectionHeader
          chainId={chainId}
          collectionAddress={collectionId}
          marketConfig={marketConfig}
        />
      }
      details={<></>}
      controls={
        <CollectionControls
          chainId={chainId}
          collectionId={collectionId}
          mode={mode}
        />
      }
      content={children}
    />
  );
};

export default Layout;

export const runtime = 'edge';
