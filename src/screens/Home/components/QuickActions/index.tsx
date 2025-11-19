import nairoCoin from "../../../../assets/images/nairoCoin2.webp";
import nairoPremium from "../../../../assets/images/nairoPremium.webp";

export const QuickActions = () => {
  return (
    <div className="font-manrope">
      <h2 className="text-[20px] font-[600] mb-5">Quick Actions</h2>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          <img src={nairoPremium} className="w-[20px]" />
          Get Nairo Premium
        </button>
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          <img src={nairoCoin} className="w-[20px]" />
          Buy Nairo Coins
        </button>
        <button className="flex items-center gap-2 border border-[#E5E7EB] bg-white px-4 py-2 rounded-lg hover:ring-2 hover:ring-main/50 duration-300 cursor-pointer">
          👥 <span>Invite Friends</span>
        </button>
      </div>
    </div>
  );
};
