import styles from './NavigationMenu.module.scss';

function NavigationMenu() {
  return (
    <div className={styles.navigation_menu_container}>
      <div className={styles.navigation_wrapper}>
        <ul className={styles.navigation_list}>
          <li className={styles.navigation_item}>
            <a>
              <span>MISSIONS</span>
            </a>
          </li>
          <li className={styles.navigation_item}>
            <a>
              <span>Staking</span>
            </a>
          </li>
          <li className={styles.navigation_item}>
            <a>
              <span>marketplace</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationMenu;
