/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DOMAttributes } from 'react';

import { SEQUENCE_MARKET_V1_ADDRESS } from '~/config/consts';
import { ERC20 } from '~/lib/sdk/niftyswap-v2';
import { Orderbook } from '~/lib/sdk/orderbook/clients/Orderbook';
import { ERC721 } from '~/lib/sdk/shared/clients/ERC721';
import { ERC1155 } from '~/lib/sdk/shared/clients/ERC1155';

import { sequence } from '0xsequence';
import { Button, ChevronRightIcon, LoaderIcon } from '$ui';
import {
  getErc721ApproveAllTransaction,
  getErc1155ApproveAllTransaction,
  getErc20ApproveTransaction,
  getCreateRequestTransaction,
  getAcceptRequestBatchTx,
} from './transactionData';
import type { ethers } from 'ethers';
import type { Hex } from 'viem';
import type { GetWalletClientData } from 'wagmi/query';

const bundledConnectors = ['sequence'];

export type StepId =
  | 'approveERC20'
  | 'approveERC721'
  | 'approveERC1155'
  | 'createOrder'
  | 'acceptRequestBatch';

export interface StepsResponse {
  steps: Step[];
  isBundled: boolean;
}

export type Step =
  | GenericStep
  | GenerateStepsOrderbookOrder
  | GenerateStepsOrderbookAcceptRequest;

export interface GenericStep {
  id: StepId;
  label: string;
  action: () => Promise<string>;
}

export interface GenerateStepsOrderbookOrder {
  id: 'createOrder';
  label: string;
  action: (params: CreateRequestParams) => Promise<string>;
}

export interface GenerateStepsOrderbookAcceptRequest {
  id: 'acceptRequestBatch';
  label: string;
  action: (params: AcceptRequestParams) => Promise<string>;
}

/// generate steps
export interface GenerateStepsOrderbookOrderParams {
  isListing: boolean;
  isERC1155: boolean;
  currency: Hex;
  tokenContract: Hex;
  isApproved: boolean;
  chainId: number;
  connectorId?: string;
  walletClient?: GetWalletClientData<any, any>;
}

export interface GenerateStepsOrderbookAcceptRequestParams {
  isListing: boolean;
  isERC1155: boolean;
  currency: Hex;
  tokenContract: Hex;
  isApproved: boolean;
  chainId: number;
  connectorId?: string;
  walletClient?: GetWalletClientData<any, any>;
}

export interface AcceptRequest {
  orderId: string;
  quantity: bigint;
  address: string;
  tokenId: string;
  additionalFees: bigint[];
  additionalFeeRecipients: string[];
}

export interface CreateOrder {
  quantity: bigint;
  pricePerToken: bigint;
  expiry: bigint;
  tokenId: string;
}

export interface CreateRequestParams {
  createOrder?: CreateOrder;

  partialOrders?: [AcceptRequest, ...AcceptRequest[]];
}

export interface AcceptRequestParams {
  acceptRequests: [AcceptRequest, ...AcceptRequest[]];
}

