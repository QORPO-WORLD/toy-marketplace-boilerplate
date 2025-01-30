'use client';

import { Box } from '$ui';
import { getChainLogo } from '../../../lib/utils/helpers';
import Image from 'next/image';
import { useAccount, useSwitchChain } from 'wagmi';

export const NetworkSelectModalContent = () => {
  const { chains, switchChainAsync } = useSwitchChain();
  const { chain: connectedChain } = useAccount();

  const onClickNetwork = async (chainId: number) => {
    try {
      await switchChainAsync({ chainId });
    } catch (err) {
      console.error('failed to switch network', err);
    }
  };

  return (
    // <Flex className="flex-col gap-4">
    //   <Flex>
    //     <Text as="h2" className="text-2xl font-bold font-main uppercase">
    //       Switch Network
    //     </Text>
    //   </Flex>
    //   <Flex className="g-1 max-h-52 flex-col overflow-y-auto p-1">
    //     {chains.map((chain) => {
    //       return (
    //         <Button
    //           className="w-full !rounded-sm p-1"
    //           variant="ghost"
    //           onClick={() => onClickNetwork(chain.id)}
    //           key={chain.id}
    //         >
    //           <Flex className="flex-start w-full flex-row items-center justify-start gap-1">
    //             <NetworkImage chainId={chain.id} />

    //             <Text className="pl-1 text-[2.25rem] font-main text-white">
    //               {chain.name}
    //             </Text>
    //             <Flex className="ml-2 items-center justify-center gap-1">
    //               {connectedChain?.id === chain.id && (
    //                 <Box className="h-[6px] w-[6px] rounded-full bg-success" />
    //               )}
    //             </Flex>
    //           </Flex>
    //         </Button>
    //       );
    //     })}
    //   </Flex>
    // </Flex>
    <div className="flex flex-col gap-[2.44rem] text-white font-main px-6">
      <p className="text-[2.25rem]">switch network</p>
      <div className="flex flex-col ">
        {chains.map((chain) => (
          <div
            className="flex gap-5 items-center cursor-pointer hover:bg-opacity-black p-4 rounded-[0.5rem]"
            key={chain.id}
            onClick={() => onClickNetwork(chain.id)}
          >
            <Image
              className="w-[3.625rem] aspect-square"
              src={getChainLogo(chain.id)}
              alt={chain.name}
              width={50}
              height={50}
            />
            <p className="text-[2rem] truncate">{chain.name}</p>
            {connectedChain?.id === chain.id && (
              <Box className="h-[0.75rem] aspect-square rounded-full bg-success ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
