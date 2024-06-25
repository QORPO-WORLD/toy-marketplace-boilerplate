'use client';

import type { FormEvent } from 'react';
import { useRef, useState } from 'react';

import type { OrderItemType } from '~/api';
import { PoolAvatar } from '~/components/Avatars';
import { useOrderItemMaxQuantity } from '~/hooks/cart/useOrderItemMaxQuantity';
import type { CartItem, CollectibleMetadata } from '~/lib/stores';
import { editQuantity } from '~/lib/stores';
import { getThemeManagerElement } from '~/lib/utils/theme';
import { formatDecimals } from '~/utils/helpers';

import { Button, Dialog, Flex, Input, LoadingIcon, Text, cn } from '$ui';
import { parseUnits } from 'viem';

type BaseEditQuantityModalProps = {
  quantity: bigint;
  onQuantityChange: (newQuantity: bigint) => void;

  chainId: number;
  itemType: OrderItemType;
  collectionAddress: string;
  exchangeAddress: string;
  tokenId: string;
  collectibleMetadata?: CollectibleMetadata;
};

export const BaseEditQuantityModal = (props: BaseEditQuantityModalProps) => {
  const [status, setStatus] = useState<{
    className: string;
    message: string;
    loading?: boolean;
  }>({
    className: 'text-foreground',
    message: '',
  });

  const {
    getMaxQuantity,
    isLoading: isMaxQuantityLoading,
    maxQuantity,
  } = useOrderItemMaxQuantity(props);

  const decimals = props?.collectibleMetadata?.decimals || 0;

  const quantityInput = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const currentValue = formatDecimals(props.quantity, decimals);

  // to convert decimal digit to HTML Input step attribute value
  // ex :- 2 decimal = 0.01
  const stepArr = (0.0).toFixed(decimals).toString().split('');
  stepArr.pop();
  stepArr.push('1');

  const stepString = stepArr.join('');

  const updateValue = (val: bigint) => {
    // editQuantity(item, val)
    props.onQuantityChange?.(val);

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

  const onMaxQuantitySelected = async () => {
    const maxQuantity = await getMaxQuantity();

    if (maxQuantity && quantityInput.current) {
      quantityInput.current.value = formatDecimals(maxQuantity, decimals);
      // editQuantity(item, maxQuantity)
    }
  };

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus({
      className: 'none',
      message: '',
      loading: true,
    });

    try {
      const val = (e.target as any)[0].value as string;

      const inputDecimals = val.split('.')[1]?.length || 0;

      if (inputDecimals > decimals) {
        throw new Error(`input decimal length greater than ${decimals}`);
      }

      const updatedQuantity = parseUnits(val, decimals);

      if (updatedQuantity <= 0n) {
        throw new Error('quantity must be greater than 0');
      }

      const maxQuantity = await getMaxQuantity();

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
          name={props.collectibleMetadata?.name || ''}
          tokenId={props.collectibleMetadata?.tokenId}
          src={props.collectibleMetadata?.imageUrl || ''}
        />

        <Flex className="flex-col gap-2">
          <Flex asChild className="flex flex-col gap-2">
            <form onSubmit={onFormSubmit}>
              <Input.Base
                inputSize="lg"
                id="item-quantity-modal"
                ref={quantityInput}
                type="number"
                defaultValue={currentValue}
                step={stepString}
                autoFocus
                className="flex-1 divide-x-0"
                // status={status.status}
                // message={status.message}
                suffix={
                  <Button
                    size="xs"
                    variant="muted"
                    className="mx-2 flex-1"
                    disabled={
                      isMaxQuantityLoading || maxQuantity === props.quantity
                    }
                    onClick={onMaxQuantitySelected}
                  >
                    {isMaxQuantityLoading ? <LoadingIcon /> : 'MAX'}
                  </Button>
                }
              />

              <Text className="text-xs uppercase text-foreground/70">
                Decimals: {decimals}
              </Text>

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

type CartItemEditQuantityModalProps = {
  item: CartItem;
};

export const CartItemEditQuantityModal = ({
  item,
}: CartItemEditQuantityModalProps) => (
  <BaseEditQuantityModal
    {...item}
    tokenId={item.collectibleMetadata.tokenId || ''}
    chainId={item.collectibleMetadata.chainId}
    exchangeAddress={item.exchangeAddress || ''}
    collectionAddress={item.collectibleMetadata.collectionAddress || ''}
    quantity={item.quantity}
    onQuantityChange={(val) => {
      editQuantity(item, val);
    }}
  />
);
