import {
  generateChainNameByChainId,
  getCollectionLogo,
  getCreatedDateByCollectionAddress,
  getTag,
} from '../../../lib/utils/helpers';
import styles from './CollectionBadge.module.scss';
import { ContractInfo } from '@0xsequence/metadata';

function CollectionBadge({ collectionData }: { collectionData: ContractInfo }) {
  const { chainId, address, name, type } = collectionData;

  return (
    <div className={styles.banner_card}>
      <div className={styles.card_container}>
        <img
          className={styles.avatar}
          src={getCollectionLogo(address)}
          alt="logo"
        />
        <p className={styles.user_id}>{getTag(address)}</p>
        <p className={styles.balance_text}>{name}</p>
        <div className={styles.balance_container}>
          <p>Created: {getCreatedDateByCollectionAddress(address)}</p>
          <p>Chain: {generateChainNameByChainId(chainId)}</p>
        </div>
      </div>
    </div>
  );
}

export default CollectionBadge;
