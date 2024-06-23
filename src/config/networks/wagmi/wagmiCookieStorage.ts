//TODO: Replace this with wagmi cookie storage after https://github.com/wevm/wagmi/pull/3970 is released
import { parseCookie, createStorage } from 'wagmi';

export const cookieStorage = createStorage({
  storage: {
    getItem(key) {
      if (typeof window === 'undefined') return null;
      const value = parseCookie(document.cookie, key);
      return value ?? null;
    },
    setItem(key, value) {
      if (typeof window === 'undefined') return;
      document.cookie = `${key}=${value};path=/`;
    },
    removeItem(key) {
      if (typeof window === 'undefined') return;
      document.cookie = `${key}=;max-age=-1`;
    },
  },
});
