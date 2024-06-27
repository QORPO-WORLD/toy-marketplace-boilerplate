export enum OrderItemType {
  // base AMM order
  BUY_AMM = 'BUY_AMM',
  SELL_AMM = ' SELL_AMM',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
  UNKNOWN = 'UNKNOWN',

  // external listing order
  BUY_EXTERNAL = 'BUY_EXTERNAL',
  SELL_EXTERNAL = 'SELL_EXTERNAL',

  // orderbook listing order
  BUY_ORDERBOOK = 'BUY_ORDERBOOK',
  SELL_ORDERBOOK = 'SELL_ORDERBOOK'
}
