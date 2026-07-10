import { GetStartedLabel } from "./components/GetStartedLabel";
import { Posts } from "./components/Posts";
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-2000px:gap-[1vw] gap-6"
    >
      <GetStartedLabel />

      <Posts mode="all" />
    </motion.div>
  );
};
