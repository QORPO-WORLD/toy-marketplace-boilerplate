'use client';

import { useEffect, useRef, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { LuSquarePlus } from 'react-icons/lu';
import { PiCopySimpleThin } from 'react-icons/pi';
import { RiLogoutBoxLine } from 'react-icons/ri';

import { Dialog } from '$ui';
import { NetworkSelectModalContent } from '../../../components/modals/NetworkSelectModal';
import { WalletModalContent } from '../../../components/modals/WalletModal';
import useCopyToClipboard from '../../../hooks/utils/useCoppyText';
import { Routes } from '../../../lib/routes';
import {
  getChainLogo,
  getChainNamebySymbol,
  getCurrencyLogoBySymbol,
  getFirstWord,
  reduceAddress,
} from '../../../lib/utils/helpers';
import { getThemeManagerElement } from '../../../lib/utils/theme';
import { useChain } from '@0xsequence/kit';
import { useOpenConnectModal } from '@0xsequence/kit';
import clsx from 'clsx';
import Link from 'next/link';
import { useAccount, useBalance, useConnections, useDisconnect } from 'wagmi';

function ToyWalletBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const chain = useChain();
  const { address, isConnected } = useAccount();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const { data: walletData } = useBalance({
    address,
  });
  const { setOpenConnectModal } = useOpenConnectModal();
  const { disconnectAsync } = useDisconnect();
  const connection = useConnections();
  const walletIcon = connection?.length ? connection[0]!.connector?.icon : null;
  const walletId = connection?.length ? connection[0]!.connector?.id : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, ref]);

  const createToyWallet = () => {
    const disconnect = async () => {
      await disconnectAsync();
      setOpenConnectModal(true);
    };
    void disconnect();
  };

  return (
    <div
      className={clsx(
        'h-full w-fit pr-[0.63rem]  selection:none bg-main-gradient py-[0.63rem] pl-12 rounded-[1.6875rem] relative text-white flex gap-5 leading-none cursor-pointer',
        { 'rounded-b-none': isOpen },
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {chain?.id && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            {
              <img
                className="w-[4.5rem] aspect-square absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2  block hover:scale-110 transition-all duration-300"
                src={getChainLogo(chain?.id || 21000000)}
                alt="logo"
              />
            }
          </Dialog.Trigger>

          <Dialog.BaseContent
            className="sm:max-w-[450px]"
            container={getThemeManagerElement()}
            title="Switch Network"
          >
            <NetworkSelectModalContent />
          </Dialog.BaseContent>
        </Dialog.Root>
      )}
      {walletIcon && (
        <div className="w-6 aspect-square overflow-hidden p-[0.2rem] border border-black rounded-full bg-white absolute left-0 bottom-0  translate-x-[1rem]">
          <img className="w-full" src={walletIcon} alt="wallet-icon" />
        </div>
      )}
      <div className="flex items-center gap-1">
        <div className="">
          <p className="font-DMSans text-sm">
            {getFirstWord(getChainNamebySymbol(walletData?.symbol))}
          </p>
          <p className=" text-xl font-bold leading-none">
            {parseFloat(walletData?.formatted || '0').toFixed(3)}
          </p>
        </div>
        <img
          className="w-[1.9375rem] aspect-square"
          src={getCurrencyLogoBySymbol(walletData?.symbol)}
          alt="logo"
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="leading-none">
          <p className="font-DMSans text-sm">Wallet</p>
          <p className="text-xl font-bold leading-none">
            {reduceAddress(address)}
          </p>
        </div>
        <PiCopySimpleThin
          className="cursor-pointer w-[1.6rem] h-[1.6rem] shrink-0 relative active:scale-90 hover:scale-105"
          onClick={() => copyToClipboard(address as string)}
        />
      </div>
      {isOpen && (
        <div className="absolute top-[99%] right-0 w-full bg-white h-fit rounded-b-[2.6875rem] tooltip overflow-hidden">
          <ul className="text-black">
            <Link href={Routes.inventory()}>
              <li className="flex items-center gap-2 px-6 py-4 border-dashed-[2px] border-b hover:bg-opacity-black">
                <FaWallet />
                <p className="text-[1.125rem]">Wallet</p>
              </li>
            </Link>
            {walletId !== 'sequence-waas' && (
              <li
                className="flex items-center gap-2 px-6 py-4 border-dashed-[2px] border-b bg-main-gradient hover:scale-[1.03] transition-transform duration-200"
                onClick={() => createToyWallet()}
              >
                <div className="p-1 bg-white rounded-[0.5rem] ">
                  <FaPlus />
                </div>
                <p className="text-[1.125rem] text-white">Create toy wallet</p>
              </li>
            )}
            {isConnected && (
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <li className="flex items-center gap-2 px-6 py-4 hover:bg-opacity-black">
                    <RiLogoutBoxLine />

                    <p className="text-[1.125rem]">log out</p>
                  </li>
                </Dialog.Trigger>
                <Dialog.BaseContent
                  className="sm:max-w-[450px]"
                  container={getThemeManagerElement()}
                  title="Switch Network"
                >
                  <WalletModalContent />
                </Dialog.BaseContent>
              </Dialog.Root>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ToyWalletBtn;