export const generateStepsOrderbookAcceptRequest = (
  params: GenerateStepsOrderbookAcceptRequestParams,
): StepsResponse => {
  const {
    connectorId,
    isListing,
    isERC1155,
    tokenContract,
    walletClient,
    isApproved,
    chainId,
    currency,
  } = params;

  const isBundled = bundledConnectors.includes(connectorId || '');
  const steps: Step[] = [];

  if (!walletClient) {
    return {
      steps: [],
      isBundled,
    };
  }

  const requireERC721Approval =
    !isListing && isERC1155 === false && !isApproved;
  const requireERC1155Approval =
    !isListing && isERC1155 === true && !isApproved;
  const requireERC20Approval = isListing && !isApproved;

  if (isBundled) {
    const bundledOrderAction = async ({
      acceptRequests,
    }: AcceptRequestParams) => {
      const txns: ethers.providers.TransactionRequest[] = [];

      if (requireERC721Approval) {
        const erc721ApprovalAllTx = getErc721ApproveAllTransaction(
          tokenContract,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc721ApprovalAllTx);
      }

      if (requireERC1155Approval) {
        const erc1155ApprovalAllTx = getErc1155ApproveAllTransaction(
          tokenContract,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc1155ApprovalAllTx);
      }

      if (requireERC20Approval) {
        const erc20ApprovalTx = getErc20ApproveTransaction(
          currency,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc20ApprovalTx);
      }

      if (acceptRequests.length > 0) {
        const acceptRequestBatchTx = getAcceptRequestBatchTx(acceptRequests);
        txns.push(acceptRequestBatchTx);
      }

      const wallet = sequence.getWallet();
      const signer = wallet.getSigner();
      const response = await signer.sendTransaction(txns);

      return response.hash;
    };

    steps.push({
      id: 'acceptRequestBatch',
      label: isListing ? 'Buy' : 'Sell',
      action: bundledOrderAction,
    });
  } else {
    const orderbook = new Orderbook({
      chainId,
      contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
    });

    if (requireERC721Approval) {
      const approveERC721Action = ERC721.setApprovalForAll.bind(
        null,
        tokenContract,
        SEQUENCE_MARKET_V1_ADDRESS,
        true,
        walletClient,
      );
      steps.push({
        id: 'approveERC721',
        label: 'Approve',
        action: approveERC721Action,
      });
    }

    if (requireERC1155Approval) {
      const approveERC1155Action = ERC1155.setApprovalForAll.bind(
        null,
        tokenContract,
        SEQUENCE_MARKET_V1_ADDRESS,
        true,
        walletClient,
      );
      steps.push({
        id: 'approveERC1155',
        label: 'Approve',
        action: approveERC1155Action,
      });
    }

    if (requireERC20Approval) {
      const approveERC20Action = ERC20.approveInfinite.bind(
        null,
        currency,
        SEQUENCE_MARKET_V1_ADDRESS,
        walletClient,
      );
      steps.push({
        id: 'approveERC20',
        label: 'Approve',
        action: approveERC20Action,
      });
    }

    const acceptBatchAction = async ({
      acceptRequests,
    }: AcceptRequestParams) => {
      if (!acceptRequests.length) {
        throw 'No create order data provided';
      }

      const additionalFeeReceivers = acceptRequests[0]
        .additionalFeeRecipients as Hex[];
      const additionalFees = acceptRequests[0].additionalFees;

      return await orderbook.acceptRequestBatch(
        {
          orderIds: acceptRequests.map((r) => BigInt(r.orderId)),
          quantities: acceptRequests.map((r) => r.quantity),
          receivers: acceptRequests.map((r) => r.address) as Hex[],
          additionalFeeReceivers: additionalFees
            ? additionalFeeReceivers
            : ([] as Hex[]),
          additionalFees: additionalFees ? additionalFees : [],
        },
        walletClient,
      );
    };

    steps.push({
      id: 'acceptRequestBatch',
      label: isListing ? 'Buy' : 'Sell',
      action: acceptBatchAction,
    });
  }

  return {
    steps,
    isBundled,
  };
};

