'use client';

import { useState } from 'react';

import styles from './MobileSwiper.module.scss';
// Import Swiper React components
// Import Swiper styles
import 'swiper/css';
import { EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperModule } from 'swiper/types';

interface MobileSwiperProps {
  arrOfComponents: React.ReactNode[];
  effects?:
    | 'cards'
    | 'fade'
    | 'cube'
    | 'flip'
    | 'coverflow'
    | 'creative'
    | 'custom';
  disabledPagination?: boolean;
}

const MobileSwiper = ({
  arrOfComponents,
  effects,
  disabledPagination,
}: MobileSwiperProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Swiper
        spaceBetween={16}
        cardsEffect={{ slideShadows: false, perSlideRotate: 4 }}
        effect={effects ? 'cards' : ''}
        modules={[EffectCards]}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {arrOfComponents.map((component, index) => (
          <SwiperSlide key={index}>{component}</SwiperSlide>
        ))}
      </Swiper>
      {!disabledPagination && (
        <ul className={styles.pagination_list}>
          {arrOfComponents.map((_, index) => (
            <li
              key={index}
              className={`${styles.pagination_item} ${activeIndex === index ? styles.active : ''}`}
            ></li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MobileSwiper;
