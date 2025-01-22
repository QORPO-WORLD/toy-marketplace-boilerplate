'use client';

import { Box, Flex, cn } from '$ui';
import Banner from '../../../components/ui/Banner/Banner';
import FAQBox from '../../../components/ui/FAQBox/FAQBox';
import FlipCard from '../../../components/ui/FlipCard/FlipCard';
import MobileSwiper from '../../../components/ui/MobileSwiper/MobileSwiper';
import NFTCard from '../../../components/ui/NFTCard/NFTCard';
import { CollectionsEnum } from '../../../enum/enum';
import {
  fromLeft,
  fromRightStaged,
  fromTop,
  nftCard1,
  nftCard2,
  nftCard3,
  nftCard4,
  opacity,
  rotate,
  useAnimation,
} from '../../../hooks/ui/useAnimation';
import { useFlip } from '../../../hooks/ui/useFlip';
import { FAQData } from '../../../mockdata/FAQData';
import { flipCardData } from '../../../mockdata/flipCardData';
import { nftCardData } from '../../../mockdata/nftCardData';
import { LandingCollections } from '../Grid/Collections';
import { BannerImage } from '../Hero/BannerImage';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const FloatingBanner = ({ collections }: MarketplaceConfig) => {
  const animationFromLeft1 = useAnimation(fromLeft);
  const animationFromLeft2 = useAnimation(fromLeft);
  const animationFromLeft4 = useAnimation(fromLeft);
  const animationFromLeft5 = useAnimation(fromLeft);
  const animationFromTop = useAnimation(fromTop);
  const animationFromRight = useAnimation(fromRightStaged);
  const card1Animation = useAnimation(nftCard1);
  const card2Animation = useAnimation(nftCard2);
  const card3Animation = useAnimation(nftCard3);
  const card4Animation = useAnimation(nftCard4);
  const card5Animation = useAnimation(nftCard1);
  const rotateAnimation = useAnimation(rotate);
  const opacityAnimation = useAnimation(opacity);
  const fromRightStagedAnimation1 = useAnimation(fromRightStaged);
  const fromRightStagedAnimation2 = useAnimation(fromRightStaged);
  const flip1 = useFlip();
  const flip2 = useFlip();
  const findCollection = (collectionAddress: string) => {
    return collections.find(
      (c) =>
        c.collectionAddress.toLocaleLowerCase() ===
        collectionAddress.toLocaleLowerCase(),
    );
  };

  return (
    <Flex
      className={cn(
        'mx-auto mb-16 h-full w-full flex-col gap-28 mb:overflow-x-hidden',
      )}
    >
      <BannerImage logo>
        <div className="flex flex-col h-full z-10 relative mb:h-auto">
          <div ref={animationFromLeft1} className="pt-[8rem]">
            <p className="title text-white text-center">check our</p>
            <p className="title text-yellow text-center">collections</p>
          </div>
          <div
            ref={rotateAnimation}
            className="flex justify-center items-center bg-[#DE5578] rounded-md w-fit m-auto px-4 py-2"
          >
            <img className="w-24" src="/market/icons/toy-logo.svg" alt="logo" />
            <p className="text-[#E7E6FB] text-4xl">TESTNET</p>
          </div>
          <div className="flex h-full items-end justify-center translate-x-[-2rem] translate-y-[5rem] mb:hidden">
            <div ref={card1Animation}>
              <NFTCard
                data={nftCardData[0]!}
                className="h-[39rem] w-auto bg-[#E7E6FB] rotate-[-15deg]"
              />
            </div>
            <div ref={card2Animation} className="z-10">
              <NFTCard
                data={nftCardData[1]!}
                className="h-[39rem] w-auto bg-[#FBF2DD]  z-10 rotate-[25deg]"
              />
            </div>
            <div ref={card3Animation}>
              <NFTCard
                data={nftCardData[2]!}
                className="h-[39rem] w-auto bg-[#E7E6FB]  rotate-[5.5deg]"
              />
            </div>
            <div ref={card4Animation}>
              <NFTCard
                data={nftCardData[3]!}
                className="h-[39rem] w-auto bg-[#FBF2DD] rotate-[-23deg]"
              />
            </div>
          </div>
          <div className="w-full hidden mb:block translate-x-6">
            <div ref={card5Animation}>
              <NFTCard
                data={nftCardData[0]!}
                className="h-[31rem] w-auto bg-[#E7E6FB]  rotate-[-15deg]"
              />
            </div>
          </div>
        </div>
      </BannerImage>
      <div className="px-20 mb:px-0 flex flex-col gap-20">
        <div className="px-5 w-full overflow-hidden mb:overflow-visible">
          <p
            ref={animationFromLeft2}
            className="title text-start text-white mb-9"
          >
            Our benefits
          </p>
          <div
            ref={fromRightStagedAnimation1}
            className="h-[31.5rem] flex justify-between gap-5 pb-4 mb:hidden"
          >
            <FlipCard data={flipCardData[0]!} color="#A3EAFA" />
            <FlipCard data={flipCardData[1]!} color="#F3FAA3" />
            <FlipCard data={flipCardData[2]!} color="#FAA3A9" />
            <FlipCard data={flipCardData[3]!} color="#7795FF" />
          </div>
          <div
            ref={animationFromRight}
            className="w-full relative hidden mb:block"
          >
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
          <p
            ref={animationFromLeft4}
            className="title text-white text-start leading-none mb-8"
          >
            our <br /> collections
          </p>
          <div className="flex flex-col gap-10">
            {findCollection(
              CollectionsEnum.FOUNDERS_COLLECTION_CITIZEN_ZERO,
            ) && (
              <div ref={animationFromTop}>
                <div ref={flip1}>
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
                </div>
              </div>
            )}
            <LandingCollections
              collections={[
                findCollection(CollectionsEnum.HEROES_VARIANT),
                findCollection(CollectionsEnum.WEAPON_VARIANTS),
              ].filter((c) => !!c)}
            />
            {findCollection(CollectionsEnum.ANEEMATE_GENESIS_ZERO) && (
              <div ref={opacityAnimation}>
                <div ref={flip2}>
                  <Banner
                    title="Aneemate genesis"
                    title2="zero"
                    bgSrc="/market/images/banner/anmt-banner-bg.png"
                    collection={
                      findCollection(CollectionsEnum.ANEEMATE_GENESIS_ZERO)!
                    }
                  />
                </div>
              </div>
            )}
            <LandingCollections
              collections={[
                findCollection(CollectionsEnum.SHARDS),
                findCollection(CollectionsEnum.LOOT_BOXES),
                findCollection(CollectionsEnum.COSMETICS),
              ].filter((c) => !!c)}
            />
          </div>
        </Box>
        <Box className="mx-auto w-full px-5 pb-20">
          <p
            ref={animationFromLeft5}
            className="title text-white text-left mb-8"
          >
            FAQ
          </p>
          <div ref={fromRightStagedAnimation2} className="flex flex-col gap-4">
            {FAQData.map((faq) => (
              <FAQBox
                question={faq.question}
                answer={faq.answer}
                key={faq.answer}
              />
            ))}
          </div>
        </Box>
      </div>
    </Flex>
  );
};
