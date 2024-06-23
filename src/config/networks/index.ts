import { SUPPORTED_NETWORKS } from '../networks/config';

type nameOrId = string | number;

export const getChain = (nameOrId: nameOrId) => {
  return SUPPORTED_NETWORKS.find(
    (n) =>
      n.name === String(nameOrId).toLowerCase() ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      n.chainId === Number(nameOrId),
  );
};

export const getChainName = (nameOrId: nameOrId) => getChain(nameOrId)?.name;
export const getChainId = (nameOrId: nameOrId) => getChain(nameOrId)?.chainId;
export const getPresentableChainName = (nameOrId: nameOrId) =>
  getChain(nameOrId)?.title;
export const getViemChain = (nameOrId: nameOrId) =>
  getChain(nameOrId)?.viemChainConfig;

export const getCurrencyIconUrl = (chainId: number): string => {
  return `https://assets.sequence.info/images/networks/medium/${chainId}.webp`;
};
