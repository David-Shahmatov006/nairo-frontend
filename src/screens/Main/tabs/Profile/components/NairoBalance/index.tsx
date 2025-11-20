import { useTranslation } from "react-i18next";
import nairoCoins from "../../../../../../assets/images/nairoCoins2.webp";
import reachMuskot from "../../../../../../assets/images/reach_muskot.webp";

export const NairoBalance = ({ user }: any) => {
  const { t } = useTranslation();

  return (
    <div className="h-[max-content] font-manrope w-[25%] bg-white p-4 rounded-xl ring-2 ring-main/10 min-w-[120px]">
      <span className="text-[20px] font-[500]">{t('profile.nairo_balance')}</span>
      <div className="flex items-center gap-2 justify-between mt-2">
        <img src={reachMuskot} className="w-[80px]" />

        <div className="flex items-center gap-3 mt-1 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-fit">
          <img src={nairoCoins} className="w-[26px] drop-shadow-sm" />
          <span className="text-[28px] font-[600] text-gray-900">
            {user.nairoBalance}
          </span>
        </div>
      </div>
    </div>
  );
};
