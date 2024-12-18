import { useState } from 'react';

import { cn } from '..';
import styles from './BurgerBtn.module.scss';

function BurgerBtn() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className={cn(styles.burger_btn)} type="button">
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default BurgerBtn;
