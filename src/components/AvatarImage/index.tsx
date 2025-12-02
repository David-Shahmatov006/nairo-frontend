import clsx from "clsx";
import { useState } from "react";
import { RxAvatar } from "react-icons/rx";

export const AvatarImage = ({ src, className, iconClassName }: any) => {
  const [error, setError] = useState(false);

  const showFallback = !src || error;

  const finalSrc =
    src && !src.startsWith("blob:")
      ? `${import.meta.env.VITE_API_URL}${src}?v=${Date.now()}`
      : src;

  return (
    <div
      className={clsx(
        "!size-full dark:bg-white/10 bg-gray-100 border dark:border-white/20 border-gray-200 rounded-full flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {showFallback ? (
        <RxAvatar className={clsx("w-14 h-14 text-main/70", iconClassName)} />
      ) : (
        <img
          src={finalSrc}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
