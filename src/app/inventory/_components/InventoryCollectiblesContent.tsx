'use client';

import { use, useEffect, useRef, useState } from 'react';

import { CollectibleCard } from '~/app/collection/[chainParam]/[collectionId]/_components/Grid/Card/CollectableCard';
import { ContractTypeBadge } from '~/components/ContractTypeBadge';
import { Spinner } from '~/components/Spinner';

import {
  Accordion,
  Avatar,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
  cn,
} from '$ui';
import { NetworkImage } from '@0xsequence/design-system';
import type { TokenBalance } from '@0xsequence/indexer';
import {
  useCollection,
  useListBalances,
} from '@0xsequence/marketplace-sdk/react';
import { ContractType } from '@0xsequence/metadata';
import { useIsMounted } from '@legendapp/state/react';
import { set } from 'date-fns';
import type { Hex } from 'viem';

type InventoryCollectiblesContent = {
  collectionBalances: TokenBalance[];
};

export const InventoryCollectiblesContent = ({
  collectionBalances,
}: InventoryCollectiblesContent) => {
  return (
    <>
      <Accordion.Root
        type="multiple"
        className="w-full"
        defaultValue={collectionBalances.map((c) => c.contractAddress)}
      >
        {collectionBalances.map((c) => {
          return <CollectionSection key={c.contractAddress} {...c} />;
        })}
      </Accordion.Root>
    </>
  );
};

const CollectionSection = ({
  chainId,
  contractAddress: collectionAddress,
  accountAddress,
}: TokenBalance) => {
  const {
    data: collectionBalances,
    isLoading: collectionBalancesLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useListBalances({
    chainId,
    accountAddress,
    contractAddress: collectionAddress,
  });
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: collectionMetadata, isLoading: isCollectionMetadataLoading } =
    useCollection({ chainId, collectionAddress });
  const [balancesData, setBalancesData] = useState<TokenBalance[] | []>([]);
  const [isMounted, setIsMounted] = useState(false);

  // const { isGridView } = useViewType();

  useEffect(() => {
    if (isMounted) return;
    if (contentRef.current) {
      setIsOpen(true);
      setIsMounted(true);
    }
  }, [useIsMounted, contentRef.current]);

  useEffect(() => {
    if (collectionBalances) {
      const balances = collectionBalances?.pages
        .flatMap((item) => item.balances)
        .map((item) => item);
      balances.forEach((item) => {
        setBalancesData((prev) => {
          return prev ? [...prev, item] : [item];
        });
      });
    }
  }, [collectionBalances]);

  const findAssetBalance = (contractAddress: string) => {
    return balancesData.find(
      (c) =>
        c.contractAddress.toLocaleLowerCase() ===
        contractAddress.toLocaleLowerCase(),
    );
  };

  const isGridView = true;

  const collectibles =
    collectionBalances?.pages.flatMap((p) => p.balances) || [];

  const handleLoadMore = () => {
    if (isFetchingNextPage) {
      return;
    }
    void fetchNextPage();
  };

  if (collectionBalancesLoading || isCollectionMetadataLoading) {
    return <Spinner label="Loading Inventory Collectibles" />;
  }

  if (collectibles.length === 0)
    return <Text className="w-full text-center text-black pt-32">Empty.</Text>;

  return (
    <div className="max-w-[100vw] px-4 py-4 md:px-3 md:grid-rows-1 md:gap-8 rounded-[1.5625rem] border border-[#403545] bg-[#4035451A] backdrop-blur-[0.625rem]">
      <Flex className="sticky z-20 py-2 w-full">
        <div className="w-full">
          <div
            className={cn('w-full self-start flex items-center mb:items-start')}
          >
            <Flex className="items-center gap-3 w-full flex-wrap">
              {/* <Avatar.Base>
                <Avatar.Image
                  alt={collectionMetadata?.name}
                  src={collectionMetadata?.logoURI}
                />
              </Avatar.Base> */}

              <Text className="text-[1.25rem] text-[#00000099]">
                {collectionMetadata?.name || collectionAddress}
              </Text>
              <div className="bg-[#4035451A] p-1 rounded-full">
                <NetworkImage chainId={Number(collectionMetadata?.chainId)} />
              </div>
              <ContractTypeBadge
                chainId={chainId}
                collectionAddress={collectionAddress}
              />
              <Text className="ml-auto text-[1rem] text-[#00000099] mr-8 mb:ml-0">
                ITEMS {collectibles.length}
              </Text>
            </Flex>
            {/* <button className="mr-4" onClick={() => setIsOpen((prev) => !prev)}>
              <img
                className="transition duration-150 ease-out w-4 aspect-square"
                src="/market/icons/arrow-icon.svg"
                style={{
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
                alt="arrow"
              />
            </button> */}
          </div>
        </div>
      </Flex>

      <div
        className="mt-0 p-1 overflow-hidden transition-all duration-700 ease-out"
        // style={{
        //   height: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        // }}
      >
        <div className="pt-1" ref={contentRef}>
          <ContentWrapper isGridView={isGridView}>
            {collectibles.map((c) => {
              return isGridView ? (
                <CollectibleCard
                  balance={findAssetBalance(c.contractAddress)}
                  isInventory
                  collectionAddress={collectionAddress as Hex}
                  tokenId={c.tokenID!}
                  collectionChainId={String(c.chainId)}
                />
              ) : (
                <InventoryRow />
              );
            })}
          </ContentWrapper>
        </div>

        {hasNextPage ? (
          <Button
            className="mt-2"
            variant="secondary"
            label="Load More"
            onClick={handleLoadMore}
            loading={isFetchingNextPage}
          />
        ) : null}
      </div>
    </div>
  );
};

const getContractType = (contractType?: string) => {
  switch (contractType?.toUpperCase()) {
    case 'ERC721':
      return ContractType.ERC721;
    case 'ERC1155':
      return ContractType.ERC1155;
    default:
      return ContractType.UNKNOWN;
  }
};

const ContentWrapper = ({
  isGridView,
  children,
}: {
  isGridView: boolean;
  children: React.ReactNode;
}) => {
  return isGridView ? (
    <Grid.Root
      className={cn(
        'grid-flow-row gap-3 sm:gap-3',
        'auto-rows-[minmax(250px,min-content)] grid-cols-[repeat(auto-fill,minmax(240px,1fr))] grid-rows-[repeat(auto-fill,minmax(250px,min-content))]',
        'sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]',
      )}
    >
      {children}
    </Grid.Root>
  ) : (
    <>{children}</>
  );
};
const InventoryRow = () => null;
// TODO: Implement InventoryRow
// {
//   data,
// }: {
//   data: Exclude<CollectibleCardData, undefined | null>;
// }) => {
//   const badge = data.badges![0];
//   return (
//     <Flex className="justify-between border-b border-b-border py-3">
//       <Flex className="gap-3">
//         <PoolAvatar
//           src={data.image || ''}
//           name={data.name || ''}
//           chainId={data.addToCartButtonProps?.addToCartData.item.chainId}
//           tokenId={data.tokenId}
//           link={data.link}
//         />
//         <Badge variant="muted" title={String(badge.title)}>
//           {badge.label}:<span className="ml-1">{badge.value}</span>
//         </Badge>
//       </Flex>
//       {data.addToCartButtonProps?.addToCartData && (
//         <AddToCartButton
//           isAvailable={true}
//           addToCartData={data.addToCartButtonProps?.addToCartData}
//           itemType={OrderItemType.TRANSFER}
//         />
//       )}
//     </Flex>
//   );
// };
