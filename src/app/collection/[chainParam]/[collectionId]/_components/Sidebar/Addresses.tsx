import { AddressLabel } from '~/components/AddressLabel';

import { Flex, Text } from '$ui';

type AddressesLinksProps = {
  addresses: { label: string; address: string; chainId: number }[];
};

export const AddressesLinks = ({ addresses }: AddressesLinksProps) => {
  return (
    <Flex className="flex-col gap-2 p-3 pl-1">
      {addresses
        .filter((a) => a.label !== 'Orderbook')
        .map((a, i) => (
          <AddressBox key={i} {...a} />
        ))}
    </Flex>
  );
};

const AddressBox = ({
  label,
  address,
  chainId,
}: {
  label: string;
  address: string;
  chainId: number;
}) => {
  return (
    <Flex className="items-center justify-between rounded-[2.6875rem] px-3 py-0.5 border border-[#403545] bg-[#4035451A] mb:border-[#FFFFFF66]">
      <Text className="text-base text-white capitalize font-DMSans font-semibold">
        {label}
      </Text>
      <AddressLabel address={address} chainId={chainId} />
    </Flex>
  );
};
