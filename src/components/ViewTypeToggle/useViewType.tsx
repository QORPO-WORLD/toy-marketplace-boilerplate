import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export enum ViewType {
  GRID = 'grid',
  LIST = 'list',
}

const defaultViewType = ViewType.GRID;

export const useViewType = () => {
  const currSearchParams = useSearchParams();
  const searchParams = new URLSearchParams(currSearchParams?.toString());
  const router = useRouter();
  const pathname = usePathname();

  let viewType = searchParams.get('view') as ViewType;

  if (!viewType) {
    viewType = defaultViewType;
  }

  const isListView = viewType === ViewType.LIST;
  const isGridView = viewType === ViewType.GRID;

  const setViewType = (type: string | string[] | undefined) => {
    if (type === ViewType.LIST || type === ViewType.GRID) {
      searchParams.set('view', type);
      router.push(`${pathname}?${searchParams.toString()}`);
    }
  };

  return { viewType, isListView, isGridView, setViewType };
};
