import { Box, Flex, cn } from '$ui';
import Banner from '../../../components/ui/Banner/Banner';
import FAQBox from '../../../components/ui/FAQBox/FAQBox';
import FlipCard from '../../../components/ui/FlipCard/FlipCard';
import NFTCard from '../../../components/ui/NFTCard/NFTCard';
import { flipCardData } from '../../../mockdata/flipCardData';
import { nftCardData } from '../../../mockdata/nftCardData';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';

export const FloatingBanner = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
  logoUrl,
}: MarketplaceConfig) => {
  return (
    <Flex className={cn('mx-auto mb-16 h-full w-full flex-col gap-28')}>
      <BannerImage>
        <div className="flex flex-col h-full z-10 relative">
          <div className="pt-[8rem]">
            <p className="title text-white text-center">check our</p>
            <p className="title text-yellow text-center">collections</p>
          </div>
          <div className="flex h-full items-end justify-center translate-x-[-2rem]">
            <NFTCard
              data={nftCardData[0]!}
              className="h-[39rem] w-auto bg-[#E7E6FB] translate-x-[8rem] translate-y-10 rotate-[-15deg]"
            />
            <NFTCard
              data={nftCardData[1]!}
              className="h-[39rem] w-auto bg-[#FBF2DD] translate-x-[4rem] translate-y-28 z-10 rotate-[25deg]"
            />
            <NFTCard
              data={nftCardData[2]!}
              className="h-[39rem] w-auto bg-[#E7E6FB] translate-x-[-4rem] translate-y-[-2rem] rotate-[5.5deg]"
            />
            <NFTCard
              data={nftCardData[3]!}
              className="h-[39rem] w-auto bg-[#FBF2DD] translate-x-[-8rem] translate-y-28 rotate-[-23deg]"
            />
          </div>
        </div>
      </BannerImage>
      <div className="px-5 w-full overflow-hidden">
        <p className="title text-start text-white mb-9">Our benefits</p>
        <div className="h-[31.5rem] flex justify-between gap-5 pb-4">
          <FlipCard data={flipCardData[0]!} color="#A3EAFA" />
          <FlipCard data={flipCardData[1]!} color="#F3FAA3" />
          <FlipCard data={flipCardData[2]!} color="#FAA3A9" />
          <FlipCard data={flipCardData[3]!} color="#7795FF" />
        </div>
      </div>
      <Box className="mx-auto w-full px-5">
        <p className="title text-white text-start leading-none mb-8">
          our <br /> collections
        </p>
        <div className="flex flex-col gap-10">
          <Banner
            title="Founders’ collection"
            title2="Citizen Zero"
            bgSrc="/market/images/banner/cc-banner-bg.png"
          />
          <LandingCollections collections={collections.slice(0, 2) || []} />
          <Banner
            title="Aneemate genesis"
            title2="zero"
            bgSrc="/market/images/banner/anmt-banner-bg.png"
          />
          <LandingCollections collections={collections.slice(2, 5) || []} />
        </div>
      </Box>
      <Box className="mx-auto w-full px-5 pb-20">
        <p className="title text-white text-left mb-8">FAQ</p>
        <div className="flex flex-col gap-4">
          <FAQBox />
          <FAQBox />
          <FAQBox />
          <FAQBox />
          <FAQBox />
        </div>
      </Box>
    </Flex>
  );
};
