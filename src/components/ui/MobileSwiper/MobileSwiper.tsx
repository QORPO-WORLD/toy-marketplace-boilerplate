'use client';

import { useState } from 'react';

import styles from './MobileSwiper.module.scss';
// Import Swiper React components
// Import Swiper styles
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

interface MobileSwiperProps {
  arrOfComponents: React.ReactNode[];
}

const MobileSwiper = ({ arrOfComponents }: MobileSwiperProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {arrOfComponents.map((component, index) => (
          <SwiperSlide key={index}>{component}</SwiperSlide>
        ))}
      </Swiper>
      <ul className={styles.pagination_list}>
        {arrOfComponents.map((_, index) => (
          <li
            key={index}
            className={`${styles.pagination_item} ${activeIndex === index ? styles.active : ''}`}
          ></li>
        ))}
      </ul>
    </>
  );
};

export default MobileSwiper;
