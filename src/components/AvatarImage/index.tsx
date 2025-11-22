import clsx from "clsx";
import { useState } from "react";
import { RxAvatar } from "react-icons/rx";

export const AvatarImage = ({
  src,
  className,
  iconClassName
}: {
  src: string;
  className?: string;
  iconClassName?: string;
}) => {
  const [error, setError] = useState(false);

  const showFallback = !src || error;

  return (
    <div
      className={clsx(
        "!size-full bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {showFallback ? (
        <RxAvatar className={clsx("w-14 h-14 text-main/40", iconClassName)} />
      ) : (
        <img
          src={src}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
