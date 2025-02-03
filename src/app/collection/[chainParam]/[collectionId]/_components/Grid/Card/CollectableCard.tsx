import { MdContentCopy } from 'react-icons/md';

import { CollectibleActionButton } from '~/components/buttons/CollectibleActionButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';

import { Footer } from './Footer';
import { TokenBalance } from '@0xsequence/indexer';
import { useTokenMetadata } from '@0xsequence/kit';
import type { Order } from '@0xsequence/marketplace-sdk';
import { useCollectible } from '@0xsequence/marketplace-sdk/react';
import Link from 'next/link';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

type CollectibleCardProps = {
  order?: Order;
  tokenId: string;
  collectionAddress: Hex;
  collectionChainId: string;
  isInventory?: boolean;
  balance?: TokenBalance;
};

export const CollectibleCard = ({
  order,
  tokenId,
  collectionAddress,
  collectionChainId,
  balance,
}: CollectibleCardProps) => {
  const { isConnected, chainId: accountChainId } = useAccount();
  const { data: collectible, isLoading: collectibleLoading } = useCollectible({
    chainId: collectionChainId,
    collectionAddress,
    collectibleId: tokenId,
  });

  // TODO: Handle this better later
  if (collectibleLoading) return null;

  return (
    <article
      className={cn(
        classNames.collectibleSelectionIndicator,
        `relative flex h-full w-full flex-col align-top m-[0.1rem] pb-8 mb:pb-0`,
        'rounded-[1.5625rem] bg-white outline outline-2 outline-transparent',
        'z-10 overflow-hidden !outline transition-all',
      )}
    >
      <Link
        href={Routes.collectible({
          chainParam: collectionChainId,
          collectionId: collectionAddress,
          tokenId,
        })}
        className="peer h-full p-2 relative"
      >
        <div className="bg-foreground/10 aspect-square rounded-[1.5625rem] overflow-hidden mb-2 relative">
          <Image
            src={collectible?.image}
            className="aspect-square rounded-[inherit] hover:scale-110 ease-in duration-150"
          />
          {balance && (
            <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-opacity-black py-2 px-3 rounded-sm border border-white">
              <MdContentCopy color="white" />
              <p className="text-sm uppercase font-DMSans text-white">
                {balance.balance} owned
              </p>
            </div>
          )}
        </div>
        <Footer tokenMetadata={collectible!} order={order} />
      </Link>
      {isConnected && accountChainId && (
        <CollectibleActionButton
          className={cn(
            'bottom-0 m-0 w-full !rounded-none ease-in-out hover:visible peer-hover:visible bg-main-gradient text-xl color-white hover:text-[1.35rem]',
            '[@media(hover:hover)]:invisible [@media(hover:hover)]:absolute mb:text-[24px] mb:py-[24px]',
          )}
          tokenId={tokenId}
          collectionChainId={collectionChainId}
          collectionAddress={collectionAddress}
          collectibleName={collectible?.name}
        />
      )}
    </article>
  );
};
