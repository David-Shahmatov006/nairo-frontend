import { useEffect, useState } from "react";
import {
  useObserveScrollPosition,
  useScrollToBottom,
  useSticky,
} from "react-scroll-to-bottom";
import { useWindowSize } from "usehooks-ts";
import { motion } from "framer-motion";
import { HiOutlineArrowDown } from "react-icons/hi2";

export const ScrollButton = () => {
  const { width } = useWindowSize();
  const scrollToBottom = useScrollToBottom();
  const [isSticky] = useSticky();
  const [isFarFromBottom, setIsFarFromBottom] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const scrollContainer = document.querySelector(".chat-scroll-container");
    if (scrollContainer) {
      setScrollHeight(scrollContainer.clientHeight);
    }
  }, [width]);

  useObserveScrollPosition(({ scrollTop }) => {
    const threshold = width > 1440 ? 1500 : 1000;
    const next = scrollTop + scrollHeight <= threshold;
    setIsFarFromBottom((prev) => (prev === next ? prev : next));
  });

  if (isSticky || !isFarFromBottom) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => scrollToBottom()}
      className="absolute bottom-[20px] right-1/2 bg-main/50 min-2000px:size-[1.3vw] size-7 flex items-center justify-center rounded-full text-white hover:bg-main/90 duration-300 cursor-pointer"
    >
      <HiOutlineArrowDown className="text-[16px] min-2000px:text-[.7vw]" />
    </motion.button>
  );
};
