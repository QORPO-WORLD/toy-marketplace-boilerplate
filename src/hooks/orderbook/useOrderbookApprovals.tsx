import type { OrderbookModalType } from '~/components/modals/OrderModalContent';
import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { useERC20Approval } from '~/hooks/transactions/useERC20Approval';
import { useERC721Approval } from '~/hooks/transactions/useERC721Approval';
import { useERC1155Approval } from '~/hooks/transactions/useERC1155Approval';
import { ERC20 } from '~/lib/sdk/niftyswap-v2';
import { ERC721 } from '~/lib/sdk/shared/clients/ERC721';
import { ERC1155 } from '~/lib/sdk/shared/clients/ERC1155';

import type { Hex } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

interface Props {
  erc20Amount: bigint;
  erc20Address: string;
  userAddress: Hex | undefined;
  chainId: number;
  collectionAddress: Hex;
  type: OrderbookModalType;
  isErc1155: boolean;
  orderbookAddress: Hex;
  walletClient: GetWalletClientData<any, any> | undefined;
}

export const useOrderbookApprovals = ({
  erc20Amount,
  erc20Address,
  userAddress,
  chainId,
  collectionAddress,
  type,
  isErc1155,
  orderbookAddress,
  walletClient,
}: Props) => {
  const erc20ApprovalEnabled = !!erc20Amount && type === 'offer';

  const {
    data: erc20Approval,
    isLoading: isErc20ApprovalLoading,
    refetch: refetchErc20Approval,
  } = useERC20Approval({
    spenderAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc20Address: erc20Address,
    userAddress: userAddress,
    targetAmount: erc20Amount,
    chainId: chainId,
    disabled: !erc20ApprovalEnabled,
  });

  const erc721ApprovalEnabled = type === 'listing' && isErc1155 === false;

  const {
    data: erc721Approval,
    isLoading: isErc721ApprovalLoading,
    refetch: refetchERC721Approval,
  } = useERC721Approval({
    operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc721Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc721ApprovalEnabled,
  });

  const erc1155ApprovalEnabled = type === 'listing' && isErc1155 === true;

  const {
    data: erc1155Approval,
    isLoading: isErc1155ApprovalLoading,
    refetch: refetchERC1155Approval,
  } = useERC1155Approval({
    operatorAddress: SEQUENCE_MARKET_V1_ADDRESS,
    erc1155Address: collectionAddress,
    ownerAddress: userAddress,
    chainId: chainId,
    disabled: !erc1155ApprovalEnabled,
  });

  const setErc1155Approval = async (): Promise<string> => {
    if (!walletClient) {
      throw 'no wallet clinet';
    }

    const txnHash = await ERC1155.setApprovalForAll(
      collectionAddress,
      SEQUENCE_MARKET_V1_ADDRESS,
      true,
      walletClient,
    );

    return txnHash;
  };

  const setErc721Approval = async (): Promise<string> => {
    if (!walletClient) {
      throw 'no wallet client';
    }

    const txnHash = await ERC721.setApprovalForAll(
      collectionAddress,
      SEQUENCE_MARKET_V1_ADDRESS,
      true,
      walletClient,
    );

    return txnHash;
  };

  const setErc20Approval = async (): Promise<string> => {
    if (!walletClient) {
      throw 'no wallet client';
    }

    const txnHash = await ERC20.approveInfinite(
      erc20Address,
      SEQUENCE_MARKET_V1_ADDRESS,
      walletClient,
    );

    return txnHash;
  };

  if (erc1155ApprovalEnabled) {
    return {
      data: erc1155Approval?.isApprovedForAll,
      isLoading: isErc1155ApprovalLoading,
      refetch: refetchERC1155Approval,
      setApproval: setErc1155Approval,
    };
  } else if (erc721ApprovalEnabled) {
    return {
      data: erc721Approval?.isApprovedForAll,
      isLoading: isErc721ApprovalLoading,
      refetch: refetchERC721Approval,
      setApproval: setErc721Approval,
    };
  } else {
    return {
      data: !erc20Approval?.isRequiresAllowanceApproval,
      isLoading: isErc20ApprovalLoading,
      refetch: refetchErc20Approval,
      setApproval: setErc20Approval,
    };
  }
};
