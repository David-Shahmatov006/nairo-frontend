import { useEffect, useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../../../../../../../stores/app";
import { TfiClose } from "react-icons/tfi";
import { useTranslation } from "react-i18next";
import { postService } from "../../../../../../../../services/post.service";
import { BiLoaderAlt } from "react-icons/bi";
import { IoCameraReverse } from "react-icons/io5";
import { PostImage } from "../PostItem";
import { usePosts } from "../../../../../../../../hooks/usePosts";
import { useAuthStore } from "../../../../../../../../stores/auth";
import { mutate as mutateSWR } from "swr";
import { pickAchievementKeys } from "../../../../../../../../constants/achievements";

export const PostModal = () => {
  const { t } = useTranslation();
  const postModal = useAppStore((s) => s.postModal);
  const closePostModal = useAppStore((s) => s.closePostModal);
  const enqueueAchievementUnlocks = useAppStore(
    (s) => s.enqueueAchievementUnlocks,
  );
  const isEdit = !!postModal.post?.id;

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { mutate } = usePosts(postModal.isOpen ? postModal.mode : null);
  const userId = useAuthStore((s) => s.user?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleBlurModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current?.contains(e.target as Node)) {
      return;
    }

    closePostModal();
  };

  useEffect(() => {
    document.body.style.overflow = postModal.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [postModal.isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > 5 * 1024 * 1024) {
      setError(t("create_post.max_img_size_error"));
      return;
    }

    const { fileTypeFromBlob } = await import("file-type");
    const type = await fileTypeFromBlob(file);

    if (
      !type ||
      !["image/jpeg", "image/png", "image/webp"].includes(type.mime)
    ) {
      setError(t("create_post.invalid_image"));
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setImageFile(file);
    setImage(previewUrl);
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim() || !description.trim()) {
      setError(t("create_post.fill_all_fields_error"));
      return;
    }

    if (!isEdit && !imageFile) {
      setError(t("create_post.select_image_error"));
      return;
    }

    setIsLoading(true);

    let newlyUnlocked: string[] = [];

    try {
      if (isEdit) {
        await postService.updatePost(postModal.post!.id, {
          title,
          description,
          imageFile,
        });
      } else {
        const created = await postService.createPost(
          title,
          description,
          imageFile!,
        );
        newlyUnlocked = created?.newlyUnlocked ?? [];
        if (userId) {
          mutateSWR(["achievements", userId]);
        }
      }

      setTitle("");
      setDescription("");
      setImage(null);
      setImageFile(null);

      closePostModal();
      enqueueAchievementUnlocks(pickAchievementKeys(newlyUnlocked));

      await mutate();
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(axiosError.response?.data?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!postModal.isOpen) return;

    if (postModal.post) {
      setTitle(postModal.post.title);
      setDescription(postModal.post.description);
      setImage(postModal.post.image);
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
      setImageFile(null);
    }

    setError("");
  }, [postModal]);

  return (
    <AnimatePresence>
      {postModal.isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBlurModal}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full min-2000px:max-w-[30vw] max-w-[37%] max-550px:max-w-full [@media(min-width:551px)_and_(max-width:1024px)]:max-w-full dark:bg-[#181818] bg-white min-2000px:rounded-[1vw] rounded-2xl min-2000px:p-[1.1vw] p-6 shadow-xl font-manrope relative"
          >
            <button
              onClick={closePostModal}
              className="absolute min-2000px:size-[2vw] size-10 max-768px:size-9 min-2000px:top-[.8vw] top-4 min-2000px:right-[.8vw] right-4 flex items-center justify-center min-2000px:rounded-[.5vw] rounded-[12px] border dark:border-white/10 border-gray-300 dark:bg-white/10 bg-white hover:ring-2 hover:ring-main/70 duration-300"
            >
              <TfiClose className="min-2000px:text-[0.8vw] dark:text-white/50" />
            </button>

            <h2 className="max-768px:text-[18px] min-2000px:text-[1.1vw] text-[22px] font-[600] dark:text-white/80 text-gray-900 max-768px:mb-3 min-2000px:mb-[1vw] mb-6 text-center">
              {isEdit ? "Редагувати пост" : t("create_post.title")}
            </h2>

            <div className="max-768px:mb-3 min-2000px:mb-[.9vw] mb-6">
              {!image ? (
                <label
                  className="flex flex-col items-center justify-center w-full min-2000px:h-[9vw] h-40 
                                 border border-dashed dark:border-white/20 border-gray-300 min-2000px:rounded-[.7vw] rounded-xl 
                                 cursor-pointer dark:bg-white/5 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <FiImage className="min-2000px:text-[1.5vw] text-3xl text-gray-400 mb-2" />
                  <span className="text-gray-500 min-2000px:text-[.8vw] text-sm">
                    {t("create_post.upload_img")}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-full min-2000px:h-[9vw] h-48">
                  <PostImage onModal src={image} title="" />
                  <label className="absolute min-2000px:top-[.2vw] top-2 min-2000px:right-[0.5vw] right-2 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <IoCameraReverse className="text-black hover:text-black/70 min-2000px:text-[1.5vw] text-[30px] duration-300" />
                  </label>
                </div>
              )}
            </div>

            <div className="max-768px:mb-3 min-2000px:mb-[.9vw] mb-4">
              <input
                type="text"
                placeholder={t("create_post.post_title")}
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full min-2000px:px-[.8vw] px-4 max-768px:py-2 min-2000px:py-[.5vw] py-3 dark:bg-white/5 dark:border-white/20 dark:text-white/80 bg-gray-50 border border-gray-200 max-768px:text-[16px] min-2000px:text-[.8vw] min-2000px:rounded-[.5vw] rounded-xl focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
              />
            </div>

            <div className="max-768px:mb-3 min-2000px:mb-[.3vw] mb-6">
              <textarea
                placeholder={t("create_post.post_desc")}
                rows={4}
                value={description}
                maxLength={1000}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-2000px:px-[.8vw] px-4 max-768px:py-2 min-2000px:py-[.5vw] py-3 dark:bg-white/5 dark:border-white/20 dark:text-white/80 bg-gray-50 border border-gray-200 max-768px:text-[14px] min-2000px:text-[.8vw] min-2000px:rounded-[.5vw] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-main/70 duration-300"
              />
            </div>

            {error && (
              <p className="text-red-500 font-[500] text-center min-2000px:mb-[.6vw] mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center dark:bg-white/7 dark:border-white/20 dark:text-white/80 bg-gray-800 text-white min-2000px:py-[.5vw] py-3 min-2000px:rounded-[.5vw] rounded-xl font-[600] hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <BiLoaderAlt className="animate-spin min-2000px:text-[1.1vw] text-[22px]" />
              ) : (
                <span className="min-2000px:text-[.7vw]">
                  {t("create_post.publish")}
                </span>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
