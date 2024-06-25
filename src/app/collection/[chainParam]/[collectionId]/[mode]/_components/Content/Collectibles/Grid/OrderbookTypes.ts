import type {
  DefaultCurrency,
  GetCollectiblesUserBalancesResponse,
} from '~/api';

import type { OrderbookOrder } from '@0xsequence/indexer';

export type CollectiblesListProps = {
  chainId: number;
  collectionAddress: string;
  displayedTokenIds: string[];
  userAddress?: string;
  orders: OrderbookOrder[];
  currencies: DefaultCurrency[];
  userCollectionBalanceData?: GetCollectiblesUserBalancesResponse;
  onClickOrderModal: (tokenId: string, orderItem?: OrderbookOrder) => void;
};
