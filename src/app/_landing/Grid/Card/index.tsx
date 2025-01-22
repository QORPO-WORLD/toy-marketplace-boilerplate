'use client';

import { Suspense } from 'react';

import { Routes } from '~/lib/routes';
import { getCollectionLogo, getTag } from '~/lib/utils/helpers';

import { CollectionsEnum } from '../../../../enum/enum';
import {
  fromBottom,
  fromLeft,
  fromRight,
  fromTop,
  opacity,
  useAnimation,
} from '../../../../hooks/ui/useAnimation';
import { useFlip } from '../../../../hooks/ui/useFlip';
import { CollectionCardSkeleton } from './Skeleton';
import type { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { useCollection } from '@0xsequence/marketplace-sdk/react';
import NextLink from 'next/link';

type CollectionCard = MarketplaceConfig['collections'][number];

export const CollectionCard = (params: CollectionCard) => {
  const flip = useFlip(undefined, 22);
  return (
    <Suspense fallback={<CollectionCardSkeleton />}>
      <div ref={flip}>
        <Card {...params} />
      </div>
    </Suspense>
  );
};

const Card = ({ chainId, collectionAddress, bannerUrl }: CollectionCard) => {
  const { data } = useCollection({
    chainId,
    collectionAddress,
  });

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing

  const name = data?.name;

  const setBackGroundImage = (collectionAddress: `0x${string}`) => {
    switch (collectionAddress.toLocaleLowerCase() as CollectionsEnum) {
      case CollectionsEnum.WEAPON_VARIANTS:
        return 'url(/market/images/banner/weapon-variants-bg.png)';
      case CollectionsEnum.LOOT_BOXES:
        return 'url(/market/images/banner/loot-boxes-bg.png)';
      case CollectionsEnum.HEROES_VARIANT:
        return 'url(/market/images/banner/heroes-variants-bg.png)';
      case CollectionsEnum.COSMETICS:
        return 'url(/market/images/banner/cosmetics-bg.png)';
      case CollectionsEnum.SHARDS:
        return 'url(/market/images/banner/shards-bg.png)';
      default:
        return '';
    }
  };

  const getAnimation = (address: string) => {
    switch (address as CollectionsEnum) {
      case CollectionsEnum.WEAPON_VARIANTS:
        return fromRight;
      case CollectionsEnum.LOOT_BOXES:
        return opacity;
      case CollectionsEnum.HEROES_VARIANT:
        return fromLeft;
      case CollectionsEnum.COSMETICS:
        return fromRight;
      case CollectionsEnum.SHARDS:
        return fromLeft;
      default:
        return opacity;
    }
  };

  return (
    <NextLink
      href={Routes.collection({
        chainParam: chainId,
        collectionId: collectionAddress,
        mode: 'buy',
      })}
    >
      <div
        ref={useAnimation(getAnimation(collectionAddress))}
        className="w-full h-full bg-center bg-cover flex items-end p-[1.56rem] rounded-[1.5625rem] mb:h-[421px] mb:p-4"
        style={{ backgroundImage: setBackGroundImage(collectionAddress) }}
      >
        <div className="py-4 px-5 bg-white rounded-[1.5rem] flex items-center gap-[0.65rem] w-full mb:p-2">
          <img
            className="drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[2.6rem] h-[2.6rem] rounded-full block"
            src={getCollectionLogo(collectionAddress)}
            alt="logo"
            loading="lazy"
          />
          <div className="flex gap-[0.6rem] overflow-hidden">
            <div>
              <p className="text-[2rem] uppercase truncate leading-none mb:text-xl">
                {name}
              </p>
              <p className="text-[#483F50] font-DMSans text-[16px] font-normal leading-[103.45%]">
                {getTag(collectionAddress)}
              </p>
            </div>
            <img
              className="w-[1.5rem] h-[1.5rem] block translate-y-1"
              src="/market/icons/shield-icon.svg"
              alt="ethereum"
              loading="lazy"
            />
          </div>
          <div className="ml-auto w-[3.562rem] aspect-square rounded-full bg-[#E5FF03] flex items-center justify-center mb:hidden">
            <img
              className="w-[1.5rem] h-[1.5rem] block"
              src="/market/icons/cart-icon.svg"
              alt="ethereum"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </NextLink>
    // <Flex
    //   asChild
    //   className={cn(
    //     'relative flex flex-col rounded-md bg-foreground/10',
    //     'cursor-pointer transition-colors',
    //     'hover:threed-shadow-base hover:threed-shadow-primary focus:outline-none focus:threed-shadow-base focus:threed-shadow-primary active:threed-shadow-sm',
    //     'duration-300 animate-in fade-in',
    //   )}
    // >
    //   <NextLink
    //     href={Routes.collection({
    //       chainParam: chainId,
    //       collectionId: collectionAddress,
    //       mode: 'buy',
    //     })}
    //   >
    //     {isVideo(image) ? (
    //       <video
    //         autoPlay
    //         loop
    //         muted
    //         playsInline
    //         src={image}
    //         className="min-h-[60%] w-full flex-1 rounded-b-none object-cover"
    //       />
    //     ) : (
    //       <img
    //         src={image}
    //         alt={'banner'}
    //         className="min-h-[60%] flex-1 rounded-b-none object-cover"
    //       />
    //     )}

    //     <Flex className="h-full flex-col gap-2 p-3">
    //       <Flex className="items-center gap-2">
    //         <Avatar.Base size="sm">
    //           <Avatar.Image src={logoURI} alt={symbol} />

    //           <Avatar.Fallback>{(symbol || name)?.slice(0, 2)}</Avatar.Fallback>
    //         </Avatar.Base>

    //         <Text
    //           className="text-md font-semibold text-foreground max-lines-[1]"
    //           title={name}
    //         >
    //           {name}
    //         </Text>

    //         <NetworkIcon size="xs" chainId={chainId} />
    //       </Flex>

    //       <Text
    //         title={description}
    //         className="overflow-hidden text-sm font-medium text-foreground/50 max-lines-[3]"
    //       >
    //         {description}
    //       </Text>

    //       <ScrollArea.Base orientation="horizontal" className="mt-auto">
    //         <Flex
    //           className={cn(classNames.collectionHeaderBadges, 'mt-auto gap-2')}
    //         >
    //           {contractType && <Badge variant="muted">{contractType}</Badge>}
    //         </Flex>
    //       </ScrollArea.Base>
    //     </Flex>
    //   </NextLink>
    // </Flex>
  );
};
