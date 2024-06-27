/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useState } from 'react';

import { BigIntCast } from '~/lib/utils/helpers';
import { type OrderItemType } from '~/types/OrderItemType';
import type { GetOrderMaxQuantitiesArgs } from '~/types/order/getOrderMaxQuantities';

import { toast } from '$ui';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface UseOrderItemMaxQuantityProps {
  chainId: number;
  itemType: OrderItemType;
  exchangeAddress?: string;
  collectionAddress?: string;
  tokenId: string;
}

export const useOrderItemMaxQuantity = (item: UseOrderItemMaxQuantityProps) => {
  // TODO
  // const [maxQuantity, setMaxQuantity] = useState<bigint>();
  // const [isLoading, setIsLoading] = useState(false);

  // const { address: userAddress } = useAccount();

  // let balanceHolderAddress: string | undefined = undefined;

  // switch (item.itemType) {
  //   case OrderItemType.TRANSFER:
  //     balanceHolderAddress = userAddress;
  //     break;
  //   default:
  //     break;
  // }

  // const args: GetOrderMaxQuantitiesArgs = {
  //   chainId: item.chainId,
  //   orderType: item.itemType,
  //   collectionAddress: item.collectionAddress || '',
  //   balanceHolderAddress: balanceHolderAddress || '',
  //   tokenIds: [item.tokenId],
  // };

  // const {
  //   data: maxQuantitiesResp,
  //   refetch,
  //   isStale,
  //   isFetched,
  // } = useQuery({
  //   queryKey: ['orderMaxQuantities', args],
  //   queryFn: () => fetchOrderMaxQuantities(args),
  //   retry: false,
  //   staleTime: 15 * time.oneSecond,
  //   enabled: false,
  // });

  // const lazyFetch = async (): Promise<bigint | undefined> => {
  //   setIsLoading(true);

  //   let data = maxQuantitiesResp;

  //   if (isStale || !isFetched) {
  //     // manually refetch
  //     const {
  //       data: maxQuantitiesResp,
  //       isRefetchError,
  //       error,
  //     } = await refetch();

  //     if (isRefetchError) {
  //       console.error(error);
  //       toast.error('Error fetching max quantity', {
  //         toastId: 'error-fetching-max-quantity',
  //       });
  //       return;
  //     }

  //     data = maxQuantitiesResp;
  //   }

  //   // format
  //   const maxQuantity = data?.data?.itemMaxQuantities[0].maxQuantity;

  //   setIsLoading(false);
  //   setMaxQuantity(BigIntCast(maxQuantity));

  //   if (maxQuantity) {
  //     return BigInt(maxQuantity);
  //   } else {
  //     return undefined;
  //   }
  // };

  // return {
  //   maxQuantity,
  //   isLoading,
  //   getMaxQuantity: lazyFetch,
  // };
  return {};
};
