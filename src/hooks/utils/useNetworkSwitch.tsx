import { useAccount } from 'wagmi';

interface Props {
  targetChainId: number | undefined;
}

export const useNetworkSwitch = ({ targetChainId }: Props) => {
  const { chain } = useAccount();

  return {
    networkMismatch: chain?.id !== targetChainId,
    targetChainId,
  };
};
