function DPCard({ title, tooltip }: { title: string; tooltip: string }) {
  return (
    <div className="relative group">
      <div className="bg-white py-4 px-6 flex items-center gap-3 rounded-3xl">
        <img
          className="block w-10 aspect-square logo-shadow"
          src="/market/images/logos/dp.png"
          alt="logo"
        />
        <div className="text-text">
          <p className="text-xl  leading-none">{title}</p>
          <p className="text-3xl  leading-none">5</p>
        </div>
      </div>
      <div className="absolute top-full left-0 translate-y-[0.5rem] tooltip bg-[#483F51] p-4 hidden rounded-3xl group-hover:block">
        <p className="font-DMSans text-white">{tooltip}</p>
      </div>
    </div>
  );
}

export default DPCard;
