'use client';

import SocialsList from '../../../components/ui/SocialsList/SocialsList';
import styles from './Footer.module.scss';
import { useEstimateFeesPerGas, useAccount } from 'wagmi';

export const Footer = () => {
  const { chain } = useAccount();

  const { data } = useEstimateFeesPerGas({
    formatUnits: 'gwei',
    chainId: chain?.id ?? 1,
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_navigation}>
        <img
          className={styles.logo}
          src="/market/icons/toy-logo-full.svg"
          loading="lazy"
          alt="logo"
        />
        <div className={styles.link_container}>
          <a href="/market/docs/01-TOY_GTC_EN-2024.pdf" target="_blank">
            TERMS OF SERVICE
          </a>
          <a
            href="/market/docs/02-TOY_Privacy policy_EN-2024.pdf"
            target="_blank"
          >
            DOCS
          </a>
          {/* <a href="#">GITBOOK</a>
          <a href="#">BRAND KIT</a>
          <a href="#">ALL SOCIALS</a> */}
        </div>
        <SocialsList />
      </div>
      <p className={styles.address}>
        TOY LABS TECHNOLOGIES L.L.C GF-01, Al Sayegh Building, Port Saeed,
        Dubai, UAE
      </p>
    </footer>
  );
};
