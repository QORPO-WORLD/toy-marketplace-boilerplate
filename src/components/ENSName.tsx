'use client';

import { truncateAtMiddle } from '~/lib/utils/helpers';

import type { Address } from 'viem';
import { useEnsName } from 'wagmi';

type ENSNameProps = {
  address?: string;
  truncateAt?: number;
};

const ENSName = ({ address, truncateAt }: ENSNameProps) => {
  const { data } = useEnsName({ address: address as Address });

  if (!address) {
    return null;
  }

  if (!data) {
    if (truncateAt) {
      return truncateAtMiddle(address, truncateAt);
    } else {
      return address;
    }
  }

  return data;
};

export default ENSName;
