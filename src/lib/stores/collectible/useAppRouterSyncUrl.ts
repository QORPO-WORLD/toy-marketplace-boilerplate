import { useEffect } from 'react';

import { collectibleFilterState } from './Collectible';
import { encodeUrl } from './syncUrl';
import { urlKeys } from './types';
import { useRouter, useSearchParams } from 'next/navigation';
import { subscribe } from 'valtio';

export function useAppRouterSyncUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(
    () =>
      subscribe(collectibleFilterState, () => {
        const newQuery = new URLSearchParams(searchParams || '');
        // Delete all the old filter keys
        Object.values(urlKeys).forEach((k) => newQuery.delete(k));

        const url = window.location.origin + window.location.pathname;

        const newSearchParams = encodeUrl(collectibleFilterState).toString();
        const query = newSearchParams ? `?${newSearchParams}` : '';

        router.replace(`${url}${query}`, {
          scroll: false,
        });
      }),
    [],
  );
}
