import styles from './SocialsList.module.scss';

function SocialsList() {
  return (
    <ul className={styles.social_list}>
      <li className={styles.social_item}>
        <a
          href="https://discord.gg/5Ekur8BA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/market/icons/discord-icon.svg"
            loading="lazy"
            alt="discord-icon"
          />
        </a>
      </li>
      <li className={styles.social_item}>
        <a
          href="https://x.com/playonTOY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/market/icons/x-icon.svg" loading="lazy" alt="x-icon" />
        </a>
      </li>
      <li className={styles.social_item}>
        <a
          href="https://t.me/playonTOY"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/market/icons/telegram-icon.svg"
            loading="lazy"
            alt="telegram-icon"
          />
        </a>
      </li>
      <li className={styles.social_item}>
        <a
          href="https://www.instagram.com/toychaingames?igsh=MXQwdDI4cDRrNmd6MQ%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/market/icons/instagram-icon.svg"
            loading="lazy"
            alt="instagram-icon"
          />
        </a>
      </li>
      <li className={styles.social_item}>
        <a href="">
          <img
            src="/market/icons/youtube-icon.svg"
            width="2.3125rem"
            height="1.6875rem"
            loading="lazy"
            alt="youtube-icon"
          />
        </a>
      </li>
      <li className={styles.social_item}>
        <a href="">
          <img
            src="/market/icons/twitch-icon.svg"
            width="1.8125rem"
            height="1.9375rem"
            loading="lazy"
            alt="twitch-icon"
          />
        </a>
      </li>
    </ul>
  );
}

export default SocialsList;
