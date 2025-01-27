'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useFlip } from '../../../hooks/ui/useFlip';
import styles from './NFTCard.module.scss';
import clsx from 'clsx';
import Image from 'next/image';

interface NFTCardProps {
  imageSrc: string;
  name: string;
  tag: string;
  nftNumber: number;
  nftPrice: number;
  logoSrc: string;
}

function NFTCard({
  data,
  className,
  setIsLoaded,
}: {
  data: NFTCardProps;
  className: string;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const flip = useFlip(undefined, 25);
  const { logoSrc, imageSrc, name, tag, nftNumber, nftPrice } = data;

  useEffect(() => {
    if (isVisible) {
      setIsLoaded(true);
    }
  }, [isVisible, setIsLoaded]);

  return (
    <div
      ref={flip}
      className={clsx(styles.card + ' ' + className, {
        'opacity-0': !isVisible,
        'opacity-100': isVisible,
      })}
    >
      <div className={styles.title_wrapper}>
        <Image
          width={150}
          height={150}
          className={styles.logo}
          src={logoSrc}
          loading="lazy"
          alt="logo"
          onLoadingComplete={() => {
            setIsVisible(true);
          }}
        />
        <div className={styles.card_title_container}>
          <p className={styles.title}>{name}</p>
          <p className={styles.tag}>&#64;{tag}</p>
        </div>
      </div>
      <div className={styles.img_container}>
        <Image
          width={315}
          height={393}
          className={styles.card_img}
          src={imageSrc}
          loading="lazy"
          alt="card-image"
        />
        <div className={styles.card_bottom_info_container}>
          <div className={styles.info_cotnainer_1}>
            <Image
              width={150}
              height={150}
              className={styles.nft_card_icon_big}
              src="/market/icons/amount-icon.svg"
              alt="icon"
            />
            <p className={styles.number}>{nftNumber}</p>
          </div>
          <div className={styles.info_cotnainer_2}>
            <p className={styles.number}>{nftPrice} TOY</p>
            <div className={styles.icon_container}>
              <Image
                width={150}
                height={150}
                className={styles.nft_card_icon_small}
                src="/market/icons/amount-icon.svg"
                alt="icon"
              />
            </div>
          </div>
          <div className={styles.cart_container}>
            <Image
              width={150}
              height={150}
              className={styles.nft_card_icon_small}
              src="/market/icons/cart-icon.svg"
              alt="icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
