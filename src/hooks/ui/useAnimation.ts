import { RefObject, useEffect, useRef, useState } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

const scrollTriggerConfig = (ref: RefObject<HTMLDivElement>) => ({
  scrollTrigger: {
    trigger: ref.current,
    start: 'top 50%',
    toggleActions: 'restart none restart reverse',
  },
});

export const useAnimation = (
  gsapFn: (ref: RefObject<HTMLDivElement>) => void,
  container?: RefObject<HTMLElement>,
) => {
  const [isPlaging, setIsPlaying] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null); // Ensure the ref matches the expected type
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setIsPlaying(true);
  }, []); // Ensure the effect runs only once

  useGSAP(() => {
    if (!isPlaging) return;
    tl.current = gsap.timeline();
    if (ref.current) {
      gsapFn(ref);
    }
  }, [isPlaging]);

  return ref; // Return the ref
};

export const opacity = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),

      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,1)"',
    });
  }
};

export const fromLeft = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      x: '-100%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,1)"',
    });
  }
};

export const fromRight = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      x: '100%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,1)"',
    });
  }
};
export const fromTop = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '-50%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,1)"',
    });
  }
};
export const fromBottom = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '100%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,1)"',
    });
  }
};

export const nftCard1 = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '-100%',
      x: '-20%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,0.5)"',
    });
  }
};

export const nftCard2 = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '-100%',
      x: '30%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,0.5)"',
      delay: 0.3,
    });
  }
};

export const nftCard3 = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '-100%',
      x: '8%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,0.5)"',
      delay: 0.6,
    });
  }
};

export const nftCard4 = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      y: '-100%',
      x: '-32%',
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,0.5)"',
      delay: 0.9,
    });
  }
};

export const fromRightStaged = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    Array.from(ref.current.children).forEach((child, index) => {
      gsap.from(child, {
        ...scrollTriggerConfig(ref),
        x: '100%',
        opacity: 0,
        duration: 1.4,
        delay: index * 0.2,
        ease: 'elastic.out(1,0.5)"',
      });
    });
  }
};

export const rotate = (ref: RefObject<HTMLDivElement>) => {
  if (ref.current) {
    gsap.from(ref.current, {
      ...scrollTriggerConfig(ref),
      rotate: 270,
      opacity: 0,
      duration: 2,
      ease: 'elastic.out(1,0.5)"',
      scale: 0,
      delay: 0.3,
    });
  }
};
