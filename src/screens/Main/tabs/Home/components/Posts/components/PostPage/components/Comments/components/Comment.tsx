import { useState } from "react";
import { AvatarImage } from "../../../../../../../../../../../components/AvatarImage";
import { RxTrash } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import type { User } from "../../../../../../../../../../../types/user";
import { Link } from "react-router-dom";
import { commentsService } from "../../../../../../../../../../../services/comments.service";
import { mutate } from "swr";
import { EditCommentModal } from "./EditCommentModal";
import { BiLoaderAlt } from "react-icons/bi";
import type { Post } from "../../../../../../../../../../../types/post";
interface CommentProps {
  comment: {
    id: string;
    user: User;
    text: string;
    post: Post;
  };
  currentUserId: string;
  postId: string;
}

export const Comment = ({ comment, currentUserId, postId }: CommentProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isCommentOwner = currentUserId === comment.user.id;
  const isPostOwner = currentUserId === comment.post.user.id;
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;

  const handleDelete = async (commentId: string) => {
    setIsDeleting(true);
    try {
      await commentsService.deleteComment(commentId);
      mutate(["comments", postId]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="font-manrope ml-[1%] w-fit min-w-[40%]">
        <div className="flex gap-3">
          <div className="border dark:border-white/10 border-gray-200 dark:bg-black/10 bg-[#80808006] p-3 max-768px:px-3 max-768px:py-2 rounded-[25px] w-full">
            <div className="flex items-center justify-between">
              <Link to={`/user/${comment.user.id}`}>
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center !w-10 !h-10">
                    <AvatarImage
                      src={comment.user.avatar}
                      iconClassName="!w-[30px] !h-[30px]"
                    />
                  </div>
                  <span className="max-768px:text-[15px] dark:hover:text-main hover:text-main duration-300 font-medium dark:text-white/70 text-gray-800">
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                </div>
              </Link>

              {(canEdit || canDelete) && (
                <div className="max-768px:ml-3 flex gap-2">
                  {canEdit && (
                    <button
                      className="font-[500] text-gray-500 hover:text-main duration-300 cursor-pointer"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <FiEdit3 className="text-[17px]" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      disabled={isDeleting}
                      className="font-[500] text-gray-500 hover:text-red-400 duration-300 cursor-pointer"
                      onClick={() => handleDelete(comment.id)}
                    >
                      {isDeleting ? (
                        <BiLoaderAlt className="animate-spin" />
                      ) : (
                        <RxTrash className="text-[20px]" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="dark:text-white/60 text-gray-700 mt-1 w-full">
              <span className="block w-full break-words">{comment.text}</span>
            </p>
          </div>
        </div>
      </div>

      <EditCommentModal
        commentId={comment.id}
        postId={postId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialText={comment.text}
      />
    </>
  );
};
