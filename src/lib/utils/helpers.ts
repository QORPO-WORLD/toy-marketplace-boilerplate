import { CollectionsEnum } from '../../enum/enum';

export const textClassName = (isEmpty: boolean) =>
  `${isEmpty ? 'italic' : ''} text-${
    isEmpty ? 'foreground/50' : 'foreground'
  } font-${isEmpty ? 'light' : 'normal'}}`;

export const isHtml = (fileName: string) => {
  const isHtml = /.*\.(html\?.+|html)$/.test(fileName?.toLowerCase());
  return isHtml;
};

export const isVideo = (fileName: string) => {
  const isVideo = /.*\.(mp4|ogg|webm)$/.test(fileName?.toLowerCase());
  return isVideo;
};

export const is3dModel = (fileName: string) => {
  const isGltf = /.*\.gltf$/.test(fileName?.toLowerCase());
  return isGltf;
};

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value != null;

export const getCollectionLogo = (collection: string) => {
  switch (collection as CollectionsEnum) {
    case CollectionsEnum.ANEEMATE_GENESIS_ZERO:
      return '/market/images/logos/anmt-logo.png';
    default:
      return '/market/images/logos/cc-logo.png';
  }
};

export const getCollectionBg = (collection: string) => {
  switch (collection as CollectionsEnum) {
    case CollectionsEnum.ANEEMATE_GENESIS_ZERO:
      return '/market/images/banner/collection-page-banner-anmt.png';
    default:
      return '/market/images/banner/collection-page-banner-cc.png';
  }
};

export const getTag = (collection: string) => {
  switch (collection as CollectionsEnum) {
    case CollectionsEnum.ANEEMATE_GENESIS_ZERO:
      return '@ANEEMATE';
    default:
      return '@CITIZEN CONFLICT';
  }
};

export const setMarketPlaceLogo = (
  marketplace?: string,
  collectionAddress?: string,
) => {
  if ('0xbd19b4c3c1e745e982f4d7f8bdf983d407e68a46' === collectionAddress) {
    return '/market/icons/element-circle.svg';
  }
  switch (marketplace) {
    case 'opensea':
      return '/market/icons/opensea-logo.svg';
    case 'sequence_marketplace_v2':
      return '/market/icons/toy-market-logo.svg';
    default:
      return '';
  }
};

export const generateChainNameByChainId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 4:
      return 'Rinkeby';
    case 137:
      return 'Polygon';
    case 80001:
      return 'Mumbai';
    case 56:
      return 'Binance Smart Chain';
    case 21000000:
      return 'TOY TESTNET';
    default:
      return 'Unknown';
  }
};
export const getCurrencyByChainId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'ETH';
    case 4:
      return 'ETH';
    case 137:
      return 'MATIC';
    case 80001:
      return 'MATIC';
    case 56:
      return 'BNB';
    case 21000000:
      return 'TOY';
    default:
      return 'Unknown';
  }
};

export const getCreatedDateByCollectionAddress = (
  collectionAddress: string,
) => {
  switch (collectionAddress as CollectionsEnum) {
    case CollectionsEnum.ANEEMATE_GENESIS_ZERO:
      return 'NOV 2023';
    case CollectionsEnum.FOUNDERS_COLLECTION_CITIZEN_ZERO:
      return 'FEB 2024';
    default:
      return 'DEC 2024';
  }
};

export const getCurrencyLogoByChainId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return '/market/icons/ETH-logo.png';
    case 4:
      return '/market/icons/ETH-logo.png';
    case 137:
      return 'MATIC';
    case 80001:
      return 'MATIC';
    case 56:
      return '/market/icons/bnb-logo.png';
    case 21000000:
      return '/market/icons/toy-market-logo.svg';
    default:
      return '/market/icons/toy-market-logo.svg';
  }
};
