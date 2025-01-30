'use client';

import { useEffect, useRef, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { PiCopySimpleThin } from 'react-icons/pi';
import { RiLogoutBoxLine } from 'react-icons/ri';

import { Button, Dialog, Portal } from '$ui';
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
import clsx from 'clsx';
import Link from 'next/link';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';

function ToyWalletBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const chain = useChain();
  const { address, isConnected } = useAccount();
  const { copied, copyToClipboard } = useCopyToClipboard();
  const { data: walletData } = useBalance({
    address,
  });

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

  return (
    <div
      className={clsx(
        'h-full w-fit pr-[0.63rem]  selection:none bg-main-gradient py-[0.63rem] pl-12 rounded-[1.6875rem] relative text-white flex gap-5 leading-none toy_logo cursor-pointer',
        { 'rounded-b-none': isOpen },
      )}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {chain?.id && (
        <img
          className="w-[3.5rem] aspect-square absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2  block"
          src={getChainLogo(chain?.id || 21000000)}
          alt="logo"
        />
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
      <Dialog.Root>
        <Dialog.Trigger asChild>
          {
            <img
              className="w-[3.5rem] aspect-square absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2  block"
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
    </div>
  );
}

export default ToyWalletBtn;
