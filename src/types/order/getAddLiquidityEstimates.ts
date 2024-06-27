import type {
  AddLiquidityEstimateInputItem,
  AddLiquidityEstimateOutputItem
} from '~/sdk/niftyswap-v2/clients/Niftyswap'

import type { Response } from '../res'

import type { OrderItemType } from './shared'

export interface GetAddLiquidityEstimatesArgs {
  chainId: number
  orderType: OrderItemType
  niftyswapExchangeAddress: string
  input: AddLiquidityEstimateInputItem[]
  slippagePercentage: number
}

export interface AddLiquidityEstimates extends AddLiquidityEstimateOutputItem {}

export interface GetLiquidityEstimatesResponse
  extends Response<AddLiquidityEstimates | null> {}