export const generateStepsOrderbookOrder = (
  params: GenerateStepsOrderbookOrderParams,
): StepsResponse => {
  const {
    connectorId,
    isListing,
    isERC1155,
    tokenContract,
    walletClient,
    isApproved,
    chainId,
    currency,
  } = params;

  const isBundled = bundledConnectors.includes(connectorId || '');

  let steps: Step[] = [];

  if (!walletClient) {
    return {
      steps: [],
      isBundled,
    };
  }

  const requireERC721Approval = isListing && isERC1155 === false && !isApproved;
  const requireERC1155Approval = isListing && isERC1155 === true && !isApproved;
  const requireERC20Approval = !isListing && !isApproved;

  if (isBundled) {
    steps = [];

    const bundledOrderAction = async ({
      createOrder,
      partialOrders,
    }: CreateRequestParams) => {
      const txns: ethers.providers.TransactionRequest[] = [];

      if (requireERC721Approval) {
        const erc721ApprovalAllTx = getErc721ApproveAllTransaction(
          tokenContract,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc721ApprovalAllTx);
      }

      if (requireERC1155Approval) {
        const erc1155ApprovalAllTx = getErc1155ApproveAllTransaction(
          tokenContract,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc1155ApprovalAllTx);
      }

      if (requireERC20Approval) {
        const erc20ApprovalTx = getErc20ApproveTransaction(
          currency,
          SEQUENCE_MARKET_V1_ADDRESS,
        );
        txns.push(erc20ApprovalTx);
      }

      if (createOrder) {
        const createOrderTx = getCreateRequestTransaction(params, createOrder);

        txns.push(createOrderTx);
      }

      if (partialOrders && partialOrders.length > 0) {
        const acceptRequestBatchTx = getAcceptRequestBatchTx(partialOrders);
        txns.push(acceptRequestBatchTx);
      }

      const wallet = sequence.getWallet();
      const signer = wallet.getSigner();
      const response = await signer.sendTransaction(txns);

      return response.hash;
    };

    steps.push({
      id: 'createOrder',
      label: 'Create Order',
      action: bundledOrderAction,
    });
  } else {
    const orderbook = new Orderbook({
      chainId,
      contractAddress: SEQUENCE_MARKET_V1_ADDRESS as Hex,
    });

    if (requireERC721Approval) {
      const approveERC721Action = ERC721.setApprovalForAll.bind(
        null,
        tokenContract,
        SEQUENCE_MARKET_V1_ADDRESS,
        true,
        walletClient,
      );
      steps.push({
        id: 'approveERC721',
        label: 'Approve',
        action: approveERC721Action,
      });
    }

    if (requireERC1155Approval) {
      const approveERC1155Action = ERC1155.setApprovalForAll.bind(
        null,
        tokenContract,
        SEQUENCE_MARKET_V1_ADDRESS,
        true,
        walletClient,
      );
      steps.push({
        id: 'approveERC1155',
        label: 'Approve',
        action: approveERC1155Action,
      });
    }

    if (requireERC20Approval) {
      const approveERC20Action = ERC20.approveInfinite.bind(
        null,
        currency,
        SEQUENCE_MARKET_V1_ADDRESS,
        walletClient,
      );
      steps.push({
        id: 'approveERC20',
        label: 'Approve',
        action: approveERC20Action,
      });
    }

    const createOrderAction = async ({ createOrder }: CreateRequestParams) => {
      if (!createOrder) {
        throw 'No create order data provided';
      }

      const { quantity, pricePerToken, expiry, tokenId } = createOrder;

      return await orderbook.createRequest(
        {
          isListing,
          isERC1155,
          tokenContract,
          tokenId: BigInt(tokenId),

          quantity,
          expiry,
          currency,
          pricePerToken,
        },
        walletClient,
      );
    };

    steps.push({
      id: 'createOrder',
      label: isListing ? 'Create Listing' : 'Make Offer',
      action: createOrderAction,
    });
  }

  return {
    steps,
    isBundled,
  };
};

// Generate Buttons
export interface TxButtonProps {
  stepId: string;
  label: string;
  isLoading: boolean;
}

/// generate components
export const TxButton = (
  props: TxButtonProps & DOMAttributes<HTMLButtonElement>,
) => {
  const { stepId, label, isLoading, ...restProps } = props;

  switch (stepId) {
    case 'approveERC1155':
    case 'approveERC20':
    case 'approveERC721':
      <Button {...props}>
        {isLoading ? (
          <>
            Awaiting wallet approval
            <LoaderIcon className="animate-spin" />
          </>
        ) : (
          <>
            {label}
            <ChevronRightIcon />
          </>
        )}
      </Button>;

    default:
      return (
        <Button {...restProps}>
          {isLoading ? <LoaderIcon className="animate-spin" /> : label}
        </Button>
      );
  }
};
