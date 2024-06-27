import type { Response } from '../res'

import type { OrderItemType } from './shared'

export interface GetOrderSummaryArgs {
  chainId: number
  orderType: OrderItemType
  niftyswapExchangeAddress: string
  tokenIds: string[]
  tokenAmounts: string[]
  slippagePercentage: number
}

export interface OrderSummary {
  itemSubtotals: bigint[]
  orderSubtotal: bigint
  estimatedTotal: bigint
  totalWithSlippage: bigint
  lpFeePercentage: number
  totalLpFee: bigint
  royaltyFeePercentage: number
  totalRoyaltyFee: bigint
  slippagePercentage: number
  slippageAmount: bigint
}

export interface GetOrderSummaryResponse
  extends Response<OrderSummary | null> {}
