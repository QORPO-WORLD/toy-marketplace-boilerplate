import type { Response } from '../res'

import type { OrderItemType } from './shared'

export interface GetOrderMaxQuantitiesArgs {
  chainId: number
  orderType: OrderItemType
  collectionAddress: string
  balanceHolderAddress: string
  tokenIds: string[]
}

export interface OrderMaxQuantities {
  itemMaxQuantities: {
    tokenId: string
    maxQuantity: string
  }[]
}

export interface GetOrderMaxQuantitiesResponse
  extends Response<OrderMaxQuantities | null> {}
