'use client';

import { useEffect, useState } from 'react';

import type { CartItem } from '~/lib/stores/cart/types';
import { formatDecimals } from '~/lib/utils/helpers';

import {
  AddIcon,
  Button,
  Flex,
  Input,
  LoadingIcon,
  SubtractIcon,
  cn,
} from '$ui';
import { parseUnits } from 'viem';

interface QuantityInputProps {
  item: CartItem;
  maxQuantity: bigint | (() => Promise<bigint | undefined>);
  onChange?: (item: CartItem, quantity: bigint) => void;
  readonly?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  item,
  onChange: onChangeCb,
  maxQuantity: maxQuantityProp,
  readonly = false,
}) => {
  const decimals = item.collectibleMetadata?.decimals || 0;
  const one = parseUnits('1', decimals);
  const minQuantity = decimals ? `0.${'0'.repeat(decimals - 1)}1` : '1';

  const [maxQuantity, setMaxQuantity] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState<string>(
    formatDecimals(item.quantity, decimals),
  );
  const [quantityBn, setQuantityBn] = useState(item.quantity);

  const updateMaxQuantity = async () => {
    let _maxQuantity = maxQuantity;
    if (typeof maxQuantityProp != 'bigint') {
      setIsLoading(true);
      _maxQuantity = await maxQuantityProp();
      setMaxQuantity(_maxQuantity);
      setIsLoading(false);
    }
    return _maxQuantity;
  };

  useEffect(() => {
    if (typeof maxQuantityProp == 'bigint') {
      setMaxQuantity(maxQuantityProp);
    } else {
      async () => await updateMaxQuantity();
    }
  }, []);

  const onChange = (q: bigint) => {
    setQuantity(formatDecimals(q, decimals));
    setQuantityBn(q);
    if (onChangeCb) {
      onChangeCb(item, q);
    }
  };

  const inputChange = (value: string) => {
    setQuantity(value);
    setQuantityBn(parseUnits(value, decimals));
    if (onChangeCb) {
      onChangeCb(item, parseUnits(value, decimals));
    }
  };

  const onMaxQuantitySelected = async () => {
    const _maxQuantity = await updateMaxQuantity();
    onChange(_maxQuantity || 0n);
  };

  const onSub = async () => {
    const minQuantityBn = parseUnits(minQuantity, decimals);
    if (item.quantity - one <= minQuantityBn) {
      onChange(minQuantityBn);
    } else {
      onChange(item.quantity - one);
    }
  };

  const onAdd = async () => {
    const _maxQuantity = await updateMaxQuantity();
    if (_maxQuantity && item.quantity + one >= _maxQuantity) {
      onChange(_maxQuantity);
    } else {
      onChange(item.quantity + one);
    }
  };

  return (
    <Flex className="items-center gap-3">
      <Flex className="border-input bg-background h-fit w-full items-center overflow-auto rounded-sm border">
        <Button
          className="px-3 ring-offset-4"
          size="xs"
          type="button"
          variant="ghost"
          disabled={minQuantity == quantity}
          onClick={onSub}
        >
          <SubtractIcon className="h-3 w-3" />
        </Button>
        <Input.Base
          className="text-foreground/80 border-0 text-sm focus-within:ring-0"
          inputClassname={cn(
            'ellipsis [&::-webkit-inner-spin-button]:appearance-none',
            readonly ? 'cursor-default' : '',
          )}
          type="number"
          step={minQuantity}
          min={minQuantity}
          name="quantity"
          onChange={(e) => inputChange(e.target.value)}
          readOnly={readonly}
          value={quantity}
        />
        <Button
          className="ring-offset-4"
          size="xs"
          variant="ghost"
          type="button"
          onClick={onAdd}
          disabled={isLoading || maxQuantity === quantityBn}
        >
          {!isLoading ? (
            <AddIcon className="h-4 w-4" />
          ) : (
            <LoadingIcon className="h-4 w-4" />
          )}
        </Button>
      </Flex>
      <Button
        size="xs"
        variant="muted"
        type="button"
        className="flex-1"
        disabled={isLoading || maxQuantity == quantityBn}
        onClick={onMaxQuantitySelected}
      >
        MAX
      </Button>
    </Flex>
  );
};

export default QuantityInput;
