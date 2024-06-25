import { z } from 'zod';

export const FilterValues = z.object({
  name: z.string(),
  values: z.array(z.any()),
});

export const CollectibleFilterState = z.object({
  showAvailableOnly: z.boolean().default(false),
  showAPR: z.boolean().default(false),
  showOwnedOnly: z.boolean().default(false),
  includeUserOrders: z.boolean().default(true),
  searchText: z.string().default(''),
  filterOptions: z.array(FilterValues).default([]),
});

export type CollectibleFilterState = z.infer<typeof CollectibleFilterState>;
