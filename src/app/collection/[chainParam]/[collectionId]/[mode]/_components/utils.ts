import type { TokenMetadata, SwapType } from '@0xsequence/metadata';

interface GetCollectibleMetadataQueryOrCache {
  chainId: number;
  tokenId: string;
  collectionAddress: string;
  collectibleMetadata: TokenMetadata[];
}

export const getCollectibleMetadataQueryOrCache = ({
  chainId,
  tokenId,
  collectionAddress,
  collectibleMetadata,
}: GetCollectibleMetadataQueryOrCache): TokenMetadata | undefined => {
  let collectibleData = collectibleMetadata.find(
    (tokenMetadata) => tokenMetadata?.tokenId === tokenId,
  );
  // if no data is found look inside the cache
  if (!collectibleData) {
    const cache = queryClient.getQueryCache();
    const queries = cache.findAll({ queryKey: ['collectibleMetadata'] });
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const isValidState =
        !query.state.isInvalidated && query.state.status === 'success';
      const args = query.queryKey[1] as GetCollectiblesMetadataArgs;
      const isSameChain = String(chainId) === args.chainID;
      const isSameCollection = compareAddress(
        args.contractAddress,
        collectionAddress,
      );
      if (isValidState && isSameChain && isSameCollection) {
        const data = query.state.data as GetCollectiblesMetadataResponse;
        const foundData = data.data.find(
          (tokenMetadata) => tokenMetadata.tokenId === tokenId,
        );
        if (foundData) {
          collectibleData = foundData;
          break;
        }
      }
    }
  }

  return collectibleData;
};

interface GetPriceDataQueryOrCache {
  chainId: number;
  tokenId: string;
  collectionAddress: string;
  exchangeAddress: string;
  swapType: SwapType;
  priceDatas: CollectiblePriceData[];
}

export const getPriceDataQueryOrCache = ({
  chainId,
  tokenId,
  collectionAddress,
  exchangeAddress,
  priceDatas,
  swapType,
}: GetPriceDataQueryOrCache) => {
  let priceData = priceDatas.find((priceData) => priceData.tokenId === tokenId);

  if (!priceData) {
    const cache = queryClient.getQueryCache();
    const queries = cache.findAll({ queryKey: ['fetchCollectiblePriceData'] });
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const isValidState =
        !query.state.isInvalidated && query.state.status === 'success';
      const args = query.queryKey[1] as GetCollectiblesPriceDataArgs;
      const isSameChain = String(chainId) === args.chainID;
      const isSameCollection = compareAddress(
        args.collectionAddress,
        collectionAddress,
      );
      const isSameExchangeAddress = compareAddress(
        args.exchangeAddress,
        exchangeAddress,
      );
      const isSameSwapType = args.swapType === swapType;
      if (
        isValidState &&
        isSameChain &&
        isSameCollection &&
        isSameExchangeAddress &&
        isSameSwapType
      ) {
        const data = query.state.data as GetCollectiblesPriceDataResponse;
        const foundData = data.data.find(
          (priceData) => priceData.tokenId === tokenId,
        );
        if (foundData) {
          priceData = foundData;
          break;
        }
      }
    }
  }

  return priceData;
};

interface GetMarketDataQueryOrCache {
  chainId: number;
  tokenId: string;
  exchangeAddress: string;
  marketDatas: CollectibleMarketData[];
}

export const getMarketDataQueryOrCache = ({
  tokenId,
  chainId,
  exchangeAddress,
  marketDatas,
}: GetMarketDataQueryOrCache) => {
  let marketData = marketDatas.find(
    (marketData) => marketData.tokenId === tokenId,
  );

  if (!marketData) {
    const cache = queryClient.getQueryCache();
    const queries = cache.findAll({
      queryKey: ['fetchCollectiblesMarketData'],
    });
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const isValidState =
        !query.state.isInvalidated && query.state.status === 'success';
      const args = query.queryKey[1] as GetCollectiblesMarketDataArgs;
      const isSameChain = String(chainId) === args.chainID;
      const isSameExchangeAddress = compareAddress(
        args.exchangeAddress,
        exchangeAddress,
      );
      if (isValidState && isSameChain && isSameExchangeAddress) {
        const data = query.state.data as GetCollectiblesMarketDataResponse;
        const foundData = data.data.find(
          (marketData) => marketData.tokenId === tokenId,
        );
        if (foundData) {
          marketData = foundData;
          break;
        }
      }
    }
  }

  return marketData;
};
