import { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../../../../../../stores/app";
import { TfiClose } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { postService } from "../../../../../../../../services/post.service";
import { BiLoaderAlt } from "react-icons/bi";
import { mutate } from "swr";

export const CreatePostModal = () => {
  const { isOpenPostModal, setIsOpenPostModal } = useAppStore();
  const { t } = useTranslation();

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpenPostModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenPostModal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    setError("");

    if (!imageFile || !title || !description) {
      setError("Fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      await postService.createPost(title, description, imageFile);

      setTitle("");
      setDescription("");
      setImage(null);
      setImageFile(null);

      setIsOpenPostModal(false);
      mutate(["posts-user"]);
      mutate(["posts-saved"]);
      mutate(["posts-all"]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error creating post";
      setError(msg);
    } finally {
      setIsLoading(false);
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
            className="w-full max-w-lg dark:bg-black/50 bg-white rounded-2xl p-6 shadow-xl font-manrope relative"
          >
            <button
              onClick={() => setIsOpenPostModal(false)}
              className="absolute w-[40px] h-[40px] top-4 right-4 flex items-center justify-center
                         rounded-[12px] border dark:border-white/10 border-gray-300 
                         dark:bg-white/10 bg-white hover:ring-2 hover:ring-main/40 duration-300"
            >
              <TfiClose className="dark:text-white/50" />
            </button>

            <h2 className="text-[22px] font-[600] dark:text-white/80 text-gray-900 mb-6 text-center">
              {t("create_post.title")}
            </h2>

            <div className="mb-6">
              {!image ? (
                <label
                  className="flex flex-col items-center justify-center w-full h-40 
                                 border border-dashed dark:border-white/20 border-gray-300 rounded-xl 
                                 cursor-pointer dark:bg-white/10 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <FiImage className="text-3xl text-gray-400 mb-2" />
                  <span className="text-gray-500 text-sm">
                    {t("create_post.upload_img")}
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
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                    }}
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
                placeholder={t("create_post.post_title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 dark:bg-white/10 dark:border-white/20 
                           dark:text-white/80 bg-gray-50 border border-gray-200 
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              />
            </div>

            <div className="mb-6">
              <textarea
                placeholder={t("create_post.post_desc")}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 dark:bg-white/10 dark:border-white/20 
                           dark:text-white/80 bg-gray-50 border border-gray-200 
                           rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-main/40 duration-300"
              />
            </div>

            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="w-full flex items-center justify-center dark:bg-white/10 dark:border-white/20 
                         dark:text-white/80 bg-gray-800 text-white py-3 rounded-xl font-[600]
                         hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <BiLoaderAlt className="animate-spin text-[22px]" />
              ) : (
                t("create_post.publish")
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
