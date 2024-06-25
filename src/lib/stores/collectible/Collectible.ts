import { CollectibleFilterState } from './types';
import { proxy } from 'valtio';

export const defaultCollectibleFilter = CollectibleFilterState.parse({});

// STORE
export const collectibleFilterState = proxy<CollectibleFilterState>({
  ...defaultCollectibleFilter,
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
