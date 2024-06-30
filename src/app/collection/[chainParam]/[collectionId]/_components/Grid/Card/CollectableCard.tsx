import { AddToCartButton } from '~/components/buttons/AddToCartButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { getChainId } from '~/config/networks';
import { useCartItemFromCollectibleOrder } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Footer } from './Footer';
import Link from 'next/link';

export const CollectibleCard = ({ data }: { data: CollectibleOrder }) => {
  const { collectionId, chainParam } = Routes.collection.useParams();
  return (
    <Card data={data} chainParam={chainParam} collectionId={collectionId} />
  );
};

export const Card = ({
  data,
  chainParam,
  collectionId,
}: {
  data: CollectibleOrder;
  chainParam: string | number;
  collectionId: string;
}) => {
  const { tokenId } = data.metadata;
  const cartItem = useCartItemFromCollectibleOrder(data);
  const chainId = getChainId(chainParam)!;

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
