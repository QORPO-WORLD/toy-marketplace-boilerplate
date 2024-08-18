'use client';

import { useEffect, useState } from 'react';

import { classNames } from '~/config/classNames';
import { getChain } from '~/config/networks';
import { formatFiatValue } from '~/lib/utils/price';

import { Flex, Text, Button, cn, LinkIcon } from '$ui';
import ENSName from './ENSName';

/* SIMPLE LABEL */
type SimpleLabelProps = {
  label?: string;
  amount: string | number;
  loading?: boolean;
  align?: 'left' | 'right' | 'inherit';
  size?: 'base' | 'sm';

  className?: string;
};

export const SimpleLabel = ({
  label,
  amount,
  loading = false,
  align = 'inherit',
  className,
}: SimpleLabelProps) => {
  const formattedAmount = !isNaN(Number(amount))
    ? Intl.NumberFormat('en-US', {
      notation: 'standard',
      maximumFractionDigits: 3,
    }).format(Number(amount))
    : amount;

  return (
    <Text
      style={{ textAlign: align }}
      className={cn(
        classNames.currencyLabel,
        'gap flex-col items-end',
        'text-foreground/90',
        loading ? 'loading w-[100px]' : 'w-full',
        className,
      )}
    >
      {formattedAmount} {label}
    </Text>
  );
};

/* ************* CURRENCY LABEL ***************** */
interface CurrencyLabelProps extends SimpleLabelProps {
  amountUSD?: string | number;
  currency?: string; // i.e. USDC/ETH
}

export const CurrencyLabel = ({
  label,
  amount,
  amountUSD,
  size: _size = 'base',
  align = 'inherit',
  loading = false,
}: CurrencyLabelProps) => {
  const sizes = {
    sm: {
      label: 'sm',
      text: 'sm',
      span: 'xs',
    },
    base: {
      label: 'base',
      text: 'base',
      span: 'sm',
    },
  } as const;

  const size = sizes[_size];

  const formattedAmount = !isNaN(Number(amount))
    ? Intl.NumberFormat('en-US', {
      notation: 'standard',
      maximumFractionDigits: 18,
    }).format(Number(amount))
    : amount;

  const formattedAmountUSDC =
    amountUSD !== undefined && !isNaN(Number(amountUSD))
      ? formatFiatValue(amountUSD)
      : amountUSD;

  return (
    <Flex
      className={cn(
        classNames.currencyLabel,
        `flex-col items-end gap-2 text-${align}`,
      )}
    >
      <Text
        className={cn(
          `font-bold text-foreground/90 text-${size.text} w-${loading ? '[100%]' : 'full'
          }`,
        )}
        loading={loading}
      >
        {formattedAmount} {label}
      </Text>
      {amountUSD !== undefined && (
        <Text
          className={cn(
            `text-foreground/50 text-${size.span} flex-nowrap`,
            `w-${loading ? '[60px]' : 'full'}`,
            `h-${loading ? '[20px]' : 'full'}`,
          )}
          loading={loading}
        >
          ${formattedAmountUSDC} USD
        </Text>
      )}
    </Flex>
  );
};

/* ************* COMPARE LABEL ***************** */
type CompareLabelProps = {
  label?: string;
  amount: string;
  percent: number; // i.e. CompareLabelProps

  align?: 'left' | 'right' | 'inherit';
};

export const CompareLabel = ({
  label,
  amount,
  percent,
  align = 'inherit',
}: CompareLabelProps) => {
  const formattedAmount = Intl.NumberFormat('en-US', {
    notation: 'standard',
    maximumFractionDigits: 3,
  }).format(Number(amount));

  return (
    <Flex className={cn(classNames.compareLabel, `flex-col text-${align}`)}>
      {/* {label ? (
        <Text as="span" color="tint500">
          {label}
        </Text>
      ) : null} */}

      <Text className="text-foreground/90">
        {formattedAmount} {label}
      </Text>
      <CompareText size="sm" percent={percent} />
    </Flex>
  );
};

type CompareText = {
  percent: number;
  size?: 'sm' | 'base';
  hideSymbol?: boolean;
  loading?: boolean;
};

export const CompareText = ({
  percent,
  size = 'base',
  hideSymbol,
  loading = false,
}: CompareText) => {
  return (
    <Text
      className={cn(
        classNames.compareText,
        `text-${size} ${getCompareColor(percent)}`,
      )}
      loading={loading}
    >
      {!hideSymbol ? getCompareSymbol(percent) : null}
      {percent}%
    </Text>
  );
};

const getCompareColor = (percent: number) => {
  if (percent > 0) {
    return 'text-success';
  } else if (percent === 0) {
    return 'text-foreground/50';
  } else if (percent < 0) {
    return 'text-destructive';
  }
};

const getCompareSymbol = (percent: number) => {
  if (percent > 0) {
    return '+';
  }

  return ''; // input already contains sign
};

/* ************* ADDRESS LABEL ***************** */
type AddressLabelProps = {
  chainId: number;
  address: string;
};

export const AddressLabel = ({ address, chainId }: AddressLabelProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isCopied, setCopy] = useState(false);
  const iconState = isCopied ? 'checkmark' : 'copy';
  const tooltip = isCopied ? 'Copied!' : 'Copy Address';

  const onCopy = () => {
    setShowTooltip(true);
    setCopy(true);
  };

  const onClear = () => {
    setShowTooltip(false);
    setCopy(false);
  };

  useEffect(() => {
    if (isCopied) setTimeout(onClear, 2000);
  }, [isCopied]);

  const explorerUrl = getChain(chainId)?.blockExplorer?.rootUrl;

  return (
    <Flex className="items-center gap-2">
      {/* <Tooltip.Root
        open={showTooltip}
        onOpenChange={open => setShowTooltip(open)}
      >
        <Tooltip.Trigger asChild>
          <Button
            variant={isCopied ? 'success' : 'muted'}
            onClick={() => {
              navigator?.clipboard?.writeText(address)
              onCopy()
            }}
          >
            <Icon
              type={iconState}
              size={16}
              css={{ color: 'inherit', cursor: 'pointer', minWidth: 16 }}
            />
          </Button>
        </Tooltip.Trigger>

        <Tooltip.Content side="top">{tooltip}</Tooltip.Content>
      </Tooltip.Root> */}

      <Button asChild variant="link" title={address} className="px-0 uppercase">
        <a href={`${explorerUrl}address/${address}`} target="_blank">
          <LinkIcon />

          {address ? <ENSName address={address} truncateAt={4} /> : 'unknown'}
        </a>
      </Button>
    </Flex>
  );
};
