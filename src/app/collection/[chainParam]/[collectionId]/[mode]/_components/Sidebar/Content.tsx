'use client';

import type { ComponentProps } from 'react';

import type { ExtendedPropertyFilter } from '~/api';
import { classNames } from '~/config/classNames';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Text, Select, Switch, Flex, cn, Label, ScrollArea, Box } from '$ui';
import { AddressesLinks } from '../../../_components/Base/Sidebar/Addresses';
import { PropertyFilters } from './PropertyFilters';
import { capitalize } from 'radash';

export type BaseCollectionSidebarContentProps = {
  selector?: { label: string; content: React.ReactNode };
  sortSelector?: {
    controls: ComponentProps<typeof Select.Root>;
    options: Array<{ label: string; value: string }>;
  };
  filterSwitches: Array<ComponentProps<typeof Switch.Base>>;
  propertyFilters: { data: ExtendedPropertyFilter[]; loading?: boolean };
  addresses: ComponentProps<typeof AddressesLinks>['addresses'];
  disableFilters?: boolean;
};

export const BaseCollectionSidebarContent = ({
  sortSelector,
  filterSwitches,
  propertyFilters,
  addresses,
  disableFilters = false,
}: BaseCollectionSidebarContentProps) => {
  return (
    <ScrollArea.Base className="h-full">
      <Flex
        className={cn(
          classNames.collectionSidebar,
          'h-full w-full flex-col gap-y-4',
        )}
      >
        {sortSelector?.options?.length ? (
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
        ) : null}

        {propertyFilters.data.length || propertyFilters.loading ? (
          <Flex
            className={cn(
              'flex-col gap-3 p-3 pl-1',
              disableFilters ? 'hidden' : '',
            )}
          >
            <PropertyFilters
              filters={propertyFilters.data}
              loading={propertyFilters.loading}
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
