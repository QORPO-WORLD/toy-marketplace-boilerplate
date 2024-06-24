'use client';

import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSubContent,
  DropdownMenuRadioItem,
} from './dropdownMenu';
import {
  Trigger,
  Item,
  Sub,
  SubTrigger,
  DropdownMenuItemIndicator,
} from '@radix-ui/react-dropdown-menu';

export const DropdownMenu = {
  BaseContent: DropdownMenuContent,
  BaseSubContent: DropdownMenuSubContent,
  BaseRadioItem: DropdownMenuRadioItem,

  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Sub: Sub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Item: DropdownMenuItem,

  Label: DropdownMenuLabel,
  Seperator: DropdownMenuSeparator,

  Group: DropdownMenuGroup,
  RadioGroup: DropdownMenuRadioGroup,
  ItemIndicator: DropdownMenuItemIndicator,

  TriggerUnStyled: Trigger,
  SubTriggerUnStyled: SubTrigger,
  ItemUnStyled: Item,
};
