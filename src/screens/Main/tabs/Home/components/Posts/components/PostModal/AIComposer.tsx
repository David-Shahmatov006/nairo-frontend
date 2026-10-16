import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IoChevronDown, IoSparklesOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { BiLoaderAlt } from "react-icons/bi";
import { isAxiosError } from "axios";
import { postService } from "../../../../../../../../services/post.service";
import type { GeneratedPost } from "../../../../../../../../types/post";

type AIComposerProps = {
  onGenerated: (
    post: GeneratedPost
  ) => void | Promise<void>;
  onGeneratingChange: (loading: boolean) => void;
};

export const AIComposer = ({
  onGenerated,
  onGeneratingChange,
}: AIComposerProps) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [idea, setIdea] = useState("");
  const [withImage, setWithImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!idea.trim() || isGenerating) return;

    setIsGenerating(true);
    onGeneratingChange(true);
    setError("");

    try {
      const post = await postService.createPostWithAI(idea.trim(), withImage);

      await onGenerated(post);

      setIsOpen(false);
      setIdea("");
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || t("create_post.ai_error"));
    } finally {
      setIsGenerating(false);
      onGeneratingChange(false);
    }
  };
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/20 dark:bg-white/5 min-2000px:mb-[.9vw] min-2000px:rounded-[.5vw]">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="post-ai-composer"
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-12 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main/70 dark:text-white/80 dark:hover:bg-white/5 min-2000px:min-h-[2.4vw] min-2000px:gap-[.6vw] min-2000px:px-[.8vw] min-2000px:py-[.6vw] min-2000px:text-[.75vw]"
      >
        <IoSparklesOutline
          aria-hidden="true"
          className="size-5 shrink-0 text-main dark:text-[#c4a6ff] min-2000px:size-[1vw]"
        />
        <span className="flex-1">{t("create_post.ai_compose")}</span>
        <IoChevronDown
          aria-hidden="true"
          className={`size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none min-2000px:size-[.8vw] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="post-ai-composer"
            key="post-ai-composer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              if (isOpen) inputRef.current?.focus({ preventScroll: true });
            }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4 min-2000px:space-y-[.6vw] min-2000px:px-[.8vw] min-2000px:pb-[.8vw]">
              <p
                id="post-ai-hint"
                className="text-xs leading-relaxed text-gray-500 dark:text-white/50 min-2000px:text-[.65vw]"
              >
                {t("create_post.ai_hint")}
              </p>
              <label htmlFor="post-ai-idea" className="sr-only">
                {t("create_post.ai_idea")}
              </label>
              <textarea
                ref={inputRef}
                id="post-ai-idea"
                aria-describedby="post-ai-hint"
                disabled={isGenerating}
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.stopPropagation();
                    setIsOpen(false);
                    toggleRef.current?.focus();
                  }
                }}
                rows={3}
                minLength={10}
                maxLength={500}
                placeholder={t("create_post.ai_placeholder")}
                className="block w-full resize-none rounded-xl border border-gray-200 bg-white dark:border-white/20 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-main/50 max-768px:text-base dark:bg-[#181818] dark:text-white/80 dark:placeholder:text-white/30 min-2000px:rounded-[.5vw] min-2000px:px-[.6vw] min-2000px:py-[.6vw] min-2000px:text-[.75vw]"
              />
              <div className="flex items-center justify-between gap-3">
                <label className="group inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg text-xs font-medium text-gray-600 dark:text-white/70 min-2000px:min-h-[2.2vw] min-2000px:gap-[.5vw] min-2000px:text-[.65vw]">
                  <input
                    type="checkbox"
                    disabled={isGenerating}
                    checked={withImage}
                    onChange={(event) => setWithImage(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white transition-[background-color,border-color,box-shadow] duration-200 group-hover:border-main/60 peer-checked:border-main peer-checked:bg-main peer-focus-visible:ring-2 peer-focus-visible:ring-main/50 peer-focus-visible:ring-offset-2 dark:border-white/25 dark:bg-white/5 dark:peer-checked:border-main dark:peer-checked:bg-main dark:peer-focus-visible:ring-offset-[#181818] motion-reduce:transition-none min-2000px:size-[1vw] min-2000px:rounded-[.3vw]"
                  >
                    <motion.svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="size-3.5 text-white min-2000px:size-[.7vw]"
                      initial={false}
                      animate={{
                        scale: withImage ? 1 : 0.6,
                        opacity: withImage ? 1 : 0,
                      }}
                      transition={{ duration: reduceMotion ? 0 : 0.18 }}
                    >
                      <motion.path
                        d="M3.5 8 6.5 11 12.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={false}
                        animate={{ pathLength: withImage ? 1 : 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                      />
                    </motion.svg>
                  </span>
                  <span>{t("create_post.ai_with_image")}</span>
                </label>
                <span className="shrink-0 text-xs tabular-nums text-gray-400 min-2000px:text-[.6vw]">
                  {idea.length}/500
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={
                    idea.trim().length < 10 ||
                    idea.trim().length > 500 ||
                    isGenerating
                  }
                  onClick={handleGenerate}
                  aria-busy={isGenerating}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:focus-visible:ring-offset-[#181818] min-2000px:rounded-[.5vw] min-2000px:min-h-[2.2vw] min-2000px:gap-[.4vw] min-2000px:px-[.8vw] min-2000px:py-[.4vw] min-2000px:text-[.65vw]"
                >
                  {isGenerating ? (
                    <BiLoaderAlt
                      aria-hidden="true"
                      className="size-4 animate-spin min-2000px:size-[.8vw]"
                    />
                  ) : (
                    <IoSparklesOutline
                      aria-hidden="true"
                      className="size-4 min-2000px:size-[.8vw]"
                    />
                  )}
                  {t(
                    isGenerating
                      ? "create_post.ai_generating"
                      : "create_post.ai_generate",
                  )}
                </button>
              </div>
              {error && (
                <p
                  role="alert"
                  className="text-xs text-red-500 min-2000px:text-[.65vw]"
                >
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
