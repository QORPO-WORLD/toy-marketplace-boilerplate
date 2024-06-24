import { ORDERBOOK_CONTRACT_ADDRESS } from '~/config/consts';
import { Orderbook_ABI } from '~/sdk/orderbook/contracts/abi/orderbook';
import { ERC20_ABI } from '~/sdk/shared/abi/token/ERC20';
import { ERC721_ABI } from '~/sdk/shared/abi/token/ERC721';
import { ERC1155_ABI } from '~/sdk/shared/abi/token/ERC1155';

import type {
  CreateOrder,
  GenerateStepsOrderbookOrderParams,
  AcceptRequest,
} from './index';
import { ethers } from 'ethers';

export const getErc1155ApproveAllTransaction = (
  tokenAddress: string,
  spender: string,
): ethers.providers.TransactionRequest => {
  const erc1155Interface = new ethers.utils.Interface(ERC1155_ABI);
  const erc1155Data = erc1155Interface.encodeFunctionData('setApprovalForAll', [
    spender,
    true,
  ]);
  const erc1155ApprovalTx = {
    to: tokenAddress,
    data: erc1155Data,
  };
  return erc1155ApprovalTx;
};

export const getErc721ApproveAllTransaction = (
  tokenAddress: string,
  spender: string,
): ethers.providers.TransactionRequest => {
  const erc721Interface = new ethers.utils.Interface(ERC721_ABI);
  const erc721Data = erc721Interface.encodeFunctionData('setApprovalForAll', [
    spender,
    true,
  ]);
  const erc721ApprovalTx = {
    to: tokenAddress,
    data: erc721Data,
  };
  return erc721ApprovalTx;
};

export const getErc20ApproveTransaction = (
  currencyAddress: string,
  spender: string,
): ethers.providers.TransactionRequest => {
  const erc20Interface = new ethers.utils.Interface(ERC20_ABI);

  const erc20Data = erc20Interface.encodeFunctionData('approve', [
    spender,
    ethers.constants.MaxUint256,
  ]);

  const erc20ApprovalTx = {
    to: currencyAddress,
    data: erc20Data,
  };
  return erc20ApprovalTx;
};

export const getCreateRequestTransaction = (
  generateStepsParams: GenerateStepsOrderbookOrderParams,
  createOrder: CreateOrder,
) => {
  const { isListing, isERC1155, tokenContract, currency } = generateStepsParams;

  const orderbookInterface = new ethers.utils.Interface(Orderbook_ABI);

  /*
    struct RequestParams {
      bool isListing; // True if the request is a listing, false if it is an offer.
      bool isERC1155; // True if the token is an ERC1155 token, false if it is an ERC721 token.
      address tokenContract;
      uint256 tokenId;
      uint256 quantity;
      uint96 expiry;
      address currency;
      uint256 pricePerToken;
    }
  */

  const { tokenId, pricePerToken, quantity, expiry } = createOrder;

  const createRequestData = orderbookInterface.encodeFunctionData(
    'createRequest',
    [
      {
        isListing,
        isERC1155,
        tokenContract,
        tokenId: BigInt(tokenId),
        quantity: BigInt(quantity),
        currency,
        pricePerToken,
        expiry: BigInt(expiry),
      },
    ],
  );

  const createRequestTx = {
    to: ORDERBOOK_CONTRACT_ADDRESS,
    data: createRequestData,
  };

  return createRequestTx;
};

export const getAcceptRequestBatchTx = (partialOrders: AcceptRequest[]) => {
  const orderbookInterface = new ethers.utils.Interface(Orderbook_ABI);

  const acceptRequestBatchData = orderbookInterface.encodeFunctionData(
    'acceptRequestBatch',
    [
      partialOrders.map((o) => BigInt(o.orderId)),
      partialOrders.map((o) => BigInt(o.quantity)),
      partialOrders.map((o) => o.address),
      // additionalFees and additionalFeeRecipients should be the same for all
      partialOrders[0].additionalFees,
      partialOrders[0].additionalFeeRecipients,
    ],
  );

  const acceptRequestBatchTx = {
    to: ORDERBOOK_CONTRACT_ADDRESS,
    data: acceptRequestBatchData,
  };

  return acceptRequestBatchTx;
};
