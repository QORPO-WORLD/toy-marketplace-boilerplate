'use client';

import { ToggleGroup, ListIcon, GridIcon } from '$ui';
import { ViewType, useViewType } from './useViewType';

type ViewTypeToggleProps = {
  disableGridView?: boolean;
  disableListView?: boolean;
};

export const ViewTypeToggle = (props: ViewTypeToggleProps) => {
  const { disableGridView, disableListView } = props;
  const { viewType, setViewType } = useViewType();

  return (
    <ToggleGroup.Root
      type="single"
      value={viewType}
      onValueChange={setViewType}
    >
      <ToggleGroup.Item
        className="flex items-center justify-center"
        value={ViewType.LIST}
        disabled={disableListView}
      >
        <ListIcon className="h-5 w-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="flex items-center justify-center"
        value={ViewType.GRID}
        disabled={disableGridView}
      >
        <GridIcon className="h-5 w-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
