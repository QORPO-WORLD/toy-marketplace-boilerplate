/* eslint-disable */
// marketplace-api  9001b74871e8b3204b8e1df17c085f041273210c
// --
// Code generated by webrpc-gen@v0.18.3 with typescript generator. DO NOT EDIT.
//
// webrpc-gen -schema=marketplace.ridl -target=typescript -client -out=./clients/marketplace.gen.ts

// WebRPC description and code-gen version
export const WebRPCVersion = "v1"

// Schema version of your RIDL schema
export const WebRPCSchemaVersion = ""

// Schema hash generated from your RIDL schema
export const WebRPCSchemaHash = "9001b74871e8b3204b8e1df17c085f041273210c"

//
// Types
//


export interface TokenMetadata {
  tokenId: string
  name: string
  description?: string
  image?: string
  video?: string
  audio?: string
  properties?: {[key: string]: any}
  attributes: Array<{[key: string]: any}>
  image_data?: string
  external_url?: string
  background_color?: string
  animation_url?: string
  decimals?: number
  updatedAt?: string
  assets?: Array<Asset>
}

export interface Asset {
  id: number
  collectionId: number
  tokenId: string
  url?: string
  metadataField: string
  name?: string
  filesize?: number
  mimeType?: string
  width?: number
  height?: number
  updatedAt?: string
}

