'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { PoolAvatar } from '~/components/Avatars';
import { editQuantity } from '~/lib/stores/cart/Cart';
import type { CartItem } from '~/lib/stores/cart/types';
import { formatDecimals } from '~/lib/utils/helpers';
import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Flex, Text, cn } from '$ui';
import QuantityInput from './QuantityInput';
import { parseUnits } from 'viem';

/* eslint-disable @typescript-eslint/no-explicit-any */

type QuantityModalProps = {
  item: CartItem;
  maxQuantity: number;
};

export const QuantityModal = (props: QuantityModalProps) => {
  const { item } = props;

  const [status, setStatus] = useState<{
    className: string;
    message: string;
    loading?: boolean;
  }>({
    className: 'text-foreground',
    message: '',
  });

  const maxQuantity = BigInt(props.maxQuantity);

  const decimals = item.collectibleMetadata?.decimals || 0;

  const [open, setOpen] = useState(false);

  const updateValue = (val: bigint) => {
    editQuantity(item, val);

    setStatus({
      className: 'text-success',
      message: 'Quantity updated',
      loading: false,
    });

    setTimeout(() => {
      setStatus({
        className: 'text-foreground',
        message: '',
        loading: false,
      });

      setOpen(false);
    }, 300);
  };

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus({
      className: 'none',
      message: '',
      loading: true,
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const val = (e.target as any).quantity.value as string;
      const inputDecimals = val.split('.')[1]?.length || 0;

      if (inputDecimals > decimals) {
        throw new Error(`input decimal length greater than ${decimals}`);
      }

      const updatedQuantity = parseUnits(val, decimals);

      if (updatedQuantity <= 0n) {
        throw new Error('quantity must be greater than 0');
      }

      if (!maxQuantity) {
        throw new Error('unable to define max value');
      }

      if (updatedQuantity > maxQuantity) {
        const formattedMax = formatDecimals(
          maxQuantity?.toString() || '',
          decimals,
        );

        throw new Error(
          `input greater than max value, please enter a value less than ${formattedMax}`,
        );
      }

      updateValue(updatedQuantity);
    } catch (err) {
      console.error(err);
      if (err instanceof Error)
        setStatus({
          className: 'text-destructive',
          message: err.message,
          loading: false,
        });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <Dialog.Trigger asChild>
        <Button
          // icon="pencil"
          variant="muted"
          size="xs"
          label="EDIT"
        />
      </Dialog.Trigger>

      <Dialog.BaseContent
        container={getThemeManagerElement()}
        className="max-w-md p-5"
      >
        <Dialog.Title>Quantity</Dialog.Title>

        <PoolAvatar
          name={item.collectibleMetadata?.name || ''}
          tokenId={item.collectibleMetadata?.tokenId}
          src={item.collectibleMetadata?.imageUrl || ''}
        />

        <Flex className="flex-col gap-2">
          <Flex asChild className="flex flex-col gap-2">
            <form onSubmit={onFormSubmit}>
              <QuantityInput item={item} maxQuantity={maxQuantity} />
              <Button
                size="lg"
                className="mt-3 w-full justify-start"
                type="submit"
                loading={status.loading}
              >
                Confirm
              </Button>

              {status?.message ? (
                <Text className={cn('w-full text-center', status.className)}>
                  {status.message}
                </Text>
              ) : null}
            </form>
          </Flex>
        </Flex>
      </Dialog.BaseContent>
    </Dialog.Root>
  );
};
