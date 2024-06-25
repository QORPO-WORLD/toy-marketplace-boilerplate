'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import {
  collectibleFilterState,
  updateSelectedPropertyFilter,
} from '~/lib/stores/collectible/Collectible';

import { Button, Accordion, Flex, Input, Text } from '$ui';
import type { FilterProps } from './PropertyFilters';
import { capitalize } from 'radash';
import { useSnapshot } from 'valtio';

export const IntFilter = ({ filter }: FilterProps) => {
  const { name, min, max } = filter;

  const { filterOptions } = useSnapshot(collectibleFilterState);
  const values = filterOptions.find((f) => f.name === name)?.values;

  const [_min, setMin] = useState(values?.[0] || '');
  const [_max, setMax] = useState(values?.[1] || '');

  useEffect(() => {
    if (!values) {
      setMax('');
      setMin('');
    }
  }, [values]);

  const onApplyClick = () => {
    updateSelectedPropertyFilter(filter.name, [_min, _max]);
  };

  return (
    <Accordion.Item value={name}>
      <Accordion.Trigger>
        {capitalize(name)}

        <Flex className="ml-auto items-center gap-3">
          {_min || _max ? (
            <Text className="text-primary mr-2 text-xs">ACTIVE</Text>
          ) : null}
        </Flex>
      </Accordion.Trigger>

      <Accordion.Content asChild>
        <Flex className="flex-col gap-2 p-2 pb-0">
          <Flex className="mt-3 w-full items-center gap-4">
            <Input.Base
              id="property-min"
              type="number"
              placeholder={String(min)}
              min={min}
              max={max}
              value={_min}
              className="w-full"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMin(e.target.value)
              }
            />

            <Text className="text-foreground/80 text-xs uppercase">to</Text>

            <Input.Base
              id="property-max"
              type="number"
              placeholder={String(max)}
              min={min}
              max={max}
              value={_max}
              className="w-full"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMax(e.target.value)
              }
            />
          </Flex>

          <Button
            className="w-full"
            variant="secondary"
            label="Apply"
            onClick={onApplyClick}
          />
        </Flex>
      </Accordion.Content>
    </Accordion.Item>
  );
};
