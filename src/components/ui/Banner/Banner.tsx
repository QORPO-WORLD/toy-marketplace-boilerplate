'use client';

import { Routes } from '../../../lib/routes';
import CollectionBadge from '../CollectionBadge/CollectionBadge';
import { MarketplaceConfig } from '@0xsequence/marketplace-sdk';
import { useCollection } from '@0xsequence/marketplace-sdk/react';
import Image from 'next/image';
import NextLink from 'next/link';

interface BannerProps {
  bgSrc: string;
  title: string;
  title2: string;
  collection: MarketplaceConfig['collections'][0];
}

function Banner({ bgSrc, title, title2, collection }: BannerProps) {
  const { chainId, collectionAddress } = collection;
  const { data } = useCollection({
    chainId,
    collectionAddress,
  });

  return (
    <NextLink
      href={Routes.collection({
        chainParam: chainId,
        collectionId: collectionAddress,
        mode: 'buy',
      })}
    >
      <div
        className="h-[45rem] p-12 bg-top bg-cover rounded-[1.6rem] flex items-end justify-start mb:flex-col-reverse mb:p-4 mb:pb-8 mb:items-center mb:gap-4"
        style={{
          backgroundImage: `url(${bgSrc})`,
        }}
      >
        <div className="">
          <p className="title text-[6rem] text-white leading-none mb:text-[40px]">
            {title}
          </p>
          <div className="flex items-center gap-3 flex-wrap mb:justify-center">
            <p className="title text-[6rem] text-white leading-none mb:text-[40px]">
              {title2}
            </p>
            <Image
              className="w-[3.125rem] h-[3.86rem] mb:hidden"
              src="/market/icons/shield-icon.svg"
              width={3}
              height={4}
              alt="shield"
            />
          </div>
        </div>
        {data && <CollectionBadge collectionData={data} />}
      </div>
    </NextLink>
  );
}

export default Banner;
