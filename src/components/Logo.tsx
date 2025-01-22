'use client';

import Image from 'next/image';

export const Logo = () => {
  return (
    <Image
      src="/market/images/logo.svg"
      width="56"
      height="42"
      alt="logo"
    ></Image>
  );
};
