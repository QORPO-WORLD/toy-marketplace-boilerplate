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

export const getTag = (collection: string) => {
  switch (collection as CollectionsEnum) {
    case CollectionsEnum.ANEEMATE_GENESIS_ZERO:
      return '@ANEEMATE';
    default:
      return '@CITIZEN CONFLICT';
  }
};

export const setMarketPlaceLogo = (marketplace?: string) => {
  switch (marketplace) {
    case 'opensea':
      return '/market/icons/opensea-logo.svg';
    case 'sequence_marketplace_v2':
      return '/market/icons/toy-market-logo.svg';
    default:
      return '';
  }
};
