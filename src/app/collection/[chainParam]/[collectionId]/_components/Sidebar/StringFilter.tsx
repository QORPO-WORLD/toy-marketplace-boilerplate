'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';

import {
  collectibleFilterState,
  updateSelectedPropertyFilter,
} from '~/lib/stores/collectible/Collectible';

import { Accordion, Flex, Input, Text, ScrollArea, Checkbox, Label } from '$ui';
import type { FilterProps } from './PropertyFilters';
import Fuse from 'fuse.js';
import { capitalize } from 'radash';
import { useSnapshot } from 'valtio';

export const StringFilter = (props: FilterProps) => {
  const { name, values } = props.filter;
  const [options, setOptions] = useState<string[]>(values as string[]);

  // Search
  const [search, setSearch] = useState('');
  const showSearchInput = values && values.length > 5;
  const fuse = new Fuse((values as string[]) || []);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value) {
      setOptions(values as string[]);
      return;
    }
    const filtered = fuse.search(value);
    setOptions(filtered.map((filteredItem) => filteredItem.item));
  };

  // Filtered options
  const { filterOptions } = useSnapshot(collectibleFilterState);
  const checks = filterOptions.filter((f) => f.name === name)[0]?.values || [];

  const onCheckChange = useCallback(
    (value: string) => {
      const isChecked = checks.includes(value);
      let newChecks: any[];
      if (isChecked) {
        newChecks = checks.filter((check) => check !== value);
      } else {
        newChecks = [...checks, value];
      }
      updateSelectedPropertyFilter(name, newChecks);
    },
    [checks, name],
  );

  return (
    <Accordion.Item value={name}>
      <Accordion.Trigger>
        {capitalize(name)}

        <Flex className="ml-auto items-center gap-3">
          {checks.length ? (
            <Text as="span" className="text-primary mr-2 text-xs">
              {checks.length} SELECTED
            </Text>
          ) : null}
        </Flex>
      </Accordion.Trigger>

      <Accordion.Content>
        {showSearchInput ? (
          <Input.Search
            id="property-search"
            placeholder={`Search ${name.toUpperCase()}`}
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
            onClear={() => handleSearch('')}
          />
        ) : null}

        {options.length === 0 && (
          <Text as="span" className="text-foreground/40">
            No Results
          </Text>
        )}

        <ScrollArea.Base className="mt-2 flex h-[400px] flex-col">
          {options.map((property, i) => {
            const isChecked = checks.includes(property);

            return (
              <div
                key={i}
                className="hover:bg-foreground/10 flex cursor-pointer items-center justify-between rounded-sm pr-2"
              >
                <Label htmlFor={property} className="w-full py-2 pl-2">
                  {property}
                </Label>

                <Checkbox.Base
                  id={property}
                  checked={isChecked}
                  onCheckedChange={() => onCheckChange(property)}
                />
              </div>
            );
          })}
        </ScrollArea.Base>
      </Accordion.Content>
    </Accordion.Item>
  );
};
