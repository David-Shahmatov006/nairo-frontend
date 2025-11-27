import { GetStartedLabel } from "./components/GetStartedLabel";
import { Posts } from "./components/Posts";
import { QuickActions } from "./components/QuickActions";
import { RandomConnect } from "./components/RandomConnect";
import { motion } from "framer-motion";

export const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <GetStartedLabel />

      <QuickActions />
      <div className="flex flex-col lg:flex-row gap-6">
        <Posts />
        <RandomConnect />
      </div>
    </motion.div>
  );
};
