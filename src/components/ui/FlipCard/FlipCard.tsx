'use client';

import { useState } from 'react';

import { Portal } from '../Portal';
import VideoModal from '../VideoModal/VideoModal';
import styles from './FlipCard.module.scss';

interface FlipCardProps {
  data: {
    text: string;
    number: string;
    videoPath: string;
    bgUrl: string;
  };
  color: string;
}

function FlipCard({ data }: FlipCardProps) {
  const { text, number, bgUrl } = data;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.card_container}>
        <div className={styles.card}>
          <div
            className={styles.front_card}
            style={{ backgroundImage: `url(${bgUrl})` }}
          >
            <p className={styles.card_title}>{number}</p>
          </div>
          <div
            className={styles.back_card}
            style={{
              background: `linear-gradient(
      0deg,
      rgba(72, 63, 81, 0.8) 0%,
      rgba(72, 63, 81, 0.8) 100%
    ), url(${bgUrl})`,
            }}
          >
            <button
              className={styles.btn}
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img src="/market/icons/play-icon.svg" alt="icon" />
            </button>
            <div>
              <p className={styles.card_title}>utility {number}</p>

              <p className={styles.card_description}>{text}</p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Portal>
          <VideoModal
            videoPath={data.videoPath}
            closeModal={() => setIsOpen((prev) => !prev)}
          />
        </Portal>
      )}
    </>
  );
}

export default FlipCard;
