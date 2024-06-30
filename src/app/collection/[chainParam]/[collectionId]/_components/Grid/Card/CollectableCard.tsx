import { AddToCartButton } from '~/components/buttons/AddToCartButton';
import { Image, cn } from '~/components/ui';
import { classNames } from '~/config/classNames';
import { useCartItemFromCollectibleOrder } from '~/hooks/cart/useCartItem';
import type { CollectibleOrder } from '~/lib/queries/marketplace/marketplace.gen';
import { Routes } from '~/lib/routes';
import { OrderItemType } from '~/lib/stores/cart/types';

import { Footer } from './Footer';
import Link from 'next/link';

export const CollectibleCard = ({ data }: { data: CollectibleOrder }) => {
  const cartItem = useCartItemFromCollectibleOrder(data);

  //TODO: This makes the collectible card not useable in the inventory page
  const params = Routes.collection.useParams();

  const { tokenId } = data.metadata;
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
          chainParam: params.chainParam,
          collectionId: params.collectionId,
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
