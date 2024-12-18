'use client';

import { useState } from 'react';

import styles from './MobileSwiper.module.scss';
import { set } from 'date-fns';
// Import Swiper React components
// Import Swiper styles
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

interface MobileSwiperProps {
  arrOfComponents: React.ReactNode[];
}

export default ({ arrOfComponents }: MobileSwiperProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => console.log(swiper)}
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
