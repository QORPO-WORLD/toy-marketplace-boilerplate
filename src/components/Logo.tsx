'use client';

import Image from 'next/image';

const defaultDesktopLogoUrl = '/sequence-logo.png';
const defaultMobileLogoUrl = '/logo/152x152.png';

export const Logo = () => {
  return (
    <Image
      src="/market/images/Logo.svg"
      width="56"
      height="42"
      alt="logo"
    ></Image>
  );
};
