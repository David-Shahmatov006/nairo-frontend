import { LuSend } from "react-icons/lu";
import { Comment } from "./components/Comment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { commentsService } from "../../../../../../../../../../services/comments.service";
import { useAuthStore } from "../../../../../../../../../../stores/auth";
import useSWR, { mutate } from "swr";
import type { IComment } from "../../../../../../../../../../types/comment";
import { BiLoaderAlt } from "react-icons/bi";

export const Comments = ({
  postId,
  postOwnerId,
}: {
  postId: string;
  postOwnerId: string;
}) => {
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
    <div className="flex flex-col min-2000px:gap-[.8vw] gap-6">
      <h2 className="max-768px:text-[20px] min-2000px:text-[.9vw] text-2xl font-[600] dark:text-white/70 text-gray-900">
        {t("comments")}
      </h2>
      <div className="custom-scrollbar max-768px:max-h-[270px] min-2000px:max-h-[20vh] max-h-[40vh] overflow-y-auto flex flex-col min-2000px:gap-[.4vw] gap-3 max-768px:mb-0 min-2000px:mb-0 mb-5">
        {comments.length ? (
          comments.map((comment: IComment) => (
            <Comment
              postId={postId}
              key={comment.id}
              comment={comment}
              currentUserId={user?.id as string}
              postOwnerId={postOwnerId}
            />
          ))
        ) : (
          <p className="font-[500] font-manrope min-2000px:text-[.75vw] text-[16px] text-center text-gray-500">
            {t("post_page.left_first_comment")}
          </p>
        )}
      </div>
      <div className="flex items-center min-2000px:gap-[.3vw] gap-3">
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          value={text}
          placeholder="Write a comment..."
          className="min-2000px:text-[.7vw] flex-1 dark:bg-white/5 dark:text-white/80 bg-gray-100 min-2000px:px-[.5vw] px-4 min-2000px:h-[1.7vw] h-12 min-2000px:rounded-[.4vw] rounded-xl outline-none focus:ring-2 ring-main/70 duration-300"
        />
        <button
          disabled={isPosting || !text.trim().length}
          onClick={handlePostComment}
          className="flex items-center justify-center min-w-[55px] group dark:bg-white/5 bg-gray-800 min-2000px:h-[1.7vw] h-12 font-medium text-white min-2000px:px-[.7vw] px-4 py-2 rounded-xl hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPosting ? (
            <BiLoaderAlt className="min-2000px:text-[.7vw] text-[20px] animate-spin" />
          ) : (
            <LuSend className="group-hover:translate-x-[10%] group-hover:-translate-y-[10%] min-2000px:text-[.7vw] text-[20px] duration-300" />
          )}
        </button>
      </div>
    </div>
  );
};
