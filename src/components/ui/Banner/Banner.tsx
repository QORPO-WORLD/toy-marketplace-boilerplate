import { Collection } from '@0xsequence/marketplace-sdk';
import Image from 'next/image';

interface BannerProps {
  bgSrc: string;
  title: string;
  title2: string;
  collection?: Collection;
}

function Banner({ bgSrc, title, title2, collection }: BannerProps) {
  return (
    <div
      className="h-[45rem] p-12 bg-top bg-cover rounded-[1.6rem] flex items-end justify-start"
      style={{
        backgroundImage: `url(${bgSrc})`,
      }}
    >
      <div className="">
        <p className="title text-[6rem] text-white leading-none mb:text-[40px]">
          {title}
        </p>
        <div className="flex items-center gap-3 flex-wrap mb:justify-center">
          <p className="title text-[6rem] text-white leading-none mb:text-[40px]">
            {title2}
          </p>
          <Image
            className="w-[3.125rem] h-[3.86rem] mb:hidden"
            src="/market/icons/shield-icon.svg"
            width={3}
            height={4}
            alt="shield"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
