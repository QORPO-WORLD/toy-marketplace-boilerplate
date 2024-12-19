import { Flex, cn } from '$ui';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import { Description } from '../Hero/Description';
import { Socials } from '../Hero/Socials';
import { Title } from '../Hero/Title';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';

export const DefaultLayout = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
}: MarketplaceConfig) => {
  return (
    <Flex
      className={cn(
        'mx-auto my-16 h-full w-full max-w-[1200px] flex-col gap-16 px-4',
      )}
    >
      <Flex className="min-h-[120px] flex-col gap-4 md:flex-row">
      <BannerImage>
        <p className=''>check our</p>
        <p>collections</p>
        </BannerImage>
        {landingBannerUrl ? (
          <Flex className="flex-col gap-2">
            <Flex className="items-center justify-between">
              <Title title={title} className="ellipsis-unset" />
              <Socials socials={socials} className="hidden md:flex" />
            </Flex>
            <Description description={shortDescription} />
            <Socials socials={socials} className="md:hidden" />
          </Flex>
        ) : null}
      </Flex>
      <LandingCollections collections={collections} />
    </Flex>
  );
};
