'use client';

import { classNames } from '~/config/classNames';

import { Button, Flex, GasIcon, Text, cn } from '$ui';
import SocialsList from '../../../components/ui/SocialsList/SocialsList';
import styles from './Footer.module.scss';
import NextLink from 'next/link';
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
          src="/icons/toy-logo-full.svg"
          loading="lazy"
          alt="logo"
        />
        <div className={styles.link_container}>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">DOCS</a>
          <a href="#">GITBOOK</a>
          <a href="#">BRAND KIT</a>
          <a href="#">ALL SOCIALS</a>
        </div>
        {/* <qtoy-social-list></qtoy-social-list> */}
      </div>
      <p className={styles.address}>
        TOY LABS TECHNOLOGIES L.L.C GF-01, Al Sayegh Building, Port Saeed,
        Dubai, UAE
      </p>
    </footer>
    <footer className={styles.footer}>
      <div className={styles.footer_navigation}>
        <img
          className={styles.logo}
          src="/icons/toy-logo-full.svg"
          loading="lazy"
          alt="logo"
        />
        <div className={styles.link_container}>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">DOCS</a>
          <a href="#">GITBOOK</a>
          <a href="#">BRAND KIT</a>
          <a href="#">ALL SOCIALS</a>
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
