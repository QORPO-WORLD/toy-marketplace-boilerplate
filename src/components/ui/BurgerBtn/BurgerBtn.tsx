'use client';

import { useState } from 'react';

import { cn, Portal } from '..';
import NavigationMenu from '../../../app/_layout/NavigationMenu/NavigationMenu';
import styles from './BurgerBtn.module.scss';

function BurgerBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={cn(styles.burger_btn, isOpen && styles.active)}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <Portal>
          <NavigationMenu onClose={() => setIsOpen(false)} />
        </Portal>
      )}
    </>
  );
}

export default BurgerBtn;
