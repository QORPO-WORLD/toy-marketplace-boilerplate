import { AddToCartButton } from '~/components/buttons/AddToCartButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { Routes } from '~/lib/routes';

import { Footer } from './Footer';
import type { CollectibleOrder, Order } from '@0xsequence/marketplace-sdk';
import Link from 'next/link';

type CollectibleCardProps = {
  data: CollectibleOrder;
  orderSide: 'buy' | 'sell' | 'transfer';
  tokenId: string;
  collectionAddress: string;
  chainId: string;
  receivedOffer?: Order;
  collectibleName?: string;
};

export const CollectibleCard = ({
  data,
  orderSide,
  tokenId,
  collectionAddress,
  chainId,
  receivedOffer,
  collectibleName,
}: CollectibleCardProps) => {
  return (
    <article
      className={cn(
        classNames.collectibleSelectionIndicator,
        `relative flex h-full w-full flex-col align-top m-[0.1rem]`,
        'rounded-md bg-foreground/5 outline outline-2 outline-transparent',
        'z-10 overflow-hidden !outline transition-all',
      )}
    >
      <Link
        href={Routes.collectible({
          chainParam: chainId,
          collectionId: collectionAddress,
          tokenId,
        })}
        className="peer h-full p-2"
      >
        <Image
          src={data.metadata.image}
          containerClassName="bg-foreground/10 aspect-square rounded-sm overflow-hidden"
          className="aspect-square rounded-[inherit] hover:scale-125 ease-in duration-150"
        />
        <Footer {...data} />
      </Link>
      <AddToCartButton
        className={cn(
          'bottom-0 m-0 w-full !rounded-none ease-in-out hover:visible peer-hover:visible',
          '[@media(hover:hover)]:invisible [@media(hover:hover)]:absolute',
        )}
        chainId={chainId}
        orderSide={orderSide || 'buy'}
        tokenId={tokenId}
        collectionAddress={collectionAddress}
        receivedOffer={receivedOffer}
        collectibleName={collectibleName}
      />
    </article>
  );
};
