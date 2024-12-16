'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { Accordion, Button, Flex, Input, Text } from '$ui';
import { filters$ } from '../FilterStore';
import type { FilterProps } from './PropertyFilters';
import { observer } from '@legendapp/state/react';
import { capitalize } from 'radash';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const IntFilter = observer(({ filter }: FilterProps) => {
  const { name, min, max } = filter;

  const values = filters$.getFilterValuesByName(name);

  const [localMin, setMin] = useState(values?.[0] || '');
  const [localMax, setMax] = useState(values?.[1] || '');

  const onApplyClick = () => {
    filters$.setIntFilterValue(name, Number(localMin), Number(localMax));
  };
  return (
    <Accordion.Item value={name}>
      <Accordion.Trigger>
        {capitalize(name)}
        <Flex className="ml-auto items-center gap-3">
          {localMin || localMax ? (
            <Text className="text-[#483F50] mr-2 text-xs"></Text>
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
              value={localMin}
              className="w-full"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMin(e.target.value)
              }
            />
            <Text className="text-[#483F50] text-xs uppercase">to</Text>
            <Input.Base
              id="property-max"
              type="number"
              placeholder={String(max)}
              min={min}
              max={max}
              value={localMax}
              className="w-full"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMax(e.target.value)
              }
            />
          </Flex>
          <Button
            className="w-full bg-[#40354579] hover:bg-[#403545]"
            variant="secondary"
            label="Apply"
            onClick={onApplyClick}
          />
        </Flex>
      </Accordion.Content>
    </Accordion.Item>
  );
});
