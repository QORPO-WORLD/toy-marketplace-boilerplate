import styles from './Hero.module.scss';

type BannerImageProps = {
  children: React.ReactNode;
};

export const BannerImage = ({ children }: BannerImageProps) => {
  return (
    <div className="h-dvh py-2 px-2">
      <div
        className={
          'rounded-[3.125rem] bg-[url("/images/banner/banner-bg.png")] bg-cover bg-center h-full shadow-[0_0.5rem_3rem_rgba(58,49,66,1)] ' +
          styles.banner
        }
      >
        {children}
      </div>
    </div>
  );
};
