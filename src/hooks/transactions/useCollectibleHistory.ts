import { fetchTransactionHistory } from '~/clients';

import type { Page } from '@0xsequence/indexer';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useCollectibleHistory = ({
  chainId,
  transferAddress,
  tokenId,
  transferCount = 40,
  includeMetadata = true,
}: {
  chainId?: number;
  transferAddress?: string;
  tokenId?: string;
  transferCount?: number;
  includeMetadata?: boolean;
}) =>
  useInfiniteQuery({
    queryKey: ['transactionHistory', chainId, transferAddress],
    queryFn: ({ pageParam }: { pageParam?: Page }) =>
      fetchTransactionHistory(chainId!, {
        filter: {
          accountAddress: transferAddress,
          tokenID: tokenId,
        },
        page: { after: pageParam?.after || undefined, pageSize: transferCount },
        includeMetadata,
        metadataOptions: {
          verifiedOnly: true,
          includeContracts: transferAddress ? [transferAddress] : [],
        },
      }),
    initialPageParam: undefined,
    getNextPageParam: ({ page: pageResponse }) =>
      pageResponse.more ? pageResponse : undefined,
    enabled: !!chainId && !!transferAddress,
  });
