import { observable } from '@legendapp/state';
import { z } from 'zod';

const FilterValues = z.object({
  name: z.string(),
  values: z.array(z.any()),
});

const collectibleFilters = z.object({
  showAvailableOnly: z.boolean().default(false),
  showOwnedOnly: z.boolean().default(false),
  includeUserOrders: z.boolean().default(true),
  searchText: z.string().default(''),
  filterOptions: z.array(FilterValues).default([]),
});

export type CollectibleFilters = z.infer<typeof collectibleFilters>;

const initialFilters = collectibleFilters.parse({});

export const filters$ = observable({
  ...initialFilters,
  getFilterValuesByName: (name: string) =>
    filters$.filterOptions.get().find((f) => f.name === name)?.values,

  deleteFilter: (name: string) => {
    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    filters$.filterOptions.set(otherFilters);
  },

  clearSearchText: () => {
    filters$.searchText.set('');
  },

  clearAllFilters: () => {
    filters$.showAvailableOnly.set(false);
    filters$.showOwnedOnly.set(false);
    filters$.includeUserOrders.set(true);
    filters$.filterOptions.set([]);
    filters$.searchText.set('');
  },

  toggleStringFilterValue: (name: string, value: string) => {
    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    const existingValues = filters$.getFilterValuesByName(name) ?? [];

    if (existingValues.includes(value)) {
      const newValues = existingValues.filter((v) => v !== value);

      if (newValues.length === 0) {
        filters$.filterOptions.set(otherFilters);
      }

      filters$.filterOptions.set([
        ...otherFilters,
        { name, values: newValues },
      ]);
    } else {
      filters$.filterOptions.set([
        ...otherFilters,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { name, values: [...existingValues, value] },
      ]);
    }
  },
  setIntFilterValue: (name: string, min: number, max: number) => {
    const otherFilters = filters$.filterOptions
      .get()
      .filter((f) => !(f.name === name));

    filters$.filterOptions.set([...otherFilters, { name, values: [min, max] }]);
  },
});
