import { cn } from '../../../components/ui';
import styles from './Hero.module.scss';
import clsx from 'clsx';

type BannerImageProps = {
  children: React.ReactNode;
  logo?: boolean;
};

export const BannerImage = ({ children, logo }: BannerImageProps) => {
  return (
    <div className={clsx('h-dvh py-2 px-2 mb:py-0 mb:px-0 min-h-fit')}>
      <div
        className={cn(
          'rounded-[3.125rem] relative bg-[url("/market/images/banner/banner-bg.png")] bg-cover bg-center h-full shadow-[0_0.5rem_3rem_rgba(58,49,66,1)] mb:rounded-none',
          logo && styles.banner,
          logo && 'mb:h-[59rem]',
        )}
      >
        {children}
      </div>
    </div>
  );
};
