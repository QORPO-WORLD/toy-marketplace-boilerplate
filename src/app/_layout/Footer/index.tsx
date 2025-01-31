'use client';

import { useEffect, useRef } from 'react';

import SocialsList from '../../../components/ui/SocialsList/SocialsList';
import { useFlip } from '../../../hooks/ui/useFlip';
import styles from './Footer.module.scss';
import Link from 'next/link';

export const Footer = () => {
  const flip1 = useFlip();

  return (
    <footer className={styles.footer}>
      <div className={styles.logo_container}>
        <img
          ref={flip1 as React.RefObject<HTMLImageElement>}
          className={styles.logo}
          src="/market/icons/logo-full.svg"
          loading="lazy"
          alt="logo"
        />
      </div>
      <div className={styles.footer_menu}>
        <div>
          <a
            href="https://playontoy.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            home
          </a>
        </div>
        <div>
          <Link href="/">marketplace</Link>
        </div>
        <div>
          <a
            href="https://hub.playontoy.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            toy hub
          </a>
        </div>
      </div>
      <div className={styles.footer_navigation}>
        <div className={styles.link_container}>
          <p>
            © 2025, TOY LABS TECHNOLOGIES L.L.C <br />
            SM 1-02-330, Arab Building Bank, <br />
            Port Saeed, Dubai, UAE
          </p>
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
