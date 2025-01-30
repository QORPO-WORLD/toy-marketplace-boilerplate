import { classNames } from '~/config/classNames';

import { Grid, cn } from '$ui';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-main min-h-dvh flex flex-col justify-between h-fit">
      <Grid.Child
        className="absolute top-0 z-50 bg-transparent w-full"
        name="header"
      >
        <Header />
      </Grid.Child>

      <div
        className="flex w-full flex-col justify-self-center min-h-dvh justify-center"
        // style={{
        //   width: 'calc(100% - var(--orderCartRightOffset))',
        //   height: 'calc(100% + var(--footerHeight))',
        // }}
      >
        {children}
      </div>

      <Grid.Child name="footer">
        <Footer />
      </Grid.Child>
    </div>
  );
}
