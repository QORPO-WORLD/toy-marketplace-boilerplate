'use client';

import { Image, cn } from '$ui';

type BannerImageProps = {
  src?: string;
  className?: string;
};

export const BannerImage = ({ src, className }: BannerImageProps) => (
  <Image.Base
    src={src}
    containerClassName={cn('h-full rounded-none', className)}
    className="object-cover"
    fallbackSrc=""
  />
);
