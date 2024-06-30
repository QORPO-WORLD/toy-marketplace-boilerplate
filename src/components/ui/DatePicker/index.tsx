'use client';

import { forwardRef } from 'react';

import { DatePickerWithPresets } from './datePickerwithPresets';

interface DatePickerProps {
  /**
   * The variant of the date picker.
   * Currently only 'withPresets' is supported.
   */
  variant: 'withPresets';
  defaultDate?: Date;
  /**
   * Closes popup on date select, Default: True
   */
  closeOnSelect?: boolean;
  onChange?: (date: Date) => void;
}

export const DatePicker = forwardRef(function DatePicker(
  { variant, onChange, defaultDate, closeOnSelect }: DatePickerProps,
  _ref,
) {
  if (variant === 'withPresets')
    return (
      <DatePickerWithPresets
        defaultDate={defaultDate}
        onChange={onChange}
        closeOnSelect={closeOnSelect}
      />
    );
  return <div>TODO: Other variants</div>;
});
