import { classNames } from '~/config/classNames';

import { Flex, cn } from '$ui';

const OrderItemsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      className={cn(
        classNames.orderCartItems,
        'no-scrollbar w-full flex-1 flex-col gap-4 divide-x divide-border overflow-y-scroll [&>*]:px-2 [&>*]:py-4',
      )}
    >
      {children}
    </Flex>
  );
};

const OrderSummaryWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex className="flex-col border-t border-t-border p-2">{children}</Flex>
  );
};

const OrderButtonsWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Flex className="flex-col gap-3 bg-foreground/5 p-3">{children}</Flex>;
};

export const OrderSections = {
  Items: OrderItemsWrapper,
  Summary: OrderSummaryWrapper,
  Buttons: OrderButtonsWrapper,
};
