import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useAppStore } from "../../../../stores/app";
import { passwordService } from "../../../../services/password.service";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { useTranslation } from "react-i18next";

export const OTPModal = () => {
  const { resetEmail, setResetToken, setAuthView } = useAppStore();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6 - index);

    if (!pasted) return;

    const newCode = [...code];

    pasted.split("").forEach((char, i) => {
      newCode[index + i] = char;
    });

    setCode(newCode);

    const nextIndex = Math.min(index + pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length > 1) {
      const remainingValue = value.substring(1);
      const newCode = [...code];
      newCode[index] = value[0];

      for (let i = 0; i < remainingValue.length && index + 1 + i < 6; i++) {
        newCode[index + 1 + i] = remainingValue[i];
      }
      setCode(newCode);
      if (inputRefs.current[Math.min(index + remainingValue.length, 5)]) {
        inputRefs.current[Math.min(index + remainingValue.length, 5)]?.focus();
      }
      return;
    }

    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    setIsLoading(true);
    try {
      const response = await passwordService.verifyOTP({
        email: resetEmail,
        code: fullCode,
      });
      setResetToken(response.resetToken);
      setAuthView("reset-password");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? t('auth.invalid_otp_error'));
      } else {
        setError(t('auth.something_went_wrong_error'));
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await passwordService.generateOTP(resetEmail);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="w-ful font-manrope bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] relative">
      <div className="dark:bg-[#191a1a] bg-white max-1200px:p-5 p-[32px] sm:p-[48px] rounded-[16px]">
        <div className="max-1200px:mb-4 mb-8">
          <h1 className="max-1200px:text-[21px] text-[26px] text-center font-[600] dark:text-white/80 text-gray-900 mb-2">
            {t('auth.otp_confirmation_title')}
          </h1>
          <p className="text-gray-500 text-sm font-medium text-center">
            {resetEmail}
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-1">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`
              max-1200px:size-9 size-12 text-center max-1200px:text-[18px] text-2xl font-semibold rounded-xl
              border-[1px] dark:border-white/5 border-gray-300 duration-300 focus:ring-2 ring-main/70 dark:text-white/60
              outline-none
              ${digit === "" ? "placeholder:text-gray-400" : ""}
              ${
                digit !== ""
                  ? "dark:bg-white/15 bg-gray-100 text-gray-900"
                  : "dark:bg-white/10 bg-gray-50 text-gray-900"
              }
            `}
              placeholder="-"
              aria-label={`Code digit ${index + 1}`}
            />
          ))}
        </div>
        <p className="text-red-500 text-center mb-3 font-medium">{error}</p>

        <p className="text-gray-500 text-sm mb-8">
          {t("auth.didn't_get_code")}{" "}
          <button
            onClick={handleResendCode}
            className="ml-1 cursor-pointer duration-300 hover:text-main text-gray-700 font-medium underline outline-none"
            disabled={isLoading}
          >
            {t('auth.resend_code')}
          </button>
        </p>

        <button
          onClick={handleVerify}
          disabled={!isCodeComplete}
          className="disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] dark:bg-black/90 bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-[25px]" />
            </div>
          ) : (
            t('auth.verify_otp_button')
          )}
        </button>
      </div>
    </div>
  );
};
