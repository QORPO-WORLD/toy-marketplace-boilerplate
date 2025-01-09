import { useEffect } from 'react';

import styles from './NavigationMenu.module.scss';
import { motion } from 'framer-motion';
import Link from 'next/link';

function NavigationMenu() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <motion.div
      className={styles.navigation_menu_container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navigation_wrapper}>
        <ul className={styles.navigation_list}>
          <li className={styles.navigation_item}>
            <a href="https://playontoy.com" rel="noopener noreferrer">
              <span>home</span>
            </a>
          </li>

          <li className={styles.navigation_item + ' pointer-events-none'}>
            <Link href="/">
              <span>marketplace</span>
            </Link>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

export default NavigationMenu;
