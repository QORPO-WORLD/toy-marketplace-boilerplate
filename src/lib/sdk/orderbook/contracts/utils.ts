import { ZERO_ADDRESS } from '../../shared/utils';
import type { OrderRequest } from '../clients/Orderbook';

const EMPTY_ORDER: OrderRequest = {
  creator: ZERO_ADDRESS,
  isListing: false,
  isERC1155: false,
  tokenContract: ZERO_ADDRESS,
  tokenId: 0n,
  quantity: 0n,
  expiry: 0n,
  currency: ZERO_ADDRESS,
  pricePerToken: 0n,
};

export const isEmptyOrder = (order: OrderRequest): boolean => {
  let isEmpty = true;
  Object.keys(order).forEach((key) => {
    if (
      order[key as keyof OrderRequest] !==
      EMPTY_ORDER[key as keyof OrderRequest]
    ) {
      isEmpty = false;
    }
  });

  return isEmpty;
};
