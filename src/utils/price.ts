export const getFiatValue = (
  value: string,
  conversionRate: number,
  decimals: number,
) => {
  // multiplier so decimals aren't lost in calculations
  const decimalsMultiplier = 1000000;
  const valueFiat =
    (BigInt(value) * BigInt(Math.round(conversionRate * decimalsMultiplier))) /
    BigInt(10 ** decimals);

  const valueFiatFormatted = Number(valueFiat) / decimalsMultiplier;

  return valueFiatFormatted;
};

export const formatFiatValue = (value: number | string) => {
  if (Number(value) >= 0.01) {
    return Intl.NumberFormat('en-US', {
      notation: 'standard',
      maximumFractionDigits: 2,
    }).format(Number(value));
  }
  if (Number(value) >= 0.00001) {
    return Intl.NumberFormat('en-US', {
      notation: 'standard',
      maximumFractionDigits: 5,
    }).format(Number(value));
  }
};
