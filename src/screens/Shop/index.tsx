import { IoIosArrowForward } from "react-icons/io";
import nairoBag from "../../assets/images/nairoBag.webp";
import nairoCoins3 from "../../assets/images/nairoCoins3.webp";
import { BackButton } from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Shop = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const packs = [
    { amount: 10, price: 1 },
    { amount: 50, price: 5 },
    { amount: 100, price: 10 },
    { amount: 250, price: 25 },
    { amount: 500, price: 50 },
    { amount: 1000, price: 100 },
  ];

  return (
    <div className="font-manrope w-full max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[500] text-[30px] font-[500] text-gray-900">
          {t("shop.title")}
        </h1>
        <BackButton handleBack={() => navigate(-1)} />
      </div>

      <div className="bg-white-900 text-white rounded-2xl p-6 mb-10 shadow-lg shadow-main/20 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{t("shop.your_balance")}</p>
          <p className="text-[30px] text-black/70 font-bold">1 240 NC</p>
        </div>
        <img src={nairoBag} className="w-[100px]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packs.map((pack) => (
          <div
            key={pack.amount}
            className="bg-white rounded-2xl shadow-md p-6 border border-transparent 
             hover: hover:shadow-xl hover:shadow-main/40 duration-300 cursor-pointer 
             flex flex-col items-center text-center"
          >
            <img src={nairoCoins3} className="w-[60px] mb-4" />

            <h3 className="text-3xl font-extrabold text-gray-900">
              {pack.amount} NC
            </h3>

            <p className="text-xl font-semibold text-main mt-2 mb-6">
              ${pack.price.toFixed(2)}
            </p>

            <button className="w-full bg-gray-900 text-white h-12 rounded-xl hover:ring-2 ring-main/70 cursor-pointer duration-300 active:scale-[0.98] duration-300 flex items-center justify-center gap-2 font-semibold">
              {t('shop.buy_now')} <IoIosArrowForward className="text-xl" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-500 text-sm mt-8">
        1 Nairo Coin = $0.10
      </p>
    </div>
  );
};
