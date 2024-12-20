'use client';

import { cn } from '$ui';
import BurgerBtn from '../../../components/ui/BurgerBtn/BurgerBtn';
import { InventoryButton } from './Buttons/InventoryButton';
import { NetworkButton } from './Buttons/NetworkButton';
import { WalletButton } from './Buttons/WalletButton';
import { HeaderLogo } from './HeaderLogo';

export const Header = () => {
  return (
    <header className="flex items-center justify-between pt-[1.44rem] px-[2.5rem] absolute w-full mb:px-4">
      <HeaderLogo />
      <div className="flex items-center text-white uppercase mb:hidden">
        {/* <a
          className="block py-[0.88rem] px-[1.75rem]"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          missions
        </a> */}
        <a
          className="block py-[0.88rem] px-[1.75rem]"
          href="https://playontoy.com"
          rel="noopener noreferrer"
        >
          home
        </a>
        <a
          className={cn(
            'block text-black py-[0.88rem] px-[1.75rem] bg-white rounded-[3.9375rem]',
          )}
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          marketplace
        </a>
      </div>
      <div className="flex items-center gap-4  mb:hidden">
        <div className="flex items-center gap-2">
          <InventoryButton />
          <WalletButton />
          <NetworkButton />
        </div>
        {/* <ProfileBox /> */}
      </div>
      <BurgerBtn />
    </header>

    // <Grid.Root
    //   as="header"
    //   className={cn(
    //     classNames.header,
    //     'h-[--headerHeight] gap-2 bg-background p-2 pt-2',
    //   )}
    //   template={`
    //   [row1-start] "logo search . inventory-button wallet-button order-button network-button" auto [row1-end]
    //   / auto auto 1fr auto auto auto auto auto auto`}
    // >
    //   <Grid.Child name="logo" className="flex items-center">
    //     <HeaderLogo />
    //   </Grid.Child>

    //   <Grid.Child name="." />

    //   <Grid.Child name="inventory-button" className="bg-background/30">
    //     <InventoryButton />
    //   </Grid.Child>

    //   <Grid.Child name="wallet-button" className="bg-background/30">
    //     <WalletButton />
    //   </Grid.Child>

    //   <Grid.Child name="order-button" className="bg-background/30">
    //     <OrderCartButton />
    //   </Grid.Child>

    //   <Grid.Child name="network-button" className="mr-2 bg-background/30">
    //     <NetworkButton />
    //   </Grid.Child>
    // </Grid.Root>
  );
};
