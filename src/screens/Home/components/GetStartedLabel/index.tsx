import { useState } from "react";
import nairoCoins from "../../../../assets/images/nairoCoins.webp";
import { GetStartedEllipse } from "../../../../assets/svgComponents/GetStartedEllipse";
import { TfiClose } from "react-icons/tfi";
import { AnimatePresence, motion } from "framer-motion";

export const GetStartedLabel = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="welcomeBanner"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-10%" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg shadow-sm bg-white overflow-hidden w-full flex items-center justify-between p-8"
        >
          <img
            src={nairoCoins}
            className="rotate-[-20deg] z-[1] w-[250px] absolute right-[0%] -bottom-[15%] opacity-95"
          />
          <GetStartedEllipse className="absolute inset-0 h-full" />
          <div className="z-[2]">
            <h1 className="text-[20px] font-manrope font-[700] mb-5">
              Welcome to Nairo!
            </h1>
            <h2 className="relative z-[2] max-w-[75%] font-manrope font-[600] mb-7">
              Build your space, create posts, share your moments with friends,
              chat anytime, and boost your favorite creators with Nairo coins.
            </h2>
            <p className="text-[20px] font-manrope font-[700]">
              Your journey starts right now — make it unforgettable!
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="z-[2] absolute w-[40px] bg-[#FFFFFF] shadow-shadow-xs border flex items-center justify-center border-[#E5E7EB] rounded-[12px] h-[40px] top-[32px] right-[32px] cursor-pointer hover:ring-2 hover:ring-gray-300/50 duration-300"
          >
            <TfiClose />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
