import { ERC1155 } from '~/lib/sdk/shared/clients/ERC1155';
import { BigIntReplacer } from '~/lib/utils/bigint';

import { useQuery } from '@tanstack/react-query';

interface Props {
  operatorAddress: string;
  erc1155Address: string;
  ownerAddress: string;
  chainId: number;
}

export const useERC1155Approval = (
  arg: Partial<Props & { disabled?: boolean }>,
) =>
  useQuery({
    queryKey: ['erc1155-approval', JSON.stringify(arg, BigIntReplacer)],
    queryFn: () =>
      getERC1155Approval({
        operatorAddress: arg.operatorAddress!,
        erc1155Address: arg.erc1155Address!,
        ownerAddress: arg.ownerAddress!,
        chainId: arg.chainId!,
      }),
    retry: false,
    refetchInterval: 15000,
    enabled:
      !!arg.operatorAddress &&
      !!arg.erc1155Address &&
      !!arg.ownerAddress &&
      !!arg.chainId &&
      !arg.disabled,
  });

const getERC1155Approval = async (arg: Props) => {
  const isApprovedForAll = await ERC1155.isApprovedForAll(
    arg.erc1155Address,
    arg.ownerAddress,
    arg.operatorAddress,
    arg.chainId,
  );

  return {
    isApprovedForAll,
  };
};
