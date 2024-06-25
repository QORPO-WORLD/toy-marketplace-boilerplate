'use client';

import { Flex, Text, cn } from '$ui';

type InfoBoxProps = {
  label: string;
  value: string;
  loading?: boolean;
  title?: string;
};

export const InfoBox = ({ label, value, loading, title }: InfoBoxProps) => {
  return (
    <Flex className="flex-col" title={title}>
      <Text
        as="span"
        loading={loading}
        className="text-sm font-medium text-foreground/40"
      >
        {label}
      </Text>
      <Text
        loading={loading}
        className={cn(
          'h-full w-full min-w-full text-sm font-semibold',
          'md:text-lg',
          loading ? 'mt-1' : '',
        )}
      >
        {value}
      </Text>
    </Flex>
  );
};
