'use client';

import { formatDisplay } from '~/lib/utils/helpers';

import { Avatar, Flex, Text, cn } from '$ui';
import type { Hex } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface CryptoBalanceProps {
  name: string;
  tokenAddress?: string;
  wrapTargetId?: string;
  tokenImageUrl: string;
  decimalsMax: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CryptoBalance = (props: CryptoBalanceProps) => {
  const { tokenImageUrl, name, tokenAddress } = props;

  const { address } = useAccount();
  const { data, isLoading, isError } = useBalance({
    address,
    token: tokenAddress as Hex | undefined,
  });

  if (isError) {
    return (
      <BalanceContainer>
        <Text className="text-destructive">Failed to fetch balance</Text>
      </BalanceContainer>
    );
  }

  return (
    <BalanceContainer isLoading={isLoading}>
      <Flex className="items-center gap-2">
        <Avatar.Base>
          <Avatar.Image src={tokenImageUrl} />
        </Avatar.Base>

        <Text className="text-lg font-semibold text-foreground/80">
          {data?.symbol ?? ''}
        </Text>

        <Text className="text-sm font-medium text-foreground/50">{name}</Text>
      </Flex>

      <Flex className="items-center gap-3 py-2">
        <Text title={data?.formatted ?? '0'}>
          {formatDisplay(data?.formatted ?? 0)}
        </Text>
      </Flex>
    </BalanceContainer>
  );
};

const BalanceContainer = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) => (
  <Flex
    className={cn(
      'h-fit items-center justify-between rounded-sm bg-foreground/10 px-4 py-1',
      isLoading ? 'loading-box' : '',
    )}
  >
    {children}
  </Flex>
);
