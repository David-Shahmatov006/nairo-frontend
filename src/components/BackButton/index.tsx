import { useTranslation } from "react-i18next";
import { GoArrowLeft } from "react-icons/go";

export const BackButton = ({ handleBack }: { handleBack: () => void }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={handleBack}
      className="w-[max-content] flex items-center justify-center cursor-pointer font-bold min-2000px:rounded-[.3vw] rounded-lg duration-300 border dark:border-white/10 dark:text-white/80 border-gray-300 text-gray-700 dark:bg-white/5 bg-white hover:ring-2 ring-main/70 focus:ring-2 max-768px:!px-3 max-768px:py-2 min-2000px:py-[1vw] py-3 min-2000px:px-[.7vw] px-3 text-base flex max-768px:gap-1 min-2000px:gap-[.6vw] gap-3 max-768px:h-10 h-[48px] duration-300"
    >
      <GoArrowLeft className="min-2000px:text-[.8vw]" />
      <div className="font-[700] min-2000px:text-[.8vw] max-768px:text-[14px]">
        {t("back_button")}
      </div>
    </button>
  );
};
