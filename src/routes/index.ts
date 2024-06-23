import { getChainName } from '~/config/networks';

import { makeRoute } from './utils/makeRoute';
import { isAddress as viemIsAddress } from 'viem';
import { z } from 'zod';

const viewType = ['list', 'grid'] as const;
const ViewTypeEnum = z.enum(viewType);

const swapMode = ['buy', 'sell'] as const;
const swapModeEnum = z.enum(swapMode);

const isAddress = z.string().refine(viemIsAddress);

const chainParam = z.coerce.number().or(z.string());

const collectionId = isAddress;

const collectionParams = z.object({
  chainParam,
  collectionId,
  mode: swapModeEnum,
});

const tab = ['details', 'listings'] as const;
const CollectibleTabEnum = z.enum(tab);

const orderbookTab = [...tab, 'offers'] as const;
export const orderbookCollectibleTabEnum = z.enum(orderbookTab);

const collectibleParams = z.object({
  chainParam,
  collectionId,
  tokenId: z.string(),
  tab: CollectibleTabEnum,
});

const orderbookCollectibleParams = collectibleParams.extend({
  tab: orderbookCollectibleTabEnum,
});

const chainToName = (chainParam: number | string) => {
  const chainName = getChainName(chainParam);
  return chainName ?? chainParam;
};

const inventoryParams = z.object({
  chainParam: chainParam.optional(),
  isConnected: z.boolean(),
  address: isAddress.optional(),
});

export const Routes = {
  // Landing
  landing: makeRoute(() => '/'),

  //collection -- TODO: The filterParams should be merged here
  orderbookCollection: makeRoute(
    ({ chainParam, collectionId, mode }) =>
      `/collection/${chainToName(chainParam)}/${collectionId}/orderbook/${mode}`,
    collectionParams,
  ),

  //collectible
  orderbookCollectible: makeRoute(
    ({ chainParam, collectionId, tokenId, tab }) =>
      `/collectible/${chainToName(chainParam)}/${collectionId}/${tokenId}/${tab}`,
    orderbookCollectibleParams,
  ),

  // inventory
  inventory: makeRoute(({ chainParam, isConnected, address }) => {
    if (isConnected && address && chainParam) {
      return `/inventory/${getChainName(chainParam)}/${address}`;
    } else {
      return `/inventory/${getChainName(137)}/connect`;
    }
  }, inventoryParams),

  terms: makeRoute(() => '/terms'),
  privacy: makeRoute(() => '/privacy'),
};
