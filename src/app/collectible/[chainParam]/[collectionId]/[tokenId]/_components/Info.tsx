'use client';

import { ContractTypeBadge } from '~/components/ContractTypeBadge';
import { NetworkIcon } from '~/components/NetworkLabel';
import {
  formatDecimals,
  formatDisplay,
  truncateAtMiddle,
} from '~/lib/utils/helpers';

import { Avatar, Badge, Flex, Text, cn } from '$ui';
import NextLink from 'next/link';
import { useAccount } from 'wagmi';

type CollectibleInfoProps = {
  collectionName: string | undefined;
  contractType: string | undefined;
  collectionImageUrl: string;
  tokenName: string | undefined;
  loading: boolean;
  collectionAddress: string;
  chainId: number;
  tokenId: string;
  tokenDecimals: number;
};

export const CollectibleInfo = ({
  chainId,
  tokenId,
  collectionAddress,
  collectionName,
  collectionImageUrl,
  tokenName,
  tokenDecimals,
  loading,
}: CollectibleInfoProps) => {
  const { address } = useAccount();
  // const pathname = usePathname();

  // const isConnected = useIsConnected();

  // const { data: userBalance, isLoading: isBalanceLoading } =
  //   useCollectibleBalance({
  //     chainId: chainId,
  //     userAddress: address as string,
  //     contractAddress: collectionAddress,
  //     tokenId,
  //   });

  // const userTokenBalance = userBalance
  //   ? formatDisplay(formatDecimals(userBalance, tokenDecimals))
  //   : 0;

  return (
    <Flex className="flex-col gap-2">
      <Flex className="items-center gap-2">
        <Avatar.Base>
          <Avatar.Image src={collectionImageUrl} />
          <Avatar.Fallback>{collectionName}</Avatar.Fallback>
        </Avatar.Base>

        <Flex className="flex-col">
          <Flex className="items-center gap-2">
            <NextLink
              className={cn(
                'text-md font-medium text-foreground/90 underline-offset-4 hover:underline focus:underline',
                loading ? 'loading' : '',
              )}
              href={''}
            >
              {collectionName ?? '<unknown>'}
            </NextLink>
            <NetworkIcon size="sm" chainId={chainId} />
          </Flex>
        </Flex>
        <ContractTypeBadge
          chainId={chainId}
          collectionAddress={collectionAddress}
        />
      </Flex>

      <Flex className="mt-4 flex-col gap-1">
        <Text
          as="h6"
          className="text-lg font-semibold text-foreground/50 animate-in fade-in"
          loading={loading}
          title={tokenId}
        >
          #{truncateAtMiddle(tokenId, 20) || '--'}
        </Text>

        <Text
          as="h1"
          className="text-xl font-bold text-foreground/90 animate-in fade-in"
          loading={loading}
        >
          {tokenName}
        </Text>
      </Flex>

      {/* {isConnected && (
        <Flex className="flex-wrap gap-3">
          <Badge variant="muted" loading={isBalanceLoading}>
            <span>{userTokenBalance}</span>&nbsp;Owned
          </Badge>
        </Flex>
      )} */}
    </Flex>
  );
};
