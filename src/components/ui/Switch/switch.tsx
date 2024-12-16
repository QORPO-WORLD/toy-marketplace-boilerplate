'use client';

import * as React from 'react';

import { cn } from '$ui';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { type VariantProps, cva } from 'class-variance-authority';

const switchRootVariants = cva(
  [
    'peer inline-flex h-[1.625rem] w-[3.4375rem] shrink-0 cursor-pointer items-center transition-colors',
    'rounded-full border border-[#403545] bg-[#4035451A]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-[#40354580]',
        pink: 'data-[state=checked]:bg-pink/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const switchThumbVariants = cva(
  [
    'pointer-events-none block h-[85%] aspect-square rounded-full bg-[#403545] shadow-lg ring-0 transition-transform',
    'data-[state=checked]:translate-x-[140%] data-[state=unchecked]:translate-x-0.5',
  ],
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary',
        pink: 'data-[state=checked]:bg-pink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    VariantProps<typeof switchRootVariants>
>(({ className, variant, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchRootVariants({ variant }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ variant }))} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch as BaseSwitch };
