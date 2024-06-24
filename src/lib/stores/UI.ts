import { proxy } from 'valtio';

interface UIState {
  isCollectionSidebarOpen: boolean;
}

export const toggleCollectionSidebar = () => {
  uiState.isCollectionSidebarOpen = !uiState.isCollectionSidebarOpen;
};

export const setCollectionSidebarOpen = (open: boolean) => {
  uiState.isCollectionSidebarOpen = open;
};

export const uiState = proxy<UIState>({
  isCollectionSidebarOpen: false,
});
