import { SortOrder } from '~/api/temp/marketplace-api.gen';
import { SortType } from '~/lib/stores/collectible/types';

export const mapSortOptions = (sortType: SortType) => {
  switch (sortType) {
    case SortType.CREATED_AT_ASC:
      return {
        column: 'createdAt',
        order: SortOrder.ASC,
      };
    case SortType.CREATED_AT_DESC:
    default:
      return {
        column: 'createdAt',
        order: SortOrder.DESC,
      };
  }
};
