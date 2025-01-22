import { useEffect, useState } from 'react';

const breakpoints = {
  '@sm': `(min-width: 640px)`,
  '@md': `(min-width: 768px)`,
  '@lg': `(min-width: 1024px)`,
  '@xl': `(min-width: 1280px)`,
  '@2xl': `(min-width: 1536px)`,
} as const;

type Breakpoints = keyof typeof breakpoints;

export function useIsMinWidth(size: Breakpoints) {
  const query = breakpoints[size];

  const [isMatch, setIsMatch] = useState(false);

  function handleChange() {
    setIsMatch(window.matchMedia(query).matches);
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    // Needed for Safari
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [size, handleChange]);

  return isMatch;
}
