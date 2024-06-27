import type { OrderItemType } from './shared';

export interface GetOrderMaxQuantitiesArgs {
  chainId: number;
  orderType: OrderItemType;
  collectionAddress: string;
  balanceHolderAddress: string;
  tokenIds: string[];
}

export interface OrderMaxQuantities {
  itemMaxQuantities: {
    tokenId: string;
    maxQuantity: string;
  }[];
}
