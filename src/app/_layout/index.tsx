import { classNames } from '~/config/classNames';

import { Grid, cn } from '$ui';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid.Root
      className={cn(
        classNames.mainLayout,
        'font-main',
        'bg-[#CBBFD0]',
        'min-h-[100vh] w-full',
        '[--headerHeight:56px]',
        '[--collectionControlsHeight:41px]',
        '[--footerHeight:33px]',
        '[--orderCartRightOffset:16px]',
      )}
      template={`
        [row1-start] "header header" min-content [row1-end]
        [row2-start] "content order-cart" 1fr [row2-end]
        [row3-start] "footer order-cart" min-content [row3-end] 
        / 1fr auto
      `}
    >
      <Grid.Child
        className="absolute top-0 z-50 bg-transparent w-full"
        name="header"
      >
        <Header />
      </Grid.Child>

      <Grid.Child
        name="content"
        className="flex w-full flex-col justify-self-center"
        style={{
          width: 'calc(100% - var(--orderCartRightOffset))',
          height: 'calc(100% + var(--footerHeight))',
        }}
      >
        {children}
      </Grid.Child>

      <Grid.Child name="footer">
        <Footer />
      </Grid.Child>
    </Grid.Root>
  );
}
