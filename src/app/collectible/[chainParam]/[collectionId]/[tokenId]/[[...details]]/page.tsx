'use client';

import ENSName from '../../../../../../components/ENSName';
import { getChain } from '../../../../../../lib/utils/getChain';
import {
  getCollectionLogo,
  getTag,
  setMarketPlaceLogo,
} from '../../../../../../lib/utils/helpers';
import { BannerImage } from '../../../../../_landing/Hero/BannerImage';
import { CollectibleTradeActions } from '../_components/Actions';
import { useCollectableData } from '../_hooks/useCollectableData';
import { CollectibleImage } from './_components/Image';
import { LinkIcon } from '@0xsequence/design-system';
import { useFloorOrder } from '@0xsequence/marketplace-sdk/react';
import Image from 'next/image';

export default function Page() {
  const {
    collectibleMetadata,
    collectionId,
    chainId,
    collectionMetadata,
    tokenId,
  } = useCollectableData();

  const { data: collectionDataOrder } = useFloorOrder({
    chainId: String(chainId),
    collectionAddress: collectionId,
  });

  const { data } = collectibleMetadata;

  const explorerUrl = getChain(chainId)?.blockExplorer?.rootUrl;

  return (
    <>
      <BannerImage logo={false}>
        <div className="pt-[11.0625rem] flex px-[11.1875rem] gap-[1.3125rem] mb:flex-col mb:px-4 mb:pt-[123px] pb-8">
          <div className="flex flex-col gap-[1.625rem] w-[37.384412153%] shrink-0 mb:w-full">
            <CollectibleImage
              id={collectibleMetadata.data?.tokenId}
              src={collectibleMetadata.data?.image}
              loading={collectibleMetadata.isLoading}
              animationSrc={collectibleMetadata.data?.animation_url}
            />
            <p className="text-white font-DMSans text-[16px] font-semibold leading-[207%] mb:hidden">
              {collectibleMetadata.data?.description}
            </p>
          </div>
          <div className="w-full flex flex-col gap-5">
            <div className="py-4 px-5 bg-white rounded-[1.5rem] flex items-center gap-[0.65rem] w-full">
              <img
                className="drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[2.6rem] h-[2.6rem] rounded-full block"
                src={getCollectionLogo(collectionId)}
                alt="logo"
                loading="lazy"
              />
              <div className="flex gap-[0.6rem] overflow-hidden">
                <div>
                  <p className="text-[2rem] uppercase truncate leading-none">
                    {collectionMetadata.data?.name}
                  </p>
                  <p className="text-[#483F50] font-DMSans text-[16px] font-normal leading-[103.45%]">
                    {getTag(collectionId)}
                  </p>
                </div>
                <img
                  className="w-[1.5rem] h-[1.5rem] block translate-y-1"
                  src="/market/icons/shield-icon.svg"
                  alt="ethereum"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex flex-col w-full  py-[1.75rem] px-[2.5625rem] gap-10 rounded-[25px] border border-white bg-[rgba(87,77,95,0.80)] backdrop-blur-[10px]">
              <p className="text-[2rem] font-normal leading-[86.94%] uppercase text-white mb:text-[20px]">
                {data?.name}
              </p>
              {/* <div>
              <div>
                <p className="font-DMSans text-[16px] capitalize leading-[103.45%] text-white font-bold">
                  Price
                </p>
                <div>
                  <p className="">
                    {lowestListing?.order?.priceAmountFormatted} TOY
                  </p>
                </div>
              </div>
            </div> */}
              {collectionDataOrder?.order?.marketplace && (
                <div className="flex items-center gap-[0.5625rem]">
                  {setMarketPlaceLogo(
                    collectionDataOrder?.order?.marketplace,
                  ) && (
                    <Image
                      className="rounded-full w-[31px] aspect-square"
                      src={setMarketPlaceLogo(
                        collectionDataOrder?.order?.marketplace,
                      )}
                      width={22}
                      height={22}
                      alt={collectionDataOrder?.order?.marketplace || ''}
                    />
                  )}
                  <p className="font-DMSans text-[16px] capitalize leading-[103.45%] text-white">
                    {collectionDataOrder?.order?.marketplace ===
                    'sequence_marketplace_v2'
                      ? 'Sequence marketplace'
                      : collectionDataOrder?.order?.marketplace}
                  </p>
                </div>
              )}
              <div className="mb:hidden">
                <CollectibleTradeActions
                  chainId={chainId}
                  collectionAddress={collectionId}
                  tokenId={tokenId}
                />
              </div>
            </div>
            <div className=" hidden mb:block">
              <CollectibleTradeActions
                chainId={chainId}
                collectionAddress={collectionId}
                tokenId={tokenId}
              />
            </div>
            <div className="flex flex-col w-full  py-[1.75rem] px-[2.5625rem] rounded-[25px] border border-white bg-main-gradient backdrop-blur-[10px] text-white text-[16px] leading-[2.07]">
              <div className="flex items-center justify-between">
                <p>Collection ID:</p>
                <a
                  className="flex items-center gap-2"
                  href={`${explorerUrl}address/${collectionId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkIcon />
                  <ENSName address={collectionId} truncateAt={5} />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <p>Token ID:</p>
                <p>{data?.tokenId}</p>
              </div>
            </div>
          </div>
        </div>
      </BannerImage>
      <div className="p-4 pb-6 pt-6 mb:block hidden">
        <div className="flex flex-col gap-4">
          <p className="title text-white text-start">Item description</p>
          <div className="rounded-[20px] bg-[#483F51] backdrop-blur-[10px] p-4">
            <p className="text-white font-DMSans text-[16px] font-semibold leading-[207%]">
              {collectibleMetadata.data?.description}
            </p>
          </div>
        </div>
      </div>
      <div className="p-[11.1875rem] pb-52 pt-6 mb:p-4 mb:pb-16">
        <p className="text-white font-main text-[1.5rem] font-normal uppercase mb-5  title mb:text-[32px] mb:font-normal mb:uppercase text-start">
          Asset properties
        </p>
        <ul className="flex gap-[0.8125rem] mb:flex-col">
          {data?.attributes.map((attribute, index) => (
            <li
              className="flex-1 w-full py-2 px-5 rounded-[1.25rem] border border-[#403545] bg-[#4035451A] backdrop-blur-[0.625rem]"
              key={index}
            >
              <p className="text-white font-DMSans text-[1rem] font-semibold leading-normal">
                {attribute.trait_type}
              </p>
              <p className="text-white font-main text-[1.5rem] font-normal leading-normal uppercase">
                {attribute.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const runtime = 'edge';
