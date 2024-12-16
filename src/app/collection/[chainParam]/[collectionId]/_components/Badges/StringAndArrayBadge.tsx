'use client';

import { Badge, CloseIcon, Text } from '$ui';
import { filters$ } from '../FilterStore';

type StringAndArrayBadge = {
  filter: {
    name: string;
    values?: string[];
  };
};

export const StringAndArrayBadge = ({ filter }: StringAndArrayBadge) => {
  const { name, values = [] } = filter;

  return (
    <Badge
      size="lg"
      variant="outline"
      className="text-[#483F50] font-DMSans uppercase font-bold"
    >
      {name}:&nbsp;
      <Text className="text-[#483F50] font-DMSans capitalize font-medium">
        {values.join(', ').toLocaleLowerCase()}
      </Text>
      <CloseIcon
        className="ml-2 cursor-pointer"
        onClick={() => {
          filters$.deleteFilter(name);
        }}
      />
    </Badge>
  );
};
