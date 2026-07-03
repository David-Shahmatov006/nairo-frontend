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
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(
    document.getElementById("chat-scroll-container")?.scrollHeight || 0
  );

  useEffect(() => {
    const scrollContainer = document.querySelector(".chat-scroll-container");
    if (scrollContainer) {
      setScrollHeight(scrollContainer.clientHeight);
    }
  }, [width]);

  useObserveScrollPosition(({ scrollTop }) => {
    setScrollTop(scrollTop);
  });

  const isShouldShowButton =
    scrollTop + scrollHeight > (width > 1440 ? 1500 : 1000);

  if (isSticky || isShouldShowButton) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => scrollToBottom()}
      className="absolute bottom-[20px] right-1/2 bg-main/50 size-7 flex items-center justify-center rounded-full text-white hover:bg-main/90 duration-300 cursor-pointer"
    >
      <HiOutlineArrowDown />
    </motion.button>
  );
};
