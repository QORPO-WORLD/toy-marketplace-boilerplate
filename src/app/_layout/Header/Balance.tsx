'use client';

import { useEffect, useRef, useState } from 'react';

import sequence from '../../../sequence/Sequence';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useBalance } from 'wagmi';

interface BalanceData {
  dp: {
    id: string;
    last_refresh_points: number;
    loyalty_points: number;
    loyalty_points_for_next_tier: number;
    loyalty_points_instant: number;
    loyalty_points_nfts: number;
    loyalty_points_qorpo: number;
    current_tier_id: string;
    current_tier_name: string;
    next_tier_id: string | null;
    next_tier_name: string | null;
    last_refresh_timestamp: string;
    next_refresh_timestamp: string;
  };
  ccash: {
    currency: string;
    amount: number;
  };
}

type BalanceProps = {
  data: BalanceData;
};

function Balance() {
  const [isOpen, setIsOpen] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { data: walletData } = useBalance({
    address,
  });
  const [isToyInfoShown, setIsToyInfoShown] = useState(false);
  const [isDPInfoShown, setIsDPInfoShown] = useState(false);
  const { data } = useQuery<BalanceProps>({
    queryKey: ['qorpobalance', idToken],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BALANCE_URL}?token=${idToken}`).then(
        (res) => res.json(),
      ),
    enabled: idToken !== null,
  });

  useEffect(() => {
    const getIdToken = async () => {
      try {
        const signedIn = await sequence.isSignedIn();
        if (!signedIn) return;
        const { idToken } = await sequence.getIdToken();
        setIdToken(idToken);
      } catch (error) {
        console.error('Error getting ID token:', error);
      }
    };

    void getIdToken();
  }, [isConnected, address]);

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

  // useEffect(() => {
  //   console.log('wallet data', walletData);
  //   console.log(data);
  // }, [data, walletData]);

  const getChainNamebySymbol = (symbol: string | undefined) => {
    switch (symbol) {
      case 'ETH':
        return 'Ethereum';
      case 'BSC':
        return 'Binance Smart Chain';
      case 'MATIC':
        return 'Polygon';
      case 'FANTOM':
        return 'Fantom';
      case 'SOL':
        return 'Solana';
      case 'BNB':
        return 'Binance Smart Chain';
      case 'TOY':
        return 'TOY TESTNET';
      default:
        return '';
    }
  };

  const getCurrencyLogoBySymbol = (symbol: string | undefined) => {
    switch (symbol) {
      case 'ETH':
        return '/market/icons/ETH-logo.png';
      case 'BSC':
        return '/market/icons/bnb-logo.png';
      case 'MATIC':
        return '/market/icons/matic-logo.png';
      case 'FANTOM':
        return '/market/icons/fantom-logo.png';
      case 'SOL':
        return '/market/icons/sol-logo.png';
      case 'BNB':
        return '/market/icons/bnb-logo.png';
      case 'TOY':
        return '/market/icons/toy-chain-logo.png';
      default:
        return '/market/icons/toy-chain-logo.png';
    }
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-0 right-0 translate-y-[-0.2rem] w-full h-auto select-none">
      {isToyInfoShown && (
        <div className="absolute left-[102%] top-[4.7rem] w-96 p-4 bg-[#483F50]  rounded-3xl shadow-lg tooltip font-DMSans text-white selection:none">
          <p>
            How to get Testnet $TOY Tokens for testing the transactions on TOY
            Marketplace? Players who create a TOY Wallet and earn CCash in
            Citizen Conflict will receive 1 testing $TOY for every CCash
            earned.This testing currency lets you perform on-chain actions and
            explore the TOY Chain Testnet fully. A TOY Wallet is essential to
            maximize your Testnet experience.
          </p>
        </div>
      )}
      {isDPInfoShown && (
        <div className="absolute left-[102%] top-[9.5rem] w-96 p-4 bg-[#483F50] rounded-3xl shadow-lg tooltip font-DMSans text-white selection:none">
          <p>
            Do I earn Diamond Points, while being active in TOY Testnet? Diamond
            Points are a loyalty currency within the QORPO ecosystem. By
            participating in the Testnet and creating a TOY Wallet, you can earn
            these points for Buy / Sell / Listing assets.
          </p>
        </div>
      )}
      <div ref={ref} className="w-full rounded-3xl overflow-hidden">
        <div
          className="py-3 px-8 bg-[#483F50] flex items-center justify-between cursor-pointer rounded-t-3xl hover:bg-[#483f5077] transition-all transition-duration-250 ease-in-out"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p className="text-2xl text-white">Balance</p>
        </div>
        {isOpen && (
          <div className="bg-white tooltip font-DMSans text-text selection:none  rounded-b-3xl">
            <ul>
              <li className="py-3 px-8 border-dashed border-b border-text">
                <p className="opacity-50 font-bold uppercase">
                  {getChainNamebySymbol(walletData?.symbol)}
                </p>
                <div className="flex items-center gap-2">
                  <img
                    className="w-[1.9375rem] aspect-square"
                    src={getCurrencyLogoBySymbol(walletData?.symbol)}
                    alt="logo"
                  />
                  <p className=" text-xl font-bold">
                    {parseFloat(walletData?.formatted || '0').toFixed(4)}{' '}
                    {walletData?.symbol}
                  </p>
                  {/* <p className="ml-auto">$ 0.03</p> */}
                  <img
                    className="w-[1.3rem] aspect-square invert ml-auto"
                    src="/market/icons/info.svg"
                    alt=""
                    onMouseEnter={() => setIsToyInfoShown(true)}
                    onMouseLeave={() => setIsToyInfoShown(false)}
                  />
                </div>
              </li>
              {
                <li className="py-3 px-8 border-text">
                  <p className="opacity-50 font-bold uppercase">
                    DIAMOND Points
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-[1.9375rem] aspect-square"
                      src="/market/images/logos/dp.png"
                      alt="logo"
                    />
                    <p className=" text-xl font-bold">
                      {data?.data.dp.loyalty_points || '0'} DP
                    </p>
                    <img
                      onMouseEnter={() => setIsDPInfoShown(true)}
                      onMouseLeave={() => setIsDPInfoShown(false)}
                      className="w-[1.3rem] aspect-square invert ml-auto"
                      src="/market/icons/info.svg"
                      alt=""
                    />
                  </div>
                </li>
              }
              {/* // <li className="py-3 px-8 border-dashed border-text">
            //   <p className="opacity-50 font-bold uppercase">CCash</p>
            //   <div className="flex items-center gap-2">
            //     <img
            //       className="w-[1.9375rem] aspect-square"
            //       src="/market/images/logos/ccash.png"
            //       alt="logo"
            //     />
            //     <p className=" text-xl font-bold uppercase">
            //       {data?.data.ccash.amount} {data?.data.ccash.currency}
            //     </p>
            //   </div>
            // </li> */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Balance;
