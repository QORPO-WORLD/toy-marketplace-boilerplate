'use client';

import { useRef } from 'react';

import SocialsList from '../../../components/ui/SocialsList/SocialsList';
import { useFlip } from '../../../hooks/ui/useFlip';
import styles from './Footer.module.scss';
import Link from 'next/link';

export const Footer = () => {
  const logoRef = useRef(null);
  const flip1 = useFlip(logoRef);
  return (
    <footer className={styles.footer}>
      <div ref={flip1} className={styles.logo_container}>
        <img
          ref={logoRef}
          className={styles.logo}
          src="/market/icons/logo-full.svg"
          loading="lazy"
          alt="logo"
        />
      </div>
      <div className={styles.footer_menu}>
        <div>
          <a href="https://playontoy.com" target="_blank">
            home
          </a>
        </div>
        <div>
          <Link href="/">marketplace</Link>
        </div>
      </div>
      <div className={styles.footer_navigation}>
        <div className={styles.link_container}>
          <p>© 2025, toy</p>
          <a href="/market/docs/01-TOY_GTC_EN-2024.pdf" target="_blank">
            TERMS OF SERVICE
          </a>
          <a
            href="/market/docs/02-TOY_Privacy policy_EN-2024.pdf"
            target="_blank"
          >
            DOCS
          </a>
        </div>
        <SocialsList />
      </div>
    </footer>
  );
};
