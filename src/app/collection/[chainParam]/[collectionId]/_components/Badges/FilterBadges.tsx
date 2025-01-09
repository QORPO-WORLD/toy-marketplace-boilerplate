'use client';

import { ChangeEvent, useCallback, useState } from 'react';

import {
  Badge,
  CloseIcon,
  Flex,
  Grid,
  Input,
  ScrollArea,
  Text,
  cn,
} from '~/components/ui';
import { classNames } from '~/config/classNames';

import { filters$ } from '../FilterStore';
import { IntBadge } from './IntBadge';
import { StringAndArrayBadge } from './StringAndArrayBadge';
import { useFilters } from '@0xsequence/marketplace-sdk/react';
import { PropertyType } from '@0xsequence/metadata';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';

type FilterBadgesProps = {
  chainId: number;
  collectionAddress: Hex;
};

export const FilterBadges = observer(
  ({ chainId, collectionAddress }: FilterBadgesProps) => {
    const [search, setSearch] = useState('');
    const { filterOptions: filters, searchText } = filters$.get();

    const { data } = useFilters({
      chainId: chainId.toString(),
      collectionAddress,
    });

    const getFilterType = useCallback(
      (name: string) => data?.find((f) => f.name === name)?.type,
      [data],
    );
    const handleSearch = (value: string) => {
      setSearch(value);
      filters$.searchText.set(value);
    };

    return (
      <div className="sticky z-20 bg-[#CBBFD0] py-4 px-2 top-[6rem] flex flex-row-reverse items-center mb:2rem">
        <Input.Search
          className="max-w-[20rem]"
          id="property-search"
          placeholder={`Search`}
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
          onClear={() => handleSearch('')}
        />
        <Grid.Child
          name="collection-filter-badges"
          className=" bg-[#CBBFD0] py-2 px-2 w-full"
        >
          <ScrollArea.Base orientation="horizontal" className="max-w-full">
            <Flex
              className={cn(classNames.collectionFilterBadges, 'w-0 gap-2')}
            >
              {searchText && (
                <Badge className="text-[#483F50]" size="lg" variant="outline">
                  &quot;
                  <Text className="text-[#483F50]">Search: {searchText}</Text>
                  &quot;
                  <CloseIcon
                    className="ml-3 cursor-pointer"
                    onClick={() => {
                      filters$.clearSearchText();
                    }}
                  />
                </Badge>
              )}

              {filters.map((filter, i) => {
                switch (getFilterType(filter.name)) {
                  case PropertyType.STRING:
                  case PropertyType.ARRAY:
                    if (filter?.values?.length) {
                      return <StringAndArrayBadge key={i} filter={filter} />;
                    }
                    return null;
                  case PropertyType.INT:
                    if (filter?.values.length == 2) {
                      const min = filter.values[0] as number;
                      const max = filter.values[1] as number;
                      return (
                        <IntBadge
                          key={i}
                          name={filter.name}
                          min={min}
                          max={max}
                        />
                      );
                    }
                    return null;
                }
              })}

              {filters.length ? (
                <Badge
                  size="lg"
                  variant="outlinePrimary"
                  className="cursor-pointer text-[#483F50] font-DMSans uppercase font-bold"
                  onClick={() => {
                    filters$.clearAllFilters();
                  }}
                >
                  Clear All
                  <CloseIcon className="ml-2" />
                </Badge>
              ) : null}
            </Flex>
          </ScrollArea.Base>
        </Grid.Child>
      </div>
    );
  },
);
