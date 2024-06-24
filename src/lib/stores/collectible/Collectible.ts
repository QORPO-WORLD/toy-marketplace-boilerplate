import { decodeUrl } from './syncUrl';
import type { SortType } from './types';
import { CollectibleFilterState } from './types';
import { proxy } from 'valtio';

export const defaultCollectibleFilter = CollectibleFilterState.parse({});

const initCollectibleFilter =
  typeof window !== 'undefined'
    ? decodeUrl(window.location.href)
    : defaultCollectibleFilter;

// STORE
export const collectibleFilterState = proxy<CollectibleFilterState>({
  ...initCollectibleFilter,
});

// METHODS
export const setShowAvailableOnly = (state: boolean) =>
  (collectibleFilterState.showAvailableOnly = state);
export const setShowAPR = (state: boolean) =>
  (collectibleFilterState.showAPR = state);
export const setShowOwnedOnly = (state: boolean) =>
  (collectibleFilterState.showOwnedOnly = state);
export const setIncludeUserOrders = (state: boolean) =>
  (collectibleFilterState.includeUserOrders = state);
export const setSearchText = (text: string) =>
  (collectibleFilterState.searchText = text);

export const updateSortType = (sortType: SortType) => {
  collectibleFilterState.sortBy = sortType;
};

export const clearSearchText = () => (collectibleFilterState.searchText = '');
export const clearFilterOptions = () => {
  collectibleFilterState.filterOptions = [];
};
export const removeFilterOption = (name: string) => {
  const updatedFilterOptions = collectibleFilterState.filterOptions.filter(
    (f) => !(f.name === name),
  );
  collectibleFilterState.filterOptions = updatedFilterOptions;
};

export const updateSelectedPropertyFilter = (
  name: string,
  values: string[],
) => {
  const updatedFilterOptions = collectibleFilterState.filterOptions.filter(
    (f) => !(f.name === name),
  );
  if (values.length === 0) {
    collectibleFilterState.filterOptions = updatedFilterOptions;
    return;
  }

  collectibleFilterState.filterOptions = [
    ...updatedFilterOptions,
    { name, values },
  ];
};
