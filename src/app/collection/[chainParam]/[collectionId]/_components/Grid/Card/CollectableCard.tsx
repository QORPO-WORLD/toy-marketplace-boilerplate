import { CollectibleActionButton } from '~/components/buttons/CollectibleActionButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';

import { Footer } from './Footer';
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
};

export const CollectibleCard = ({
  order,
  tokenId,
  collectionAddress,
  collectionChainId,
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
        className="peer h-full p-2"
      >
        <Image
          src={collectible?.image}
          containerClassName="bg-foreground/10 aspect-square rounded-[1.5625rem] overflow-hidden mb-2"
          className="aspect-square rounded-[inherit] hover:scale-110 ease-in duration-150"
        />
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
