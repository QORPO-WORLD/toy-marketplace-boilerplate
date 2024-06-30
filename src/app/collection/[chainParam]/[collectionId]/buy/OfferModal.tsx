import { OrderForm } from '~/components/modals/OrderModalContent/OrderForm';
import type { OrderbookModalType } from '~/components/modals/OrderModalContent/index';
import { Dialog, Flex } from '~/components/ui';
import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';
import {
  collectableQueries,
  collectionQueries,
  currencyQueries,
} from '~/lib/queries';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { useQuery } from '@tanstack/react-query';

export const CollectionOfferModal$ = observable({
  open: false,
  state: {
    chainId: 0,
    collectionAddress: '',
    tokenId: '',
    type: 'offer' as OrderbookModalType,
    bestListing: undefined,
  },
});

export const CollectionOfferModal = observer(() => {
  const {
    open,
    state: { chainId, collectionAddress, tokenId, bestListing, type },
  } = CollectionOfferModal$;

  const collectionMetadata = useQuery(
    collectionQueries.detail({
      chainID: chainId.get().toString(),
      collectionId: collectionAddress.get(),
    }),
  );
  const tokenMetadata = useQuery(
    collectableQueries.detail({
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
    currencyQueries.list({
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
