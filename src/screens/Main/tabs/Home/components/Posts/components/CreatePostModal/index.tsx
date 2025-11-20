import { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../../../../../../stores/app";
import { TfiClose } from "react-icons/tfi";

export const CreatePostModal = () => {
  const { isOpenPostModal, setIsOpenPostModal } = useAppStore();
  const [image, setImage] = useState<string | null>(null);

  // Block scroll when modal open
  useEffect(() => {
    if (isOpenPostModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenPostModal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  return (
    <AnimatePresence>
      {isOpenPostModal && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] font-manrope relative"
          >
            <button
              onClick={() => setIsOpenPostModal(false)}
              className="z-[2] absolute w-[40px] bg-[#FFFFFF] border flex items-center justify-center border-[#E5E7EB] rounded-[12px] h-[40px] top-4 right-4 cursor-pointer hover:ring-2 hover:ring-main/40 duration-300"
            >
              <TfiClose />
            </button>
            <h2 className="text-[22px] font-[600] text-gray-900 mb-6 text-center">
              Create a Post
            </h2>

            <div className="mb-6">
              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <FiImage className="text-3xl text-gray-400 mb-2" />
                  <span className="text-gray-500 text-sm">
                    Upload an image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-full h-48">
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 duration-300 cursor-pointer"
                  >
                    <FiX className="text-white text-lg" />
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Post title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              />
            </div>

            <div className="mb-6">
              <textarea
                placeholder="Write something..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              />
            </div>

            <button
              onClick={() => setIsOpenPostModal(false)}
              className="w-full bg-main text-white py-3 rounded-xl font-[600] hover:ring-2 ring-main/40 duration-300 cursor-pointer"
            >
              Publish
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
