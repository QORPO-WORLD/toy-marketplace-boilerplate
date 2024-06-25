'use client';

import type { ComponentProps } from 'react';
import { useEffect } from 'react';

import { classNames } from '~/config/classNames';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';
import { metadataQueries } from '~/lib/queries';
import { toggleCollectionSidebar, uiState } from '~/lib/stores/UI';
import { setShowAvailableOnly } from '~/lib/stores/collectible';
import { SortType } from '~/lib/stores/collectible/types';
import { getThemeManagerElement } from '~/lib/utils/theme';

import {
  Text,
  Button,
  Select,
  Switch,
  Flex,
  cn,
  Label,
  ScrollArea,
  Box,
  Portal,
} from '$ui';
import { AddressesLinks } from './Addresses';
import { PropertyFilters } from './PropertyFilters';
import { useQuery } from '@tanstack/react-query';
import { capitalize } from 'radash';
import { useSnapshot } from 'valtio';
import { useAccount } from 'wagmi';

type CollectionSidebarProps = {
  chainId: number;
  collectionAddress: string;
};

export const CollectionSidebar = ({
  chainId,
  collectionAddress,
}: CollectionSidebarProps) => {
  const isMD = useIsMinWidth('@md');

  if (!isMD) {
    return (
      <MobileSidebarWrapper>
        <CollectionSidebarContent
          chainId={chainId}
          collectionAddress={collectionAddress}
        />
      </MobileSidebarWrapper>
    );
  }

  return (
    <Flex
      className={'sticky w-[300px]'}
      style={{
        top: 'calc(var(--headerHeight) + var(--collectionControlsHeight) + 20px)',
        height:
          'calc(100vh - var(--headerHeight) - var(--footerHeight) - var(--collectionControlsHeight) - 20px)',
      }}
    >
      <CollectionSidebarContent
        chainId={chainId}
        collectionAddress={collectionAddress}
      />
    </Flex>
  );
};

const CollectionSidebarContent = ({
  chainId,
  collectionAddress,
}: CollectionSidebarProps) => {
  const { isConnected } = useAccount();

  const collectableFilters = useQuery(
    metadataQueries.collectibleFilter({
      chainID: chainId.toString(),
      contractAddress: collectionAddress,
    }),
  );

  const filterOptions = new Set<ComponentProps<typeof Switch.Base>>();

  // const showOwnedOnlyToggle = {
  //   id: 'show-owned-only',
  //   checked: showAvailableOnly,
  //   onCheckedChange: setShowAvailableOnly,
  //   children: 'Available Items Only',
  // };

  // const includeUserOrdersToggle = {
  //   id: 'include-user-orders',
  //   checked: includeUserOrders,
  //   onCheckedChange: setIncludeUserOrders,
  //   children: mode === 'buy' ? 'Include my listings' : 'Include my offers',
  // };

  // if (mode === 'buy') {
  //   filterOptions.add(showOwnedOnlyToggle);
  // } else {
  //   filterOptions.delete(showOwnedOnlyToggle);
  // }

  // if (isConnected) {
  //   filterOptions.add(includeUserOrdersToggle);
  // } else {
  //   filterOptions.delete(includeUserOrdersToggle);
  // }

  // useEffect(() => {
  //   if (mode === 'buy' || mode === 'sell') {
  //     updateSortType(SortType.PRICE_ASC);
  //   } else {
  //     updateSortType(SortType.CREATED_AT_DESC);
  //   }
  // }, [mode]);

  let sortOptions = [
    {
      label: 'PRICE ASCENDING',
      value: SortType.PRICE_ASC,
    },
    {
      label: 'PRICE DESCENDING',
      value: SortType.PRICE_DESC,
    },
  ];

  const addresses = [
    {
      label: 'Collection',
      address: collectionAddress,
      chainId,
    },
    {
      label: 'Orderbook',
      address: SEQUENCE_MARKET_V1_ADDRESS,
      chainId,
    },
  ];
  return (
    <ScrollArea.Base className="h-full">
      <Flex
        className={cn(
          classNames.collectionSidebar,
          'h-full w-full flex-col gap-y-4',
        )}
      >
        {/* {sortSelector?.options?.length ? (
          <Flex className="flex-col gap-2 p-3 pl-1">
            <Text className="text-sm text-foreground/50">Sort By</Text>

            <Select.Root {...sortSelector?.controls}>
              <Select.Trigger
                id="collection-sidebar-sort-by"
                className="w-full"
              >
                <Select.Value placeholder="Sort By" />
              </Select.Trigger>

              <Select.Options container={getThemeManagerElement()}>
                {sortSelector?.options.map((o, i) => (
                  <Select.Option key={i} value={o.value} className="py-2">
                    {capitalize(o.label.toLowerCase())}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select.Root>
          </Flex>
        ) : null}

        {filterSwitches.length ? (
          <Flex
            className={cn(
              'flex-col gap-3 p-3 pl-1',
              disableFilters ? 'hidden' : '',
            )}
          >
            <Flex className="flex-col gap-2">
              {filterSwitches.map((f, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Switch.Base
                    className="flex-row-reverse justify-end"
                    {...f}
                  />

                  <Label htmlFor={f.id}>{f.children}</Label>
                </div>
              ))}
            </Flex>
          </Flex>
        ) : null} */}

        {collectableFilters.data?.length || collectableFilters.isLoading ? (
          <Flex
            className={cn(
              'flex-col gap-3 p-3 pl-1',
              // disableFilters ? 'hidden' : '',
            )}
          >
            <PropertyFilters
              filters={collectableFilters.data}
              loading={collectableFilters.isLoading}
            />
          </Flex>
        ) : null}

        {addresses.length ? (
          <Box className="mt-auto w-full">
            <AddressesLinks addresses={addresses} />
          </Box>
        ) : null}
      </Flex>
    </ScrollArea.Base>
  );
};

// const collectionSidebarContent = ({
//   chainId,
//   collectionAddress,
// }: BaseCollectionSidebarProps) => {

//   return (
//     <BaseCollectionSidebarContent
//       sortSelector={{
//         controls: {
//           value: sortBy,
//           onValueChange: updateSortType,
//         },
//         options: sortOptions,
//       }}
//       filterSwitches={[...filterOptions]}
//       propertyFilters={{ data: filters?.data || [], loading: isFiltersLoading }}
//       disableFilters={mode === 'activity'}
//       addresses={addresses}
//     />
//   );
// };

function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const { isCollectionSidebarOpen } = useSnapshot(uiState);

  return (
    <Portal>
      <Box className="fixed bottom-0 left-1/2 z-20 -translate-x-1/2 rounded-md bg-background">
        <Button
          className="!rounded-[inherit]"
          variant="muted"
          label="SHOW SIDEBAR"
          onClick={toggleCollectionSidebar}
        />
      </Box>

      <Box
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleCollectionSidebar();
          }
        }}
        className={cn(
          isCollectionSidebarOpen
            ? 'visible left-0 bg-background/50 backdrop-blur-sm'
            : 'invisible left-[-100vw] bg-transparent backdrop-blur-0',
          'fixed top-14 z-30 h-[calc(100vh-3.5rem)] w-screen transition-all',
        )}
      >
        <Box className="h-full max-w-[300px] border-r border-r-border bg-background px-2">
          {children}
        </Box>
      </Box>
    </Portal>
  );
}
