import styles from './NFTCard.module.scss';

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
}: {
  data: NFTCardProps;
  className: string;
}) {
  const { logoSrc, imageSrc, name, tag, nftNumber, nftPrice } = data;
  return (
    <div className={styles.card + ' ' + className}>
      <div className={styles.title_wrapper}>
        <img className={styles.logo} src={logoSrc} loading="lazy" alt="logo" />
        <div className={styles.card_title_container}>
          <p className={styles.title}>{name}</p>
          <p className={styles.tag}>&#64;{tag}</p>
        </div>
      </div>
      <div className={styles.img_container}>
        <img
          className={styles.card_img}
          src={imageSrc}
          loading="lazy"
          alt="card-image"
        />
        <div className={styles.card_bottom_info_container}>
          <div className={styles.info_cotnainer_1}>
            <img
              className={styles.nft_card_icon_big}
              src="/icons/amount-icon.svg"
              alt="icon"
            />
            <p className={styles.number}>{nftNumber}</p>
          </div>
          <div className={styles.info_cotnainer_2}>
            <p className={styles.number}>{nftPrice} TOY</p>
            <div className={styles.icon_container}>
              <img
                className={styles.nft_card_icon_small}
                src="/icons/amount-icon.svg"
                alt="icon"
              />
            </div>
          </div>
          <div className={styles.cart_container}>
            <img
              className={styles.nft_card_icon_small}
              src="/icons/cart-icon.svg"
              alt="icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
