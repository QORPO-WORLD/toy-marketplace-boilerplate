'use client';

import { Suspense } from 'react';

import { is3dModel, isHtml, isVideo } from '~/utils/helpers';

import dynamic from 'next/dynamic';
import { Box, Dialog, Image, cn } from 'system';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
});

interface CollectibleImageProps {
  id?: string;
  src?: string;
  animationSrc?: string;
  loading: boolean;
}

export const CollectibleImage = ({
  id,
  src,
  animationSrc,
  loading,
}: CollectibleImageProps) => {
  const fileSrc = animationSrc || src || '';

  if (isHtml(fileSrc)) {
    return (
      <Box className="align-center flex justify-center bg-foreground/5">
        <iframe
          className="aspect-square max-h-[500px] w-full"
          src={fileSrc}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts"
          style={{
            border: '0px',
          }}
        />
      </Box>
    );
  }

  if (isVideo(fileSrc)) {
    return (
      <Box className="align-center flex justify-center bg-foreground/5">
        <video
          className="aspect-square max-h-[500px]"
          autoPlay
          loop
          controls
          playsInline
          muted
        >
          <source src={fileSrc} />
        </video>
      </Box>
    );
  }

  if (is3dModel(fileSrc)) {
    return (
      <Suspense fallback={<Box>Loading...</Box>}>
        <ModelViewer src={src} fileSrc={fileSrc} />
      </Suspense>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Image.Base
          src={src}
          alt={id}
          className="aspect-square max-h-[500px]"
          containerClassName={cn(
            'bg-foreground/5 hover:cursor-pointer',
            'mx-auto',
          )}
          loading={loading}
        />
      </Dialog.Trigger>
      <Dialog.BaseContent className="border-none bg-transparent py-4">
        <Image.Base
          src={src}
          alt={id}
          className="h-[90vh] w-[80vw] bg-transparent"
          loading={loading}
        />
      </Dialog.BaseContent>
    </Dialog.Root>
  );
};
