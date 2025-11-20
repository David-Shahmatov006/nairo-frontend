import { motion } from "framer-motion";

export const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] backdrop-blur-[10px] bg-black/20">
      <div className="bg-white/70 backdrop-blur-xl px-10 py-10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] flex space-x-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-7 h-7 rounded-full bg-[#8b53ff]"
            animate={{
              y: ["0%", "-60%", "0%"],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
};
