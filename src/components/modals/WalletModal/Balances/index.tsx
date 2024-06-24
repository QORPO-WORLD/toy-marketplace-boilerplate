'use client';

import { getBalanceCurrencies } from '~/config/currencies/currencies';
import { SUPPORTED_NETWORKS } from '~/config/networks/config';

import { Flex } from '$ui';
import { CryptoBalance } from './CryptoBalance';
import { useAccount } from 'wagmi';

export const WalletDialogBalances = () => {
  const { chain } = useAccount();

  const balances = chain ? getBalanceCurrencies(chain?.id) : [];

  type RpcMapping = Record<number, string[]>;

  const rpcMapping: RpcMapping = {};

  SUPPORTED_NETWORKS.forEach((network) => {
    rpcMapping[network.chainId] = [network.readOnlyNodeURL];
  });

  return (
    <Flex className="mb-5 flex-col gap-2">
      {balances.map((balance) => {
        return (
          <CryptoBalance
            key={balance.id}
            name={balance.name}
            tokenAddress={balance.address}
            wrapTargetId={balance.wrapTargetId || undefined}
            tokenImageUrl={balance.tokenImageUrl}
            options={balance.options}
            decimalsMax={balance.decimalsMax}
            setUniswapModalSettings={(_) => {}}
            setIsModalOpen={(_) => {}}
          />
        );
      })}
    </Flex>
  );
};
