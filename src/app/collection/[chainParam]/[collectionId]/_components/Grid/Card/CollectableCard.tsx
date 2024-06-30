import { AddToCartButton } from '~/components/buttons/AddToCartButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { getChainId } from '~/config/networks';
import { useCartItemFromCollectibleOrder } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Footer } from './Footer';
import { type ContractType } from '@0xsequence/metadata';
import Link from 'next/link';

export const CollectibleCard = ({
  data,
  itemType,
}: {
  data: CollectibleOrder;
  itemType: OrderItemType;
}) => {
  const { collectionId, chainParam } = Routes.collection.useParams();
  return (
    <Card
      data={data}
      itemType={itemType}
      chainParam={chainParam}
      collectionId={collectionId}
    />
  );
};

type CardProps = {
  data: CollectibleOrder;
  chainParam: string | number;
  collectionId: string;
  contractType?: ContractType;
  itemType: OrderItemType;
};

export const Card = ({
  data,
  chainParam,
  collectionId,
  contractType,
  itemType,
}: CardProps) => {
  const { tokenId } = data.metadata;
  const chainId = getChainId(chainParam)!;

  const cartItem = useCartItemFromCollectibleOrder({
    collectibleOrder: data,
    chainId,
    collectionId,
    itemType,
  });

  return (
    <article
      className={cn(
        classNames.collectibleSelectionIndicator,
        `relative flex h-full w-full flex-col align-top`,
        'rounded-md bg-foreground/5 outline outline-2 outline-transparent',
        !!cartItem ? `${getOrderTypeOutlineColor()}` : '',
        'z-10 overflow-hidden !outline transition-all',
      )}
    >
      <Link
        href={Routes.collectible({
          chainParam,
          collectionId,
          tokenId,
        })}
        className="peer h-full p-2"
      >
        <Image.Base
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
        collectionId={collectionId}
        collectibleOrder={data}
        contractType={contractType}
      />
    </article>
  );
};

const getOrderTypeOutlineColor = (type?: OrderItemType) => {
  switch (type) {
    case OrderItemType.TRANSFER: {
      return '!outline-pink';
    }
    default:
      return '!outline-foreground/50';
  }
};
