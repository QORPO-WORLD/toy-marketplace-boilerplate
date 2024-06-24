import { defaultCollectibleFilter } from './Collectible';
import type { FilterValues } from './types';
import { CollectibleFilterState, reversedUrlKeys, urlKeys } from './types';
import { z } from 'zod';

type StateKey = keyof CollectibleFilterState;
type StateEntry = {
  [K in StateKey]: [K, CollectibleFilterState[K]];
}[StateKey];

export const encodeUrl = (state: CollectibleFilterState) => {
  // The URL specs are quite confusing (buggy), see https://github.com/nodejs/node/issues/33037
  // This will url encode even unreserved chars -.!~*'() this leads to a hacky solution to serialize arrays further down
  const queryParams = new URLSearchParams();

  for (const entry of Object.entries(state)) {
    const [key, value] = entry as StateEntry;
    // Skip default values
    // Since valtio proxies arrays, we cant relay on the eq operator
    if (
      value == defaultCollectibleFilter[key] ||
      (typeof value != 'boolean' && !value.length)
    ) {
      continue;
    }

    let newValue: string;
    if (key == 'filterOptions') {
      newValue = stringifyFilterOptions(value);
    } else {
      newValue = encodeURI(String(value));
    }

    // Replace the key with the shorter version
    const newKey = urlKeys[key];
    queryParams.set(newKey, newValue);
  }
  return queryParams;
};

export const decodeUrl = (url: string): CollectibleFilterState => {
  const urlEntries = new URL(url).searchParams.entries();
  const state = { ...defaultCollectibleFilter };

  for (const [urlKey, value] of urlEntries) {
    if (!(urlKey in reversedUrlKeys)) continue;

    const stateKey = reversedUrlKeys[urlKey as keyof typeof reversedUrlKeys];

    if (stateKey === 'filterOptions') {
      state.filterOptions = parseFilterOptions(value);
    } else {
      const type = CollectibleFilterState.shape[stateKey].removeDefault();
      const newValue = coerceStringToType(value, type);
      // @ts-ignore
      if (newValue) state[stateKey] = newValue;
    }
  }
  return state;
};

// Stringify filter options
// potatoes:[russet,amandrine,yukon],price:{min:0}{max:10} ->
// potatoes~russet~amandrine~yukon~~price~0~10
const stringifyFilterOptions = (value: FilterValues[]) => {
  const arr = [];
  for (const { name, values } of value) {
    const newName = replaceTilde(name);

    const newFilterValues = values?.map(replaceTilde).join('~');
    if (newFilterValues) arr.push(`${newName}~${newFilterValues}`);
  }
  return arr.join('~~');
};

const parseFilterOptions = (value: string): FilterValues[] => {
  const newValue = restoreTilde(value);
  const filterOptions: FilterValues[] = [];
  const parts = newValue.split('~~');
  for (const part of parts) {
    const [name, ...values] = part.split('~');
    filterOptions.push({
      name: name,
      values: values,
    });
  }
  return filterOptions;
};

// This allows us to reserve the tilde as an array separator (and hope that no one has used '!7E' as part of the attr)
const replaceTilde = (str: string) => str.replaceAll('~', '!7E');
const restoreTilde = (str: string) => str.replaceAll('!7E', '~');

const coerceStringToType = (str: string, type: z.ZodType<any>) => {
  try {
    if (type instanceof z.ZodBoolean) {
      return z
        .string()
        .transform((s) => s !== 'false' && s !== '0')
        .parse(str);
    } else if (type instanceof z.ZodNumber) {
      return z.coerce.number().parse(str);
    } else {
      return z.string().parse(str);
    }
  } catch (e) {
    console.error('Error parsing query param', str, type, e);
  }
};
