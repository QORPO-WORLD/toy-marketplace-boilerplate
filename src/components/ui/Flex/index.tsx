import React from 'react';

import { cn } from '../css/utils';
import { Slot } from '@radix-ui/react-slot';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn('flex', className)} {...props} />;
  },
);
Flex.displayName = 'Flex';

export { Flex };
