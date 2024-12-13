import Image from "next/image";

function ProfileBox() {
    return ( 
        <div className="flex gap-2 items-center bg-white bg-opacity-10 rounded-[11rem] pl-5">
                <p className="uppercase text-xl text-white">username_123</p>
                <div className="w-18 h-18 rounded-full border-2 overflow-hidden flex items-center justify-center border-main">
                    <Image className="w-full h-full" src="/images/icons/coin.svg" width={20} height={20} alt="coin" />
                </div>
        </div>
     );
}

export default ProfileBox;