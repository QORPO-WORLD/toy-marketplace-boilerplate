'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';

import { getThemeManagerElement } from '~/lib/utils/theme';

import { Button, Dialog, Input } from '$ui';
import { isAddress } from 'viem';

interface SendDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  callBackAction: (address: string) => void;
}

export const SendModal = ({
  isOpen,
  setIsOpen,
  callBackAction,
}: SendDialogProps) => {
  const [address, setAddress] = useState('');

  const isValidEthAddress = isAddress(address);

  const addressInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const onSubmit = () => {
    callBackAction(address);
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.BaseContent
        container={getThemeManagerElement()}
        className="max-w-lg"
      >
        <Dialog.Title>Send to Address</Dialog.Title>

        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          <Input.Base
            id="send-to-address"
            placeholder="Enter address"
            value={address}
            onChange={addressInputOnChange}
          />

          <Button
            className="w-full justify-center"
            type="submit"
            label="Confirm Address"
            disabled={!isValidEthAddress}
            onClick={onSubmit}
          />
        </form>
      </Dialog.BaseContent>
    </Dialog.Root>
  );
};
