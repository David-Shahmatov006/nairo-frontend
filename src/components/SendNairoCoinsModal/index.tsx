import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose, IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import coin from "../../assets/images/nairoCoin2.webp";
import { AvatarImage } from "../AvatarImage";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  balance: number;
  onSend: (amount: number) => Promise<void>;
}

export const SendNairoCoinsModal = ({
  isOpen,
  onClose,
  user,
  balance,
  onSend,
}: Props) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [coins, setCoins] = useState<number[]>([]);

  const startCoinRain = () => {
    setCoins(Array.from({ length: 12 }, (_, i) => i));
  };

  const handleSend = async () => {
    if (!amount || Number(amount) <= 0) return;

    setStep("loading");
    startCoinRain();

    await onSend(Number(amount));

    setTimeout(() => setStep("success"), 1100);
  };

  const reset = () => {
    setAmount("");
    setCoins([]);
    setStep("form");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="font-manrope fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            reset();
            onClose();
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            className="relative w-[380px] rounded-2xl p-6 overflow-hidden bg-white text-black border border-black/10 dark:bg-[#141418]/90 dark:text-white/80 dark:border-white/10 dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
          >
            {(step === "loading" || step === "success") && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {coins.map((c) => (
                  <motion.img
                    key={c}
                    src={coin}
                    className="absolute w-[32px] h-[32px] opacity-90 dark:opacity-80"
                    initial={{
                      top: -40,
                      left: Math.random() * 300 + 20,
                      opacity: 1,
                    }}
                    animate={{
                      top: 420,
                      rotate: 360,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 1.3 + Math.random() * 1,
                      ease: "linear",
                      repeat: 1,
                      delay: Math.random() * 1.2,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[22px] font-semibold">
                {t("send_nairo_modal.title")}
              </h2>

              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="size-7 rounded-full cursor-pointer hover:ring-2 ring-main/70 duration-300 flex items-center justify-center dark:bg-white/10 bg-gray-200"
              >
                <IoIosClose size={32} />
              </button>
            </div>

            {step === "form" && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="
                      size-[56px] rounded-full overflow-hidden flex-shrink-0
                      border border-black/15 dark:border-white/20
                    "
                  >
                    <AvatarImage src={user.avatar || ""} />
                  </div>

                  <div>
                    <p className="font-semibold text-[17px]">{user.name}</p>
                    <p className="text-[13px] text-black/50 dark:text-gray-400">
                      {t("send_nairo_modal.recipient")}
                    </p>
                  </div>
                </div>

                <div className="font-medium text-[14px] text-black/70 dark:text-gray-300 mb-4">
                  <span className="text-black dark:text-white">
                    {t("send_nairo_modal.your_balance")}:
                  </span>
                  <span className="text-main ml-1 mr-[2px]">{balance}</span>
                  NC
                </div>

                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="
                    w-full h-[54px] px-4 rounded-xl text-[17px] outline-none
                    bg-white border border-black/15 text-black
                    focus:ring-2 focus:ring-main/60

                    dark:bg-[#0f0f14] dark:border-white/15 dark:text-white
                    dark:focus:ring-main duration-300
                  "
                  placeholder={t("send_nairo_modal.enter_amount_placeholder")}
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSend}
                    className="
                      flex-1 h-[48px] rounded-xl font-semibold
                      dark:bg-black/50 bg-gray-900 text-white hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-70 disabled:pointer-events-none
                    "
                  >
                    {t("send_nairo_modal.send_button")}
                  </button>

                  <button
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                    className="
                      duration-300 cursor-pointer flex-1 h-[48px] rounded-xl font-semibold
                      border border-black/15 text-black hover:bg-black/5
                      dark:border-white/20 dark:text-white dark:hover:bg-white/10
                    "
                  >
                    {t("send_nairo_modal.cancel_button")}
                  </button>
                </div>
              </>
            )}

            {step === "loading" && (
              <div className="flex flex-col items-center py-10">
                <motion.img
                  src={coin}
                  className="size-[70px]"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.9,
                    ease: "linear",
                  }}
                />
                <p className="mt-4 text-black/70 dark:text-gray-300 font-medium">
                  {t("send_nairo_modal.sending_text")}
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center pt-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="
                    size-[60px] rounded-full bg-main 
                    flex items-center justify-center shadow-[0_0_20px_#8b53ff]
                  "
                >
                  <span className="text-white text-[34px]">
                    <IoMdCheckmark />
                  </span>
                </motion.div>

                <p className="mt-5 text-black/70 dark:text-gray-300 font-medium">
                  {t("send_nairo_modal.success_text")}
                </p>

                <button
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="
                    mt-6 w-full h-[48px] rounded-xl font-semibold
                    dark:bg-black/50 bg-gray-900 text-white hover:ring-2 ring-main/70 duration-300 cursor-pointer
                  "
                >
                  {t("send_nairo_modal.close_button")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