export enum SortOrder {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum PropertyType {
  INT = 'INT',
  STRING = 'STRING',
  ARRAY = 'ARRAY',
  GENERIC = 'GENERIC'
}

export enum MarketplaceKind {
  unknown = 'unknown',
  sequence_marketplace_v1 = 'sequence_marketplace_v1',
  sequence_marketplace_v2 = 'sequence_marketplace_v2',
  opensea = 'opensea',
  magic_eden = 'magic_eden',
  mintify = 'mintify',
  looks_rare = 'looks_rare',
  x2y2 = 'x2y2',
  sudo_swap = 'sudo_swap',
  coinbase = 'coinbase',
  rarible = 'rarible',
  nftx = 'nftx',
  foundation = 'foundation',
  manifold = 'manifold',
  zora = 'zora',
  blur = 'blur',
  super_rare = 'super_rare',
  okx = 'okx',
  element = 'element',
  aqua_xyz = 'aqua_xyz',
  auranft_co = 'auranft_co'
}

export enum SourceKind {
  unknown = 'unknown',
  external = 'external',
  sequence_marketplace_v1 = 'sequence_marketplace_v1',
  sequence_marketplace_v2 = 'sequence_marketplace_v2'
}

export enum OrderSide {
  unknown = 'unknown',
  listing = 'listing',
  offer = 'offer'
}

export enum OrderStatus {
  unknown = 'unknown',
  active = 'active',
  inactive = 'inactive',
  expired = 'expired',
  cancelled = 'cancelled',
  filled = 'filled'
}

export enum CollectionStatus {
  unknown = 'unknown',
  created = 'created',
  syncing_tokens = 'syncing_tokens',
  synced_tokens = 'synced_tokens',
  syncing_orders = 'syncing_orders',
  active = 'active',
  failed = 'failed',
  inactive = 'inactive'
}

export enum ProjectStatus {
  unknown = 'unknown',
  active = 'active',
  inactive = 'inactive'
}

export enum CollectibleStatus {
  unknown = 'unknown',
  active = 'active',
  inactive = 'inactive'
}

export interface Page {
  page: number
  pageSize: number
  more?: boolean
  sort?: Array<SortBy>
}

export interface SortBy {
  column: string
  order: SortOrder
}

export interface Filter {
  text?: string
  properties?: Array<PropertyFilter>
}

export interface PropertyFilter {
  name: string
  type: PropertyType
  min?: number
  max?: number
  values?: Array<any>
}

export interface CollectiblesFilter {
  includeEmpty: boolean
  searchText?: string
  properties?: Array<PropertyFilter>
  marketplaces?: Array<MarketplaceKind>
  inAccounts?: Array<string>
  notInAccounts?: Array<string>
  ordersCreatedBy?: Array<string>
  ordersNotCreatedBy?: Array<string>
}

export interface Order {
  collectibleId: number
  orderId: string
  marketplace: MarketplaceKind
  side: OrderSide
  status: OrderStatus
  chainId: number
  collectionContractAddress: string
  tokenId: string
  createdBy: string
  priceAmount: string
  priceAmountFormatted: string
  priceAmountNet: string
  priceAmountNetFormatted: string
  priceCurrencyAddress: string
  priceDecimals: number
  priceUSD: number
  quantityInitial: string
  quantityInitialFormatted: string
  quantityRemaining: string
  quantityRemainingFormatted: string
  quantityAvailable: string
  quantityAvailableFormatted: string
  quantityDecimals: number
  feeBps: number
  feeBreakdown: Array<FeeBreakdown>
  validFrom: string
  validUntil: string
  orderCreatedAt?: string
  orderUpdatedAt?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface FeeBreakdown {
  kind: string
  recipientAddress: string
  bps: number
}

export interface CollectibleOrder {
  metadata: TokenMetadata
  order?: Order
}

export interface OrderFilter {
  createdBy?: Array<string>
  marketplace?: Array<MarketplaceKind>
}

export interface Activity {
  type: string
  fromAddress: string
  toAddress: string
  txHash: string
  timestamp: number
  tokenId: string
  tokenImage: string
  tokenName: string
  currency?: Currency
}

export interface Collection {
  status: CollectionStatus
  chainId: number
  contractAddress: string
  tokenQuantityDecimals: number
  config: CollectionConfig
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface CollectionConfig {
  lastSynced: {[key: string]: CollectionLastSynced}
}

export interface CollectionLastSynced {
  allOrders: string
  newOrders: string
}

export interface Project {
  projectId: number
  chainId: number
  contractAddress: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Collectible {
  chainId: number
  contractAddress: string
  status: CollectibleStatus
  tokenId: string
  lowestListingPriceUsd?: number
  lowestListingOrderId?: number
  highestOfferPriceUsd?: number
  highestOfferOrderId?: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Currency {
  id: number
  chainId: number
  contractAddress: string
  name: string
  symbol: string
  decimals: number
  imageUrl: string
  exchangeRate: number
  defaultChainCurrency: boolean
  creditCardSupported: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
}


export interface Marketplace {
  listCurrencies(headers?: object, signal?: AbortSignal): Promise<ListCurrenciesReturn>
  getCollectible(args: GetCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleReturn>
  getCollectibleLowestOffer(args: GetCollectibleLowestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestOfferReturn>
  getCollectibleHighestOffer(args: GetCollectibleHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestOfferReturn>
  getCollectibleLowestListing(args: GetCollectibleLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestListingReturn>
  getCollectibleHighestListing(args: GetCollectibleHighestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestListingReturn>
  listCollectibleListings(args: ListCollectibleListingsArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleListingsReturn>
  listCollectibleOffers(args: ListCollectibleOffersArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleOffersReturn>
  listCollectiblesWithLowestListing(args: ListCollectiblesWithLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithLowestListingReturn>
  listCollectiblesWithHighestOffer(args: ListCollectiblesWithHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithHighestOfferReturn>
  syncOrder(args: SyncOrderArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrderReturn>
  syncOrders(args: SyncOrdersArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrdersReturn>
}

export interface ListCurrenciesArgs {
}

export interface ListCurrenciesReturn {
  currencies: Array<Currency>  
}
export interface GetCollectibleArgs {
  contractAddress: string
  tokenId: string
}

export interface GetCollectibleReturn {
  metadata: TokenMetadata  
}
export interface GetCollectibleLowestOfferArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
}

export interface GetCollectibleLowestOfferReturn {
  order: Order  
}
export interface GetCollectibleHighestOfferArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
}

export interface GetCollectibleHighestOfferReturn {
  order: Order  
}
export interface GetCollectibleLowestListingArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
}

export interface GetCollectibleLowestListingReturn {
  order: Order  
}
export interface GetCollectibleHighestListingArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
}

export interface GetCollectibleHighestListingReturn {
  order: Order  
}
export interface ListCollectibleListingsArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
  page?: Page
}

export interface ListCollectibleListingsReturn {
  listings: Array<Order>
  page?: Page  
}
export interface ListCollectibleOffersArgs {
  contractAddress: string
  tokenId: string
  filter?: OrderFilter
  page?: Page
}

export interface ListCollectibleOffersReturn {
  offers: Array<Order>
  page?: Page  
}
export interface ListCollectiblesWithLowestListingArgs {
  contractAddress: string
  filter?: CollectiblesFilter
  page?: Page
}

export interface ListCollectiblesWithLowestListingReturn {
  collectibles: Array<CollectibleOrder>
  page?: Page  
}
export interface ListCollectiblesWithHighestOfferArgs {
  contractAddress: string
  filter?: CollectiblesFilter
  page?: Page
}

export interface ListCollectiblesWithHighestOfferReturn {
  collectibles: Array<CollectibleOrder>
  page?: Page  
}
export interface SyncOrderArgs {
  order: Order
}

export interface SyncOrderReturn {  
}
export interface SyncOrdersArgs {
  orders: Array<Order>
}

export interface SyncOrdersReturn {  
}


  
export class Marketplace implements Marketplace {
  protected hostname: string
  protected fetch: Fetch
  protected path = '/rpc/Marketplace/'

  constructor(hostname: string, fetch: Fetch) {
    this.hostname = hostname
    this.fetch = (input: RequestInfo, init?: RequestInit) => fetch(input, init)
  }

  private url(name: string): string {
    return this.hostname + this.path + name
  }
  
  listCurrencies = (headers?: object, signal?: AbortSignal): Promise<ListCurrenciesReturn> => {
    return this.fetch(
      this.url('ListCurrencies'),
      createHTTPRequest({}, headers, signal)
      ).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          currencies: <Array<Currency>>(_data.currencies),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  getCollectible = (args: GetCollectibleArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleReturn> => {
    return this.fetch(
      this.url('GetCollectible'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          metadata: <TokenMetadata>(_data.metadata),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  getCollectibleLowestOffer = (args: GetCollectibleLowestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestOfferReturn> => {
    return this.fetch(
      this.url('GetCollectibleLowestOffer'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          order: <Order>(_data.order),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  getCollectibleHighestOffer = (args: GetCollectibleHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestOfferReturn> => {
    return this.fetch(
      this.url('GetCollectibleHighestOffer'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          order: <Order>(_data.order),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  getCollectibleLowestListing = (args: GetCollectibleLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleLowestListingReturn> => {
    return this.fetch(
      this.url('GetCollectibleLowestListing'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          order: <Order>(_data.order),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  getCollectibleHighestListing = (args: GetCollectibleHighestListingArgs, headers?: object, signal?: AbortSignal): Promise<GetCollectibleHighestListingReturn> => {
    return this.fetch(
      this.url('GetCollectibleHighestListing'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          order: <Order>(_data.order),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  listCollectibleListings = (args: ListCollectibleListingsArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleListingsReturn> => {
    return this.fetch(
      this.url('ListCollectibleListings'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          listings: <Array<Order>>(_data.listings),
          page: <Page>(_data.page),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  listCollectibleOffers = (args: ListCollectibleOffersArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectibleOffersReturn> => {
    return this.fetch(
      this.url('ListCollectibleOffers'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          offers: <Array<Order>>(_data.offers),
          page: <Page>(_data.page),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  listCollectiblesWithLowestListing = (args: ListCollectiblesWithLowestListingArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithLowestListingReturn> => {
    return this.fetch(
      this.url('ListCollectiblesWithLowestListing'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          collectibles: <Array<CollectibleOrder>>(_data.collectibles),
          page: <Page>(_data.page),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  listCollectiblesWithHighestOffer = (args: ListCollectiblesWithHighestOfferArgs, headers?: object, signal?: AbortSignal): Promise<ListCollectiblesWithHighestOfferReturn> => {
    return this.fetch(
      this.url('ListCollectiblesWithHighestOffer'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {
          collectibles: <Array<CollectibleOrder>>(_data.collectibles),
          page: <Page>(_data.page),
        }
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  syncOrder = (args: SyncOrderArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrderReturn> => {
    return this.fetch(
      this.url('SyncOrder'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {}
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
  syncOrders = (args: SyncOrdersArgs, headers?: object, signal?: AbortSignal): Promise<SyncOrdersReturn> => {
    return this.fetch(
      this.url('SyncOrders'),
      createHTTPRequest(args, headers, signal)).then((res) => {
      return buildResponse(res).then(_data => {
        return {}
      })
    }, (error) => {
      throw WebrpcRequestFailedError.new({ cause: `fetch(): ${error.message || ''}` })
    })
  }
  
}

  const createHTTPRequest = (body: object = {}, headers: object = {}, signal: AbortSignal | null = null): object => {
  return {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
    signal
  }
}

const buildResponse = (res: Response): Promise<any> => {
  return res.text().then(text => {
    let data
    try {
      data = JSON.parse(text)
    } catch(error) {
      let message = ''
      if (error instanceof Error)  {
        message = error.message
      }
      throw WebrpcBadResponseError.new({
        status: res.status,
        cause: `JSON.parse(): ${message}: response text: ${text}`},
      )
    }
    if (!res.ok) {
      const code: number = (typeof data.code === 'number') ? data.code : 0
      throw (webrpcErrorByCode[code] || WebrpcError).new(data)
    }
    return data
  })
}

//
// Errors
//

export class WebrpcError extends Error {
  name: string
  code: number
  message: string
  status: number
  cause?: string

  /** @deprecated Use message instead of msg. Deprecated in webrpc v0.11.0. */
  msg: string

  constructor(name: string, code: number, message: string, status: number, cause?: string) {
    super(message)
    this.name = name || 'WebrpcError'
    this.code = typeof code === 'number' ? code : 0
    this.message = message || `endpoint error ${this.code}`
    this.msg = this.message
    this.status = typeof status === 'number' ? status : 0
    this.cause = cause
    Object.setPrototypeOf(this, WebrpcError.prototype)
  }

  static new(payload: any): WebrpcError {
    return new this(payload.error, payload.code, payload.message || payload.msg, payload.status, payload.cause)
  }
}

// Webrpc errors

export class WebrpcEndpointError extends WebrpcError {
  constructor(
    name: string = 'WebrpcEndpoint',
    code: number = 0,
    message: string = 'endpoint error',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcEndpointError.prototype)
  }
}

export class WebrpcRequestFailedError extends WebrpcError {
  constructor(
    name: string = 'WebrpcRequestFailed',
    code: number = -1,
    message: string = 'request failed',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcRequestFailedError.prototype)
  }
}

export class WebrpcBadRouteError extends WebrpcError {
  constructor(
    name: string = 'WebrpcBadRoute',
    code: number = -2,
    message: string = 'bad route',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcBadRouteError.prototype)
  }
}

export class WebrpcBadMethodError extends WebrpcError {
  constructor(
    name: string = 'WebrpcBadMethod',
    code: number = -3,
    message: string = 'bad method',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcBadMethodError.prototype)
  }
}

export class WebrpcBadRequestError extends WebrpcError {
  constructor(
    name: string = 'WebrpcBadRequest',
    code: number = -4,
    message: string = 'bad request',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcBadRequestError.prototype)
  }
}

export class WebrpcBadResponseError extends WebrpcError {
  constructor(
    name: string = 'WebrpcBadResponse',
    code: number = -5,
    message: string = 'bad response',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcBadResponseError.prototype)
  }
}

export class WebrpcServerPanicError extends WebrpcError {
  constructor(
    name: string = 'WebrpcServerPanic',
    code: number = -6,
    message: string = 'server panic',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcServerPanicError.prototype)
  }
}

export class WebrpcInternalErrorError extends WebrpcError {
  constructor(
    name: string = 'WebrpcInternalError',
    code: number = -7,
    message: string = 'internal error',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcInternalErrorError.prototype)
  }
}

export class WebrpcClientDisconnectedError extends WebrpcError {
  constructor(
    name: string = 'WebrpcClientDisconnected',
    code: number = -8,
    message: string = 'client disconnected',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcClientDisconnectedError.prototype)
  }
}

export class WebrpcStreamLostError extends WebrpcError {
  constructor(
    name: string = 'WebrpcStreamLost',
    code: number = -9,
    message: string = 'stream lost',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcStreamLostError.prototype)
  }
}

export class WebrpcStreamFinishedError extends WebrpcError {
  constructor(
    name: string = 'WebrpcStreamFinished',
    code: number = -10,
    message: string = 'stream finished',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, WebrpcStreamFinishedError.prototype)
  }
}


// Schema errors

export class UnauthorizedError extends WebrpcError {
  constructor(
    name: string = 'Unauthorized',
    code: number = 1000,
    message: string = 'Unauthorized access',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class PermissionDeniedError extends WebrpcError {
  constructor(
    name: string = 'PermissionDenied',
    code: number = 1001,
    message: string = 'Permission denied',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, PermissionDeniedError.prototype)
  }
}

export class SessionExpiredError extends WebrpcError {
  constructor(
    name: string = 'SessionExpired',
    code: number = 1002,
    message: string = 'Session expired',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, SessionExpiredError.prototype)
  }
}

export class MethodNotFoundError extends WebrpcError {
  constructor(
    name: string = 'MethodNotFound',
    code: number = 1003,
    message: string = 'Method not found',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, MethodNotFoundError.prototype)
  }
}

export class TimeoutError extends WebrpcError {
  constructor(
    name: string = 'Timeout',
    code: number = 2000,
    message: string = 'Request timed out',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}

export class InvalidArgumentError extends WebrpcError {
  constructor(
    name: string = 'InvalidArgument',
    code: number = 2001,
    message: string = 'Invalid argument',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, InvalidArgumentError.prototype)
  }
}

export class NotFoundError extends WebrpcError {
  constructor(
    name: string = 'NotFound',
    code: number = 3000,
    message: string = 'Resource not found',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UserNotFoundError extends WebrpcError {
  constructor(
    name: string = 'UserNotFound',
    code: number = 3001,
    message: string = 'User not found',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, UserNotFoundError.prototype)
  }
}

export class ProjectNotFoundError extends WebrpcError {
  constructor(
    name: string = 'ProjectNotFound',
    code: number = 3002,
    message: string = 'Project not found',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, ProjectNotFoundError.prototype)
  }
}

export class InvalidTierError extends WebrpcError {
  constructor(
    name: string = 'InvalidTier',
    code: number = 3003,
    message: string = 'Invalid subscription tier',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, InvalidTierError.prototype)
  }
}

export class ProjectLimitReachedError extends WebrpcError {
  constructor(
    name: string = 'ProjectLimitReached',
    code: number = 3005,
    message: string = 'Project limit reached',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, ProjectLimitReachedError.prototype)
  }
}

export class NotImplementedError extends WebrpcError {
  constructor(
    name: string = 'NotImplemented',
    code: number = 9999,
    message: string = 'Not Implemented',
    status: number = 0,
    cause?: string
  ) {
    super(name, code, message, status, cause)
    Object.setPrototypeOf(this, NotImplementedError.prototype)
  }
}


export enum errors {
  WebrpcEndpoint = 'WebrpcEndpoint',
  WebrpcRequestFailed = 'WebrpcRequestFailed',
  WebrpcBadRoute = 'WebrpcBadRoute',
  WebrpcBadMethod = 'WebrpcBadMethod',
  WebrpcBadRequest = 'WebrpcBadRequest',
  WebrpcBadResponse = 'WebrpcBadResponse',
  WebrpcServerPanic = 'WebrpcServerPanic',
  WebrpcInternalError = 'WebrpcInternalError',
  WebrpcClientDisconnected = 'WebrpcClientDisconnected',
  WebrpcStreamLost = 'WebrpcStreamLost',
  WebrpcStreamFinished = 'WebrpcStreamFinished',
  Unauthorized = 'Unauthorized',
  PermissionDenied = 'PermissionDenied',
  SessionExpired = 'SessionExpired',
  MethodNotFound = 'MethodNotFound',
  Timeout = 'Timeout',
  InvalidArgument = 'InvalidArgument',
  NotFound = 'NotFound',
  UserNotFound = 'UserNotFound',
  ProjectNotFound = 'ProjectNotFound',
  InvalidTier = 'InvalidTier',
  ProjectLimitReached = 'ProjectLimitReached',
  NotImplemented = 'NotImplemented',
}

const webrpcErrorByCode: { [code: number]: any } = {
  [0]: WebrpcEndpointError,
  [-1]: WebrpcRequestFailedError,
  [-2]: WebrpcBadRouteError,
  [-3]: WebrpcBadMethodError,
  [-4]: WebrpcBadRequestError,
  [-5]: WebrpcBadResponseError,
  [-6]: WebrpcServerPanicError,
  [-7]: WebrpcInternalErrorError,
  [-8]: WebrpcClientDisconnectedError,
  [-9]: WebrpcStreamLostError,
  [-10]: WebrpcStreamFinishedError,
  [1000]: UnauthorizedError,
  [1001]: PermissionDeniedError,
  [1002]: SessionExpiredError,
  [1003]: MethodNotFoundError,
  [2000]: TimeoutError,
  [2001]: InvalidArgumentError,
  [3000]: NotFoundError,
  [3001]: UserNotFoundError,
  [3002]: ProjectNotFoundError,
  [3003]: InvalidTierError,
  [3005]: ProjectLimitReachedError,
  [9999]: NotImplementedError,
}

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>
