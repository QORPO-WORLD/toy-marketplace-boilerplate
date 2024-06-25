import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import type { DefaultCurrency } from '~/api';

import type { TokenMetadata } from '@0xsequence/metadata';
import { addDays } from 'date-fns';
import { parseUnits, formatUnits } from 'viem';

type Iso8601DateString = string;
export type OrderbookFormData = {
  unitPrice: string;
  tokenAmount: string;
  //
  currency: DefaultCurrency;
  expiry: Iso8601DateString;
};

interface Props {
  currency: {
    defaultCurrency: DefaultCurrency;
  };
  tokenMetadata: TokenMetadata;
  options: {
    tokenDecimalDisabled: boolean;
  };
  royaltyPercentage: bigint | undefined;
  isOffer: boolean;
}

export const useOrderbookFormData = ({
  currency,
  tokenMetadata,
  options: { tokenDecimalDisabled },
  royaltyPercentage = BigInt(0),
  isOffer,
}: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<OrderbookFormData>({
    defaultValues: {
      unitPrice: '',
      tokenAmount: '',
      currency: currency.defaultCurrency,
      expiry: addDays(new Date(), 3).toISOString(),
    },
    reValidateMode: 'onSubmit',
    mode: 'onTouched',
  });

  // computed hiddenfields

  const listedPriceDecimal = useMemo(() => {
    const tokenAmount = Number(getValues('tokenAmount')) || 0;
    const unitPrice = Number(getValues('unitPrice')) || 0;

    if (tokenDecimalDisabled) {
      return unitPrice;
    } else {
      return tokenAmount * unitPrice;
    }
  }, [watch('tokenAmount'), watch('unitPrice'), royaltyPercentage]);

  const listedPriceRaw = parseUnits(
    // cant parse scientific notation such a 3e-8 ..
    // so we use toFixed to convert to string
    listedPriceDecimal.toFixed(20),
    watch('currency.decimals') || 0,
  );

  const pricePerTokenRaw = useMemo(() => {
    const unitPrice = getValues('unitPrice');
    const unitPriceRaw = parseUnits(
      unitPrice || '0',
      watch('currency.decimals') || 0,
    );

    const pricePerTokenRaw =
      unitPriceRaw / BigInt(10 ** (tokenMetadata.decimals || 0));

    return pricePerTokenRaw;
  }, [watch('unitPrice'), tokenMetadata]);

  const tokenAmountRaw = useMemo(() => {
    if (tokenDecimalDisabled) {
      return 1n;
    }

    const tokenAmount = getValues('tokenAmount');
    const tokenAmountRaw = parseUnits(
      tokenAmount || '0',
      tokenMetadata?.decimals || 0,
    );

    return tokenAmountRaw;
  }, [watch('tokenAmount'), tokenMetadata]);

  const royaltyFeeRaw = useMemo(() => {
    const royaltyFee = (listedPriceRaw * royaltyPercentage) / BigInt(100);

    return royaltyFee;
  }, [listedPriceRaw, royaltyPercentage]);

  const listingAmountReceivedRaw = useMemo(() => {
    const listingAmount = listedPriceRaw - royaltyFeeRaw;

    return listingAmount;
  }, [royaltyFeeRaw, listedPriceRaw]);

  const totalCostRaw = useMemo(() => {
    if (isOffer) {
      return listedPriceRaw + royaltyFeeRaw;
    } else {
      return listedPriceRaw;
    }
  }, [listedPriceRaw, royaltyFeeRaw]);

  const totalCostDecimal = useMemo(() => {
    const decimals = watch('currency.decimals') || 0;
    return Number(formatUnits(totalCostRaw, decimals));
  }, [watch('currency.decimals'), totalCostRaw]);

  return {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
    formState: { errors, dirtyFields },
    // custom fields
    computedValues: {
      listedPrice: { decimal: listedPriceDecimal, raw: listedPriceRaw },
      royaltyFee: { raw: royaltyFeeRaw },
      listingAmountReceived: { raw: listingAmountReceivedRaw },
      totalCost: { decimal: totalCostDecimal, raw: totalCostRaw },
      pricePerToken: { raw: pricePerTokenRaw },
      tokenAmount: { raw: tokenAmountRaw },
    },
  };
};
