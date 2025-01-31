'use client';

import { useEffect, useState } from 'react';

import ENSName from '../../../../../../components/ENSName';
import { Routes } from '../../../../../../lib/routes';
import { getChain } from '../../../../../../lib/utils/getChain';
import {
  getCollectionLogo,
  getCurrencyByChainId,
  getCurrencyLogoByChainId,
  getTag,
  setMarketPlaceLogo,
} from '../../../../../../lib/utils/helpers';
import { BannerImage } from '../../../../../_landing/Hero/BannerImage';
import { CollectibleTradeActions } from '../_components/Actions';
import { useCollectableData } from '../_hooks/useCollectableData';
import DPCard from './_components/DPCard';
import { CollectibleImage } from './_components/Image';
import { LinkIcon } from '@0xsequence/design-system';
import { useOpenConnectModal } from '@0xsequence/kit';
import { MarketplaceKind } from '@0xsequence/marketplace-sdk';
import {
  useFloorOrder,
  useListBalances,
  useLowestListing,
} from '@0xsequence/marketplace-sdk/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useConnections, useConnectorClient } from 'wagmi';

interface UserActivity {
  // Define the structure of the user activity data
  // Example:
  activityType: string;
  timestamp: string;
  // Add other fields as needed
}

export default function Page() {
  const {
    collectibleMetadata,
    collectionId,
    chainId,
    collectionMetadata,
    tokenId,
  } = useCollectableData();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { setOpenConnectModal } = useOpenConnectModal();
  const [yourAssets, setYourAssets] = useState<string[]>([]);

  const { data: lowestListing } = useLowestListing({
    chainId: String(chainId),
    collectionAddress: collectionId,
    tokenId,
    query: {
      enabled: true,
    },
  });

  const { address: accountAddress } = useAccount();

  const { data: balancesData } = useListBalances({
    chainId,
    accountAddress,
    contractAddress: collectionId,
  });

  const connectors = useConnections();

  // useEffect(() => {
  //   const getYourActivity = async () => {
  //     try {
  //       const body = {
  //         collectionAddress: '0x9365ffc890787a224aa9c8b18dd7e2d68ec88846',
  //         currencyAddresses: ['0x6D7bFFEFbAd377940f286c4AA790fb5d6cadF685'],
  //         orderbookContractAddress:
  //           '0xB537a160472183f2150d42EB1c3DD6684A55f74c',
  //         page: { sort: [{ column: 'createdAt', order: 'DESC' }] },
  //         tokenIDs: ['4', '5', '6'],
  //         userAddress: '0xd5C9D8b7ab0f624eAA6A5149d09cEB8B432452dc',
  //       };

  //       const response = await fetch(
  //         'https://marketplace-api.sequence.app/toy-testnet/rpc/Marketplace/GetUserActivities',
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(body),
  //         },
  //       );
  //       const data: UserActivity[] = await response.json();
  //       console.log(data);
  //     } catch (error) {}
  //   };
  //   void getYourActivity();
  // }, []);

  useEffect(() => {
    if (balancesData) {
      const balances = balancesData?.pages
        .flatMap((item) => item.balances)
        .map((item) => item);
      balances.forEach((item) => {
        if (item.tokenID) {
          setYourAssets((prev) => [...prev, item.tokenID!]);
        }
      });
    }
  }, [balancesData?.pages]);

  const { data: collectionDataOrder } = useFloorOrder({
    chainId: String(chainId),
    collectionAddress: collectionId,
  });

  const { data } = collectibleMetadata;

  const explorerUrl = getChain(chainId)?.blockExplorer?.rootUrl;

  const getMarketPlaceName = (
    marketplace: string,
    collectionAddress: string,
  ) => {
    if ('0xbd19b4c3c1e745e982f4d7f8bdf983d407e68a46' === collectionAddress) {
      return 'Element';
    }
    switch (marketplace as MarketplaceKind) {
      case MarketplaceKind.opensea:
        return 'Opensea';
      case MarketplaceKind.sequence_marketplace_v2:
        return 'TOY TESTNET marketplace';
      default:
        return '';
    }
  };

  return (
    <>
      <BannerImage logo={false}>
        <div className="pt-[11.0625rem] flex px-[11.1875rem] gap-[1.3125rem] mb:flex-col mb:px-4 mb:pt-[123px] pb-8">
          <div className="flex flex-col gap-[1.625rem] w-[37.384412153%] shrink-0 mb:w-full relative">
            <button
              className="absolute top-0 left-0 translate-y-[-125%] flex items-center gap-2"
              onClick={() => router.back()}
            >
              <img
                className="w-[1.3rem] h-[1.875rem] block"
                src="/market/icons/gao-back-icon.svg"
                alt="back"
                loading="lazy"
              />
              <p className="text-white">GO BACK</p>
            </button>
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
            <NextLink
              href={Routes.collection({
                chainParam: chainId,
                collectionId,
                mode: 'buy',
              })}
            >
              <div className="py-4 px-5 bg-white rounded-[1.5rem] flex items-center gap-[0.65rem] justify-between  w-full hover:scale-[1.005] transition-transform duration-200">
                <img
                  className="drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[2.6rem] h-[2.6rem] rounded-full block"
                  src={getCollectionLogo(collectionId)}
                  alt="logo"
                  loading="lazy"
                />
                <div className="flex gap-[0.6rem] overflow-hidden mr-auto">
                  <div>
                    <p className="text-[2rem] uppercase truncate leading-none mb:text-xl">
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
                {collectionDataOrder?.order?.marketplace ===
                  MarketplaceKind.sequence_marketplace_v2 && (
                  <div className="flex gap-2 mb:flex-col mb:gap-0 mb:hidden">
                    <img
                      className="w-[3.8rem]"
                      src="/market/icons/toy-logo-darck.svg"
                      alt="logo"
                    />{' '}
                    <p className="text-text text-[1.6rem]">TESTNET</p>
                  </div>
                )}
              </div>
            </NextLink>

            <div className="flex flex-col w-full  py-[1.75rem] px-[2.5625rem] gap-10 rounded-[25px] border border-white bg-[rgba(87,77,95,0.80)] backdrop-blur-[10px]">
              <p className="text-[2rem] font-normal leading-[86.94%] uppercase text-white mb:text-[20px]">
                {data?.name}
              </p>
              {lowestListing?.order &&
                collectionDataOrder?.order?.marketplace && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-DMSans text-[16px] capitalize leading-[103.45%] text-white font-bold mb-2">
                        Price
                      </p>
                      <div className="flex items-end gap-[0.5625rem]">
                        <div className="rounded-full overflow-hidden">
                          <img
                            className="w-[1.9375rem] aspect-square"
                            src={getCurrencyLogoByChainId(
                              lowestListing?.order.chainId,
                            )}
                            alt="logo"
                          />
                        </div>
                        <p className="text-white font-DMSans text-[1.6rem] font-bold leading-none">
                          {Number(lowestListing?.order.priceAmountFormatted) <=
                          0.00001
                            ? '0.00001'
                            : Number(
                                lowestListing?.order.priceAmountFormatted,
                              ).toFixed(3)}{' '}
                          {getCurrencyByChainId(lowestListing?.order.chainId)}
                        </p>
                        <p className="text-white font-DMSans self-end leading-[1.2]">
                          {Number(lowestListing?.order.priceUSD) <= 0.00001
                            ? '0.00001'
                            : Number(lowestListing?.order.priceUSD).toFixed(
                                2,
                              )}{' '}
                          $USD
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[0.5625rem]">
                      {setMarketPlaceLogo(
                        collectionDataOrder?.order?.marketplace,
                        collectionDataOrder.order.collectionContractAddress,
                      ) && (
                        <Image
                          className="rounded-full w-[1.9375rem] aspect-square"
                          src={setMarketPlaceLogo(
                            collectionDataOrder?.order?.marketplace,
                            collectionDataOrder.order.collectionContractAddress,
                          )}
                          width={22}
                          height={22}
                          alt={collectionDataOrder?.order?.marketplace || ''}
                        />
                      )}
                      <p className="font-DMSans text-[16px] capitalize leading-[103.45%] text-white">
                        {getMarketPlaceName(
                          collectionDataOrder?.order?.marketplace,
                          collectionDataOrder.order.collectionContractAddress,
                        )}
                      </p>
                    </div>
                  </div>
                )}
              <div className="mb:hidden">
                {isConnected ? (
                  <CollectibleTradeActions
                    isYour={yourAssets.includes(tokenId)}
                    chainId={chainId}
                    collectionAddress={collectionId}
                    tokenId={tokenId}
                  />
                ) : (
                  <button
                    className="btn-main"
                    onClick={() => setOpenConnectModal(true)}
                  >
                    Connect wallet
                  </button>
                )}
              </div>
            </div>
            <div className=" hidden mb:block">
              {isConnected ? (
                <CollectibleTradeActions
                  isYour={yourAssets.includes(tokenId)}
                  chainId={chainId}
                  collectionAddress={collectionId}
                  tokenId={tokenId}
                />
              ) : (
                <button
                  className="btn-main"
                  onClick={() => setOpenConnectModal(true)}
                >
                  Connect wallet
                </button>
              )}
            </div>
            <div className="flex flex-col w-full font-DMSans  py-[1.75rem] px-[2.5625rem] rounded-[25px] border border-white bg-main-gradient backdrop-blur-[10px] text-white text-[16px] leading-[2.07]">
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
                <p>Created By:</p>
                <a
                  className="flex items-center gap-2"
                  href={`${explorerUrl}address/${collectionDataOrder?.order?.createdBy}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkIcon />
                  <ENSName
                    address={collectionDataOrder?.order?.createdBy}
                    truncateAt={5}
                  />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <p>Token ID:</p>
                <p>{data?.tokenId}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-7 mb:flex-col mb:flex mb:gap-4 mb:hidden">
              <DPCard
                title="Sell"
                tooltip="When a sale is finalized, you’ll earn DIAMOND points as a reward."
              />
              <DPCard
                title="Buy"
                tooltip="Buy Assets and earn DIAMOND points as a reward."
              />
              <DPCard
                title="List"
                tooltip="list your asset on the market, and once it’s sold, you’ll earn DIAMOND points."
              />
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
