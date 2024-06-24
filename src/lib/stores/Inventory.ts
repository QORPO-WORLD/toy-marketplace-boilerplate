import { proxy } from 'valtio';

type searchResultAmountByCollection = Record<string, number>;

interface InventoryState {
  searchText: string;
  searchResultAmount: number;
  searchResultAmountByCollection: searchResultAmountByCollection;
}

// STORE
export const inventoryState = proxy<InventoryState>({
  searchText: '',
  searchResultAmountByCollection: {},
  searchResultAmount: 0,
});

export const setInventorySearchText = (text: string) =>
  (inventoryState.searchText = text);
export const clearInventorySearchText = () => (inventoryState.searchText = '');

export const getCollectionId = (collectionAddress: string, chainId: number) => {
  return `${collectionAddress.toLowerCase()}-${chainId}`;
};

export const setSearchResultAmount = (amount: number) =>
  (inventoryState.searchResultAmount = amount);

export const setSearchResultAmountByCollection = (
  allCollectionIds: string[],
  collectionAddress: string,
  chainId: number,
  amount: number,
) => {
  const collectionId = getCollectionId(collectionAddress, chainId);
  inventoryState.searchResultAmountByCollection[collectionId] = amount;

  // Calculate total amount of results
  const totalAmount = allCollectionIds.reduce((total, currentCollectionId) => {
    return (
      total +
      (inventoryState.searchResultAmountByCollection[currentCollectionId] ?? 0)
    );
  }, 0);

  setSearchResultAmount(totalAmount);

  return;
};
