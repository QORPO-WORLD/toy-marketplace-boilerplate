'use client';

import React from 'react';

import { useCollectionRoyalty } from '~/hooks/transactions/useRoyaltyPercentage';

import {
  Avatar,
  Badge,
  Box,
  Flex,
  Grid,
  Image,
  InformationIcon,
  Text,
  Tooltip,
} from '$ui';
import type { OrderbookModalType } from '.';
import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';

export interface TokenSummary {
  tokenMetadata: TokenMetadata;
  collectionData?: ContractInfo;
  type: OrderbookModalType;
}

export const TokenSummary = ({
  tokenMetadata,
  collectionData,
}: TokenSummary) => {
  const { data: royaltyPercentage, isLoading: isRoyaltyInfoLoading } =
    useCollectionRoyalty({
      chainId: collectionData?.chainId,
      tokenId: tokenMetadata.tokenId,
      contractAddress: collectionData?.address,
    });

  return (
    <Box className="w-full rounded-xl bg-foreground/10 p-5">
      <Grid.Root
        className={'gap-x-3 gap-y-1'}
        template={`
            [row1-start] "img collection collection" [row1-end]
            [row2-start] "img name name" [row2-end]
            [row3-start] "img tokenid tokenid" [row3-end]
            [row4-start] "img badges badges" [row4-end]
            / minmax(88px, 88px) 1fr max-content
            `}
      >
        <Grid.Child name="img">
          <Image.Base
            src={tokenMetadata.image}
            alt={tokenMetadata.name}
            containerClassName="aspect-square rounded-none bg-foreground/5"
          />
        </Grid.Child>

        <Grid.Child name="collection">
          <Flex className="flex flex-row items-center justify-start gap-2">
            <Avatar.Base className="h-4 w-4">
              <Avatar.Image src={collectionData?.logoURI} />
              <Avatar.Fallback />
            </Avatar.Base>
            <Text className="text-xs font-medium text-foreground/50">
              {collectionData?.name || 'Collection'}
            </Text>
          </Flex>
        </Grid.Child>

        <Grid.Child name="tokenid">
          <Text className="text-sm font-medium text-foreground/40">
            #{tokenMetadata.tokenId}
          </Text>
        </Grid.Child>

        <Grid.Child name="name">
          <Text
            className="text-sm font-bold max-lines-[3]"
            title={tokenMetadata.name}
          >
            {tokenMetadata.name}
          </Text>
        </Grid.Child>
        <Grid.Child name="badges">
          <Flex className="gap-1">
            {!isRoyaltyInfoLoading && (
              <Badge className="h-6 rounded-sm" variant="muted">
                <Flex className="items-center gap-2">
                  <Text className="text-xs font-semibold text-foreground/50">
                    Royalty fee:{' '}
                    <Text as="span" className="text-xs text-foreground/100">
                      {Number(royaltyPercentage)}%
                    </Text>
                  </Text>

                  <Tooltip.Root>
                    <Tooltip.Trigger onClick={(e) => e.preventDefault()}>
                      <InformationIcon className="h-4 w-4 text-sm text-foreground/30" />
                    </Tooltip.Trigger>

                    <Tooltip.Content>Paid by listing creator.</Tooltip.Content>
                  </Tooltip.Root>
                </Flex>
              </Badge>
            )}
          </Flex>
        </Grid.Child>
      </Grid.Root>
    </Box>
  );
};
