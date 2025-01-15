'use client';

import { type ComponentProps, useState } from 'react';

import { classNames } from '~/config/classNames';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';

import { Box, Button, Flex, Label, Portal, ScrollArea, Switch, cn } from '$ui';
import { filters$ } from '../FilterStore';
import { AddressesLinks } from './Addresses';
import { PropertyFilters } from './PropertyFilters';
import { SEQUENCE_MARKET_V1_ADDRESS } from '@0xsequence/marketplace-sdk';
import { useFilters } from '@0xsequence/marketplace-sdk/react';
import type { ObservableBoolean } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { usePathname } from 'next/navigation';
import type { Hex } from 'viem';

type CollectionSidebarProps = {
  chainId: number;
  collectionAddress: Hex;
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
      className={'sticky w-[18.75rem]'}
      style={{
        top: '6rem',
        height: '',
      }}
    >
      <CollectionSidebarContent
        chainId={chainId}
        collectionAddress={collectionAddress}
      />
    </Flex>
  );
};

type FilterOptions = ComponentProps<typeof Switch.Base> & {
  checked: ObservableBoolean;
};

const CollectionSidebarContent = ({
  chainId,
  collectionAddress,
}: CollectionSidebarProps) => {
  // const { isConnected } = useAccount();

  const collectableFilters = useFilters({
    chainId: String(chainId),
    collectionAddress,
  });

  const path = usePathname();
  const mode = path.includes('/sell') ? 'sell' : 'buy';
  const isBuy = mode === 'buy';

  const availableOnlyToggle = {
    id: 'available-items-only',
    checked: filters$.showAvailableOnly,
    onCheckedChange: () => filters$.showAvailableOnly.toggle(),
    children: isBuy ? 'Available Items Only' : 'Available Offers Only',
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore -- TODO: fix this
  const filterOptions = new Set<FilterOptions>([availableOnlyToggle]);

  // const includeUserOrdersToggle = {
  //   id: 'include-user-orders',
  //   checked: filters$.includeUserOrders,
  //   onCheckedChange: () => filters$.includeUserOrders.toggle(),
  //   children: mode === 'buy' ? 'Include my listings' : 'Include my offers',
  // };

  // if (isConnected) {
  //   filterOptions.add(includeUserOrdersToggle);
  // } else {
  //   filterOptions.delete(includeUserOrdersToggle);
  // }

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

  const filterSwitches = Array.from(filterOptions);

  const isProperties =
    collectableFilters.data?.length &&
    collectableFilters.data.length <= 1 &&
    !!collectableFilters.data.find(
      (filter) => filter.name === 'Daily Diamond Points',
    );

  return (
    <ScrollArea.Base className="h-full">
      <Flex
        className={cn(
          classNames.collectionSidebar,
          'h-full w-full flex-col gap-y-4',
        )}
      >
        {filterSwitches.length ? (
          <Flex className={'flex-col gap-3 p-3 pl-1'}>
            <Flex className="flex-col gap-2">
              {filterSwitches.map((f) => (
                <FilterSwitch key={f.id} filter={f} />
              ))}
            </Flex>
          </Flex>
        ) : null}

        {!isProperties &&
        (collectableFilters.data?.length || collectableFilters.isLoading) ? (
          <Flex className="flex-col gap-3 p-3 pl-1">
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

function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleState = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Portal>
      <Box className="fixed bottom-[12px] left-1/2 z-[60] -translate-x-1/2 rounded-md bg-background">
        <Button
          className="!rounded-[inherit]"
          variant="muted"
          label="SHOW SIDEBAR"
          onClick={toggleState}
        />
      </Box>

      <Box
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleState();
          }
        }}
        className={cn(
          isOpen
            ? 'visible left-0 bg-background/50 backdrop-blur-sm'
            : 'invisible left-[-100vw] bg-transparent backdrop-blur-0',
          'fixed top-14 z-[61] h-dvh w-screen transition-all mb:top-0',
        )}
      >
        <Box className="h-full max-w-[300px] border-r border-r-border bg-[#483F51] px-2">
          {children}
        </Box>
      </Box>
    </Portal>
  );
}

const FilterSwitch = observer(({ filter }: { filter: FilterOptions }) => {
  const checked = filter.checked.get();
  return (
    <div className="flex items-center space-x-2">
      <Switch.Base
        className="flex-row-reverse justify-end"
        {...filter}
        checked={checked}
      />
      <Label
        className="text-[#483F50] font-DMSans text-[1.25rem] font-semibold mb:text-white"
        htmlFor={filter.id}
      >
        {filter.children}
      </Label>
    </div>
  );
});
