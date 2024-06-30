import type { OrderbookModalType } from '~/components/modals/OrderModalContent';
import { OrderForm } from '~/components/modals/OrderModalContent/OrderForm';
import { Dialog, Flex } from '~/components/ui';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import { marketplaceQueries, metadataQueries } from '~/lib/queries';
import { Order } from '~/lib/queries/marketplace/marketplace.gen';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useQuery } from '@tanstack/react-query';

export type CollectionOfferModalState = {
  chainId: number;
  collectionAddress: string;
  tokenId: string;
  type: OrderbookModalType;
  bestListing?: Order;
};

interface Store {
  open: boolean;
  state: CollectionOfferModalState;
}

export const CollectionOfferModal$ = observable<Store>({
  open: false,
  state: {
    chainId: 0,
    collectionAddress: '',
    tokenId: '',
    type: 'offer',
    bestListing: undefined,
  },
});

export const CollectionOfferModal = observer(() => {
  const {
    open,
    state: { chainId, collectionAddress, tokenId, bestListing, type },
  } = CollectionOfferModal$;

  const collectionMetadata = useQuery(
    metadataQueries.collection({
      chainID: chainId.get().toString(),
      collectionId: collectionAddress.get(),
    }),
  );
  const tokenMetadata = useQuery(
    metadataQueries.collectible({
      chainID: chainId.get().toString(),
      contractAddress: collectionAddress.get(),
      tokenIDs: [tokenId.get()],
    }),
  );

  const isERC1155 = collectionMetadata.data?.type === 'ERC1155';

  const { data: royaltyPercentage } = useCollectionRoyalty({
    chainId: chainId.get(),
    contractAddress: collectionAddress.get(),
    tokenId: tokenId.get(),
  });

  const { data: currencies } = useQuery(
    marketplaceQueries.currencies({
      chainId: chainId.get(),
    }),
  );

  return (
    <Flex className="w-full flex-col gap-3">
      <Dialog.Root
        open={open.get()}
        onOpenChange={(isOpen) => open.set(isOpen)}
      >
        <Dialog.BaseContent
          container={getThemeManagerElement()}
          className="max-h-screen max-w-[700px] p-5"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Dialog.Title>Create an offer</Dialog.Title>
          {collectionMetadata.data && tokenMetadata.data && (
            <OrderForm
              type={type.get()}
              chainId={chainId.get()}
              collectionMetadata={collectionMetadata.data}
              tokenMetadata={tokenMetadata.data}
              currencyOptions={currencies?.currencies ?? []}
              isERC1155={isERC1155}
              bestOrder={bestListing.get()}
              setOpen={(isOpen) => open.set(isOpen)}
              royaltyPercentage={royaltyPercentage}
            />
          )}
        </Dialog.BaseContent>
      </Dialog.Root>
    </Flex>
  );
});
