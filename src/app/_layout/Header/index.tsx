import { InventoryButton } from './Buttons/InventoryButton';
import { NetworkButton } from './Buttons/NetworkButton';
import { WalletButton } from './Buttons/WalletButton';
import { HeaderLogo } from './HeaderLogo';
import ProfileBox from './ProfileBox/ProfileBox';

export const Header = () => {
  return (
    <header className="flex items-center justify-between pt-[1.44rem] px-[1.69rem] absolute w-full">
      <HeaderLogo />
      <div className="flex items-center text-white uppercase">
        <a
          className="block py-[0.88rem] px-[1.75rem]"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          missions
        </a>
        <a
          className="block py-[0.88rem] px-[1.75rem]"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          staking
        </a>
        <a
          className="block text-black py-[0.88rem] px-[1.75rem] bg-white rounded-[3.9375rem]"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          marketplace
        </a>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <InventoryButton />
          <WalletButton />
          <NetworkButton />
        </div>
        <ProfileBox />
      </div>
    </header>
  );
};
