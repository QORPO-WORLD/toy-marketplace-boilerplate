'use client';

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

export const DatePicker = ({
  variant,
  onChange,
  defaultDate,
  closeOnSelect,
}: DatePickerProps) => {
  if (variant === 'withPresets')
    return (
      <DatePickerWithPresets
        defaultDate={defaultDate}
        onChange={onChange}
        closeOnSelect={closeOnSelect}
      />
    );
  return <div>TODO: Other variants</div>;
};
