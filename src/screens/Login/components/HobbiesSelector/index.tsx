import clsx from "clsx";
import { FiArrowRight } from "react-icons/fi";
import { interests } from "../../../../constants/common";
import { BiLoaderAlt } from "react-icons/bi";

interface IProps {
  handleBack: () => void;
  isLoading: boolean;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  handleRegister: () => Promise<void>;
}
export const HobbiesSelector = ({
  selected,
  isLoading,
  handleBack,
  setSelected,
  handleRegister,
}: IProps) => {
  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] z-[2] relative p-6 font-manrope max-w-3xl mx-auto">
      <div className="dark:bg-[#191a1a] bg-white p-[32px] sm:p-[48px] rounded-[16px]">
        <h2 className="dark:text-white/80 text-2xl font-bold mb-4">
          Select Your Interests
        </h2>

        <p className="dark:text-[#6f6f6f] text-gray-600 mb-6">
          Choose hobbies and topics that you like. This helps us recommend
          relevant content and friends.
        </p>

        <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-wrap gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={clsx(
                "px-4 py-2 rounded-full border dark:border-white/10 border-gray-300 transition-colors duration-200 dark:text-white/80 text-sm font-medium cursor-pointer",
                selected.includes(interest)
                  ? "bg-main text-white border-main"
                  : "dark:bg-white/10 bg-white text-gray-700 hover:bg-main/70"
              )}
            >
              {interest}
            </button>
          ))}
        </div>

        <button
          onClick={handleRegister}
          className="mt-7 group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/80 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-[25px]" />
            </div>
          ) : (
            <>
              <span>Create account</span>
              <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
            </>
          )}
        </button>

        <button
          onClick={handleBack}
          className="mt-2 group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] border dark:border-white/10 border-gray-500 dark:text-white/50 text-gray-700 w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};
