import { currencyQueries } from '~/lib/queries';
import type { Currency } from '~/lib/queries/marketplace/marketplace.gen';
import { marketConfig$ } from '~/lib/stores/marketConfig';

import { useQuery } from '@tanstack/react-query';

type UseMarketplaceCurrenciesProps = {
  chainId: number;
  collectionId: string;
};

export const useCollectionCurrencies = ({
  chainId,
  collectionId,
}: UseMarketplaceCurrenciesProps) => {
  const { data, isLoading } = useQuery(
    currencyQueries.list({
      chainId,
    }),
  );

  const currencies = new Set<Currency>();

  if (data && !!marketConfig$?.projectId?.get()) {
    const customCurrencies = marketConfig$.collections
      .find((collection) => collection.collectionAddress.get() === collectionId)
      ?.currencyOptions.get();

    const collectionCurrencies =
      data?.currencies.filter((currency) =>
        customCurrencies?.includes(currency.contractAddress),
      ) || [];

    const defaultCurrencies =
      data?.currencies.filter((currency) => currency.defaultChainCurrency) ||
      [];

    collectionCurrencies.forEach((currency) => currencies.add(currency));
    defaultCurrencies.forEach((currency) => currencies.add(currency));
  }

  if (currencies.size === 0) {
    return { currencies: undefined, isLoading };
  } else {
    return { currencies: Array.from(currencies), isLoading };
  }
};
