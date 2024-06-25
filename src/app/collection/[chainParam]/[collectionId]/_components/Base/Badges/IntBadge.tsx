'use client';

import { removeFilterOption } from '~/lib/stores';

import { Badge, CloseIcon, Text } from '$ui';

type IntBadgeProps = {
  name: string;
  min?: number | undefined;
  max?: number | undefined;
};

export const IntBadge = ({ name, min, max }: IntBadgeProps) => {
  return (
    <Badge size="lg" variant="outline" className="capitalize">
      {name}:&nbsp; <Text className="text-foreground">{min}</Text>&nbsp;to&nbsp;
      <Text className="text-foreground">{max}</Text>
      <CloseIcon
        className="ml-2 cursor-pointer"
        onClick={() => {
          removeFilterOption(name);
        }}
      />
    </Badge>
  );
};
