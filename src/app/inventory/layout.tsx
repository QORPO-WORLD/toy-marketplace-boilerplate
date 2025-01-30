import { BlinkBlur } from 'react-loading-indicators';

import { BannerImage } from '../_landing/Hero/BannerImage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BannerImage logo={false}>
      <div className="py-[7rem] px-[2rem] mb:px-2 min-h-dvh">{children}</div>
    </BannerImage>
  );
}

export default Layout;
