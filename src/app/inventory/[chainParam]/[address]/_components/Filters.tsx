'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

// import { ViewTypeToggle } from '~/components/ViewTypeToggle';
import { useIsMinWidth } from '~/hooks/ui/useIsMinWidth';

import { Flex, Input, Text } from '$ui';
import {
  clearInventorySearchText,
  inventoryState,
  setInventorySearchText,
} from './Inventory';
import { debounce } from 'radash';
import { useSnapshot } from 'valtio';

type InventoryFiltersProps = {
  totalResults: number;
  hasExcess?: boolean;
};

export const InventoryFilters = (props: InventoryFiltersProps) => {
  const { totalResults, hasExcess } = props;
  const { searchResultAmount, searchText } = useSnapshot(inventoryState);

  const resultAmount = searchText === '' ? totalResults : searchResultAmount;

  const isMd = useIsMinWidth('@md');

  if (!isMd) {
    return (
      <Flex className="flex-col items-end gap-3">
        <Flex className="w-full items-center justify-between gap-2">
          <Flex className="gap-3">
            <SearchInventory />
          </Flex>

          {/* <Flex className="items-center gap-5">
            <ViewTypeToggle />
          </Flex> */}
        </Flex>

        <Text className="uppercase text-foreground/50">
          {totalResults}
          {hasExcess ? '+' : ''} Result{totalResults > 1 ? 's' : ''}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex className="items-center justify-between">
      <Flex>
        <SearchInventory />
      </Flex>

      <Flex className="items-center gap-5">
        <Text className="uppercase text-foreground/50">
          {resultAmount}
          {hasExcess ? '+' : ''} Result{resultAmount > 1 ? 's' : ''}
        </Text>

        {/* <ViewTypeToggle /> */}
      </Flex>
    </Flex>
  );
};

const SearchInventory = () => {
  const { searchText } = useSnapshot(inventoryState);

  const [shadowValue, setShadowValue] = useState<string>(searchText);

  const searchDebounce = debounce({ delay: 500 }, (val: string) =>
    setInventorySearchText(val),
  );

  useEffect(() => {
    setShadowValue(searchText);
  }, [searchText]);

  return (
    <Input.Search
      id="inventory-search"
      placeholder="Search"
      value={shadowValue}
      onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setShadowValue(value);
        searchDebounce(value);
      }}
      onClear={() => {
        setShadowValue('');
        clearInventorySearchText();
      }}
    />
  );
};
