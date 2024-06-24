import type { CollectibleFilterState } from '~/lib/stores/collectible/types';

import type { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export const truncateAtMiddle = (text: string, truncateAt: number) => {
  let finalText = text;

  if (text.length >= truncateAt) {
    finalText =
      text.slice(0, truncateAt / 2) +
      '...' +
      text.slice(text.length - truncateAt / 2, text.length);
  }

  return finalText;
};

export const compareAddress = (a = '', b = '') => {
  return a.toLowerCase() === b.toLowerCase();
};

export const truncateEnd = (text: string | undefined, truncateAt: number) => {
  if (!text) return '';

  let finalText = text;

  if (text.length >= truncateAt) {
    finalText = text.slice(0, truncateAt) + '...';
  }

  return finalText;
};

enum ValueType {
  VERY_LARGE,
  FRACTION,
  VERY_TINY,
  MIXED,
}

export const formatDisplay = (_val: number | string): string => {
  if (isNaN(Number(_val))) {
    console.error(`display format error ${_val} is not a number`);
    return 'NaN';
  }

  const val = Number(_val);

  if (val === 0) {
    return '0';
  }

  let valMode: ValueType;

  if (val > 100000000) {
    valMode = ValueType.VERY_LARGE;
  } else if (val < 0.0000000001) {
    valMode = ValueType.VERY_TINY;
  } else if (val < 1) {
    valMode = ValueType.FRACTION;
  } else {
    valMode = ValueType.MIXED;
  }

  let notation: Intl.NumberFormatOptions['notation'] = undefined;
  let config: Pick<
    Intl.NumberFormatOptions,
    'maximumFractionDigits' | 'maximumSignificantDigits'
  >;

  switch (valMode) {
    case ValueType.VERY_LARGE:
      notation = 'compact';
      config = {
        maximumFractionDigits: 4,
      };
      break;
    case ValueType.VERY_TINY:
      notation = 'scientific';
      config = {
        maximumFractionDigits: 4,
      };
      break;
    case ValueType.FRACTION:
      notation = 'standard';
      config = {
        maximumSignificantDigits: 4,
      };
      break;
    default:
      notation = 'standard';
      config = {
        maximumFractionDigits: 2,
      };
  }

  return Intl.NumberFormat('en-US', {
    notation,
    ...config,
  }).format(val);
};

export const formatDecimals = (
  bn: BigNumberish,
  decimals: string | number | BigNumber = 0,
): string => {
  // sanitize extremety formats such as "1e+99",
  // convert to hex before feeding into any BigNumber instance
  if (typeof bn === 'number' || typeof bn === 'string') {
    const n = Number(bn);
    if (isNaN(n)) return 'NaN';
    bn = '0x' + n.toString(16); // hex
  }

  const formatted = formatUnits(bn, decimals);

  // formatUnits always returns with 1 decimal precision
  if (formatted.endsWith('.0')) {
    // Dont display decimal precision if its a whole number
    return formatted.slice(0, -2);
  } else {
    return formatted;
  }
};

export const marketDataPeriodDiffPercentage = (
  startingValue: number,
  endingValue: number,
): number => {
  // if the value increased from a startiong point of 0 means we increased by 100%
  if (startingValue === 0 && endingValue > 0) {
    return 100;
  }

  // if value decreased to 0 from non-zero value, means we decreased by 100%
  if (endingValue === 0 && startingValue > 0) {
    return -100;
  }

  // normal diff
  return Number(
    (((endingValue - startingValue) / startingValue) * 100).toFixed(2),
  );
};

// A unique grid virtuoso key must be given to the virtuoso grid to prevent display issues
// when displayed data changes in the same screen ie: filters, sorting, etc...
export const getVirtuosoGridKey = (
  collectibleFilter: CollectibleFilterState,
) => {
  return JSON.stringify(collectibleFilter);
};

export const BigIntMin = (a: bigint, b: bigint) => {
  return a < b ? a : b;
};

export const BigIntCast = (n: string | undefined) => {
  try {
    if (typeof n === 'undefined') return n;
    const val = BigInt(n);
    return val;
  } catch {
    return undefined;
  }
};

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
