import { useEffect } from 'react';

import styles from './NavigationMenu.module.scss';
import { motion } from 'framer-motion';
import Link from 'next/link';

function NavigationMenu({ onClose }: { onClose: () => void }) {
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

          <li className={styles.navigation_item}>
            <Link href="/" onClick={onClose}>
              <span>marketplace</span>
            </Link>
            <div className="flex items-center">
              <img
                className="w-24"
                src="/market/icons/toy-logo.svg"
                alt="logo"
              />
              <p className="text-[#E7E6FB] text-4xl font-main">TESTNET</p>
            </div>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

export default NavigationMenu;
