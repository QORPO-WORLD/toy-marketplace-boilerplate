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
  };
  color: string;
}

function FlipCard({ data, color }: FlipCardProps) {
  const { text, number } = data;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.card_container}>
        <div className={styles.card}>
          <div className={styles.front_card}></div>
          <div className={styles.back_card}>
            <div className={styles.text_container}>
              <p>{text}</p>
            </div>
            <p className={styles.card_title}>utility</p>
          </div>
        </div>
        <div
          className={styles.number_container}
          style={{ backgroundColor: color }}
        >
          <span>{number}</span>
        </div>
        <button
          className={styles.btn}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>watch this out</span>
          <img src="/market/icons/play-icon.svg" alt="icon" />
        </button>
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
