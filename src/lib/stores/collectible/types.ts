import { z } from 'zod';

export enum SortType {
  OWNED_DESC = '0',
  OWNED_ASC = '1',
  TOKEN_ID_DESC = '2',
  TOKEN_ID_ASC = '3',
  TVL_DESC = '4',
  TVL_ASC = '5',
  VOLUME_DESC = '6',
  VOLUME_ASC = '7',
  APR_DESC = '8',
  APR_ASC = '9',
  PRICE_DESC = '10',
  PRICE_ASC = '11',
  NAME_DESC = '12',
  NAME_ASC = '13',
  SUPPLY_DESC = '14',
  SUPPLY_ASC = '15',
  CREATED_AT_DESC = '16',
  CREATED_AT_ASC = '17',
}

export const FilterValues = z.object({
  name: z.string(),
  values: z.array(z.any()),
});

export const CollectibleFilterState = z.object({
  showAvailableOnly: z.boolean().default(false),
  showAPR: z.boolean().default(false),
  showOwnedOnly: z.boolean().default(false),
  includeUserOrders: z.boolean().default(true),
  searchText: z.string().default(''),
  filterOptions: z.array(FilterValues).default([]),
  sortBy: z.nativeEnum(SortType).default(SortType.PRICE_ASC),
});

export type CollectibleFilterState = z.infer<typeof CollectibleFilterState>;
export type FilterValues = z.infer<typeof FilterValues>;

export const urlKeys = {
  showAvailableOnly: 'a',
  showAPR: 'c',
  showOwnedOnly: 'd',
  includeUserOrders: 'f',
  searchText: 'g',
  filterOptions: 'h',
  sortBy: 'j',
} as const;

type UrlKeysType = typeof urlKeys;
type ReversedUrlKeysType = {
  [K in UrlKeysType[keyof UrlKeysType]]: keyof UrlKeysType;
};

const reverseUrlKeys = (): ReversedUrlKeysType => {
  const reversed: Partial<ReversedUrlKeysType> = {};
  for (const [key, value] of Object.entries(urlKeys)) {
    reversed[value] = key as keyof UrlKeysType;
  }
  return reversed as ReversedUrlKeysType;
};

export const reversedUrlKeys = reverseUrlKeys();
