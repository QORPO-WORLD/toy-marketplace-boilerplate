import { useEffect } from 'react';

import { type GetAccountReturnType } from '@wagmi/core';
import { watchAccount } from '@wagmi/core';
import { type Config } from 'wagmi';

export const AccountEvents = ({ wagmiConfig }: { wagmiConfig: Config }) => {
  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange(
        account: GetAccountReturnType,
        prevAccount: GetAccountReturnType,
      ) {
        // reset cart if user switches wallet
        if (prevAccount.address !== account.address) {
          // resetCart();
        }
      },
    });
    return () => unwatch();
  }, []);
  return null;
};
