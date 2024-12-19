'use client';

import { Box, Flex, cn } from '$ui';
import Banner from '../../../components/ui/Banner/Banner';
import FAQBox from '../../../components/ui/FAQBox/FAQBox';
import FlipCard from '../../../components/ui/FlipCard/FlipCard';
import MobileSwiper from '../../../components/ui/MobileSwiper/MobileSwiper';
import NFTCard from '../../../components/ui/NFTCard/NFTCard';
import { CollectionsEnum } from '../../../enum/enum';
import { flipCardData } from '../../../mockdata/flipCardData';
import { nftCardData } from '../../../mockdata/nftCardData';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { motion } from 'framer-motion';

export const FloatingBanner = ({
  collections,
  landingBannerUrl,
  socials,
  title,
  shortDescription,
  logoUrl,
}: MarketplaceConfig) => {
  const findCollection = (collectionAddress: string) => {
    return collections.find((c) => c.collectionAddress === collectionAddress);
  };

  return (
    <Flex className={cn('mx-auto mb-16 h-full w-full flex-col gap-28')}>
      <BannerImage logo>
        <div className="flex flex-col h-full z-10 relative mb:overflow-hidden">
          <div className="pt-[8rem]">
            <p className="title text-white text-center">check our</p>
            <p className="title text-yellow text-center">collections</p>
          </div>
          <div className="flex h-full items-end justify-center translate-x-[-2rem] mb:hidden">
            <motion.div
              initial={{ transform: 'translate(-70%, -150%)' }}
              animate={{ transform: 'translate(8rem, 2.5rem)' }}
              transition={{ type: 'spring', duration: 1.5, delay: 0.5 }}
            >
              <NFTCard
                data={nftCardData[0]!}
                className="h-[39rem] w-auto bg-[#E7E6FB] rotate-[-15deg]"
              />
            </motion.div>
            <motion.div
              className="z-10"
              initial={{ transform: 'translate(70%, -150%)' }}
              animate={{ transform: 'translate(4rem, 7rem)' }}
              transition={{ type: 'spring', duration: 1.5, delay: 0.75 }}
            >
              <NFTCard
                data={nftCardData[1]!}
                className="h-[39rem] w-auto bg-[#FBF2DD]  z-10 rotate-[25deg]"
              />
            </motion.div>
            <motion.div
              initial={{ transform: 'translate(25%, -150%)' }}
              animate={{ transform: 'translate(-4rem, -2rem)' }}
              transition={{ type: 'spring', duration: 1.5, delay: 1.25 }}
            >
              <NFTCard
                data={nftCardData[2]!}
                className="h-[39rem] w-auto bg-[#E7E6FB]  rotate-[5.5deg]"
              />
            </motion.div>
            <motion.div
              initial={{ transform: 'translate(-70%, -150%)' }}
              animate={{ transform: 'translate(-8rem, 7rem)' }}
              transition={{ type: 'spring', duration: 1.5, delay: 1.75 }}
            >
              <NFTCard
                data={nftCardData[3]!}
                className="h-[39rem] w-auto bg-[#FBF2DD] rotate-[-23deg]"
              />
            </motion.div>
          </div>
          <div className="w-full hidden mb:block">
            <motion.div
              initial={{ transform: 'translate(-70%, -150%)' }}
              animate={{ transform: 'translate(4rem, 2.5rem)' }}
              transition={{ type: 'spring', duration: 1.5 }}
            >
              <NFTCard
                data={nftCardData[0]!}
                className="h-[31rem] w-auto bg-[#E7E6FB]  rotate-[-15deg]"
              />
            </motion.div>
          </div>
        </div>
      </BannerImage>
      <div className="px-5 w-full overflow-hidden mb:overflow-visible">
        <p className="title text-start text-white mb-9">Our benefits</p>
        <div className="h-[31.5rem] flex justify-between gap-5 pb-4 mb:hidden">
          <FlipCard data={flipCardData[0]!} color="#A3EAFA" />
          <FlipCard data={flipCardData[1]!} color="#F3FAA3" />
          <FlipCard data={flipCardData[2]!} color="#FAA3A9" />
          <FlipCard data={flipCardData[3]!} color="#7795FF" />
        </div>
        <div className="w-full relative hidden mb:block">
          <MobileSwiper
            arrOfComponents={[
              <FlipCard key={1} data={flipCardData[0]!} color="#A3EAFA" />,
              <FlipCard key={2} data={flipCardData[1]!} color="#F3FAA3" />,
              <FlipCard key={3} data={flipCardData[2]!} color="#FAA3A9" />,
              <FlipCard key={4} data={flipCardData[3]!} color="#7795FF" />,
            ]}
          />
        </div>
      </div>
      <Box className="mx-auto w-full px-5">
        <p className="title text-white text-start leading-none mb-8">
          our <br /> collections
        </p>
        <div className="flex flex-col gap-10">
          {findCollection(CollectionsEnum.FOUNDERS_COLLECTION_CITIZEN_ZERO) && (
            <Banner
              title="Founders’ collection"
              title2="Citizen Zero"
              bgSrc="/market/images/banner/cc-banner-bg.png"
              collection={
                findCollection(
                  CollectionsEnum.FOUNDERS_COLLECTION_CITIZEN_ZERO,
                )!
              }
            />
          )}
          <LandingCollections
            collections={[
              findCollection(CollectionsEnum.HEROES_VARIANT)!,
              findCollection(CollectionsEnum.LOOT_BOXES)!,
              findCollection(CollectionsEnum.WEAPON_VARIANTS)!,
            ]}
          />
          {findCollection(CollectionsEnum.ANEEMATE_GENESIS_ZERO) && (
            <Banner
              title="Aneemate genesis"
              title2="zero"
              bgSrc="/market/images/banner/anmt-banner-bg.png"
              collection={
                findCollection(CollectionsEnum.ANEEMATE_GENESIS_ZERO)!
              }
            />
          )}
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
