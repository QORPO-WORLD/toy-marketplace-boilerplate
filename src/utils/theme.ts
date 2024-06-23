export const THEME_MANAGER_CLASSNAME = 'theme-manager';

export const getThemeManagerElement = (): HTMLElement | null => {
  if (typeof window === 'undefined') return null;
  return document.querySelector(`.${THEME_MANAGER_CLASSNAME}`);
};
