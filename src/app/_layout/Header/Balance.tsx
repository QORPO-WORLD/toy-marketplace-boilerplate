'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAccount, useBalance } from 'wagmi';

function Balance() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const { data: walletData } = useBalance({
    address,
  });
  const { isPending, error, data } = useQuery({
    queryKey: ['qorpobalance'],
    queryFn: () =>
      fetch(
        `https://devapi.playontoy.com/api/v1/me/diamond-points/?wallet_address=${address}`,
      ).then((res) => res.json()),
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) {
        console.log('click outside');
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

  //   useEffect(() => {
  //     console.log('wallet data', walletData);
  //     console.log(data);
  //   }, [data, walletData]);

  return (
    <div
      ref={ref}
      className="w-full rounded-3xl overflow-hidden absolute top-0 right-0 translate-y-[-0.5rem]"
    >
      <div
        className="py-3 px-8 bg-[#483F50] flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-2xl text-white">Balance</p>
        <img
          className="w-[1.1rem] aspect-square"
          src="/market/icons/info.svg"
          alt=""
        />
      </div>
      {isOpen && (
        <div className="bg-white tooltip font-DMSans text-text selection:none">
          <ul>
            <li className="py-3 px-8 border-dashed border-b border-text">
              <p className="opacity-50 font-bold uppercase">TOY</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-[1.9375rem] aspect-square"
                  src="/market/images/logos/toy-logo.png"
                  alt="logo"
                />
                <p className=" text-xl font-bold">
                  {walletData?.formatted} {walletData?.symbol}
                </p>
                {/* <p className="ml-auto">$ 0.03</p> */}
              </div>
            </li>
            <li className="py-3 px-8 border-dashed border-b border-text">
              <p className="opacity-50 font-bold uppercase">DIAMOND Points</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-[1.9375rem] aspect-square"
                  src="/market/images/logos/dp.png"
                  alt="logo"
                />
                <p className=" text-xl font-bold">
                  {data.data.loyalty_points} DP
                </p>
              </div>
            </li>
            {/* <li className="py-3 px-8 border-dashed border-text">
              <p className="opacity-50 font-bold uppercase">CCash</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-[1.9375rem] aspect-square"
                  src="/market/images/logos/ccash.png"
                  alt="logo"
                />
                <p className=" text-xl font-bold">10.569 TOY</p>
              </div>
            </li> */}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Balance;
