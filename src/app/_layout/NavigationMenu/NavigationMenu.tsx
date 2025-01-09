import { useEffect } from 'react';

import styles from './NavigationMenu.module.scss';
import Link from 'next/link';

function NavigationMenu() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.navigation_menu_container}>
      <div className={styles.navigation_wrapper}>
        <ul className={styles.navigation_list}>
          <li className={styles.navigation_item}>
            <a href="https://playontoy.com" rel="noopener noreferrer">
              <span>home</span>
            </a>
          </li>

          <li className={styles.navigation_item}>
            <Link href="/">
              <span>marketplace</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationMenu;
