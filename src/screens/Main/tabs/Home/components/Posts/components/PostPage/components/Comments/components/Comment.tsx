import { useState } from "react";
import { AvatarImage } from "../../../../../../../../../../../components/AvatarImage";
import { RxTrash } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";
import type { User } from "../../../../../../../../../../../types/user";
import { Link } from "react-router-dom";
import { commentsService } from "../../../../../../../../../../../services/comments.service";
import { mutate } from "swr";
import { EditModal } from "../../../../../../../../../../../components/EditModal";
import { BiLoaderAlt } from "react-icons/bi";
import { useTranslation } from "react-i18next";
interface CommentProps {
  comment: {
    id: string;
    user: User;
    text: string;
  };
  currentUserId: string;
  postOwnerId: string;
  postId: string;
}

export const Comment = ({
  comment,
  currentUserId,
  postOwnerId,
  postId,
}: CommentProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isCommentOwner = currentUserId === comment.user.id;
  const isPostOwner = currentUserId === postOwnerId;
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;
  const { t } = useTranslation();

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
          <div className="border dark:border-white/10 border-gray-200 dark:bg-black/10 bg-[#80808006] min-2000px:p-[.5vw] p-3 max-768px:px-3 max-768px:py-2 min-2000px:rounded-[.7vw] rounded-[25px] w-full">
            <div className="flex items-center justify-between">
              <Link to={`/user/${comment.user.id}`}>
                <div className="flex items-center gap-2">
                  <div className="flex justify-center items-center min-2000px:!size-[1.5vw] !size-10">
                    <AvatarImage
                      src={comment.user.avatar}
                      iconClassName="min-2000px:!size-[1.3vw] !size-[30px]"
                    />
                  </div>
                  <span className="max-768px:text-[15px] min-2000px:text-[.6vw] dark:hover:text-main hover:text-main duration-300 font-medium dark:text-white/70 text-gray-800">
                    {comment.user.firstName} {comment.user.lastName}
                  </span>
                </div>
              </Link>

              {(canEdit || canDelete) && (
                <div className="max-768px:ml-3 flex min-2000px:gap-[.5vw] gap-2">
                  {canEdit && (
                    <button
                      className="font-[500] text-gray-500 hover:text-main duration-300 cursor-pointer"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <FiEdit3 className="min-2000px:text-[.7vw] text-[17px]" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      disabled={isDeleting}
                      className="font-[500] text-gray-500 hover:text-red-400 duration-300 cursor-pointer"
                      onClick={() => handleDelete(comment.id)}
                    >
                      {isDeleting ? (
                        <BiLoaderAlt className="min-2000px:text-[.75vw] animate-spin" />
                      ) : (
                        <RxTrash className="min-2000px:text-[.75vw] text-[20px]" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="dark:text-white/60 text-gray-700 min-2000px:mt-[.2vw] mt-1 w-full">
              <span className="block w-full break-words min-2000px:text-[.7vw]">
                {comment.text}
              </span>
            </p>
          </div>
        </div>
      </div>

      <EditModal
        type="comment"
        title={t("edit_comment")}
        targetId={comment.id}
        postId={postId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialText={comment.text}
      />
    </>
  );
};
