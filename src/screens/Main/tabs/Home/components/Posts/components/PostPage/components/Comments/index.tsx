import { LuSend } from "react-icons/lu";
import { Comment } from "./components/Comment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { commentsService } from "../../../../../../../../../../services/comments.service";
import { useAuthStore } from "../../../../../../../../../../stores/auth";
import useSWR, { mutate } from "swr";
import type { IComment } from "../../../../../../../../../../types/comment";
import { BiLoaderAlt } from "react-icons/bi";

export const Comments = ({ postId }: { postId: string }) => {
  const { user } = useAuthStore();
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { t } = useTranslation();
  const { data: comments, isLoading } = useSWR(["comments", postId], () =>
    commentsService.getPostComments(postId),
  );

  const handlePostComment = async () => {
    if (text.trim().length === 0) return;
    setIsPosting(true);
    try {
      await commentsService.createComment(text, postId);
      mutate(["comments", postId]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
      setText("");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full">
        <BiLoaderAlt className="text-[25px] text-main animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="max-768px:text-[20px] text-2xl font-[600] dark:text-white/70 text-gray-900">
        {t("comments")}
      </h2>
      <div className="custom-scrollbar max-768px:max-h-[270px] max-h-[40vh] overflow-y-auto flex flex-col gap-3 max-768px:mb-0 mb-5">
        {comments.length ? (
          comments.map((comment: IComment) => (
            <Comment
              postId={postId}
              key={comment.id}
              comment={comment}
              currentUserId={user?.id as string}
            />
          ))
        ) : (
          <p className="font-[500] font-manrope text-[16px] text-center text-gray-500">
            {t("post_page.left_first_comment")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Write a comment..."
          className="flex-1 dark:bg-white/5 dark:text-white/80 bg-gray-100 px-4 h-12 rounded-xl outline-none focus:ring-2 ring-main/70 duration-300"
        />
        <button
          disabled={isPosting || !text.trim().length}
          onClick={handlePostComment}
          className="flex items-center justify-center min-w-[55px] group dark:bg-white/5 bg-gray-800 h-12 font-medium text-white px-4 py-2 rounded-xl hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPosting ? (
            <BiLoaderAlt className="text-[20px] animate-spin" />
          ) : (
            <LuSend className="group-hover:translate-x-[10%] group-hover:-translate-y-[10%] text-[20px] duration-300" />
          )}
        </button>
      </div>
    </div>
  );
};
