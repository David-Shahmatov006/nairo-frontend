import { useState } from "react";
import { AvatarImage } from "../../../../../../../../../../../components/AvatarImage";
import { RxTrash } from "react-icons/rx";
import { FiEdit3 } from "react-icons/fi";

interface CommentProps {
  comment: {
    id: number;
    author: string;
    authorId: number;
    text: string;
  };
  currentUserId: number;
  postAuthorId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export const Comment = ({
  comment,
  currentUserId,
  postAuthorId,
  onDelete,
  onEdit,
}: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const isOwner = currentUserId === comment.authorId;
  const isPostOwner = currentUserId === postAuthorId;

  const handleSave = () => {
    onEdit(comment.id, editedText);
    setIsEditing(false);
  };

  return (
    <div className="font-manrope ml-[1%] w-fit min-w-[30%]">
      <div className="flex gap-3">
        <div className="border border-gray-200 bg-[#80808006] p-3 rounded-[25px] w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex justify-center items-center !w-10 !h-10">
                <AvatarImage
                  src="https://via.placeholder.com/60"
                  iconClassName="!w-[30px] !h-[30px]"
                />
              </div>
              <span className="font-medium text-gray-800">
                {comment.author}
              </span>
            </div>

            {(isOwner || isPostOwner) && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    {isOwner && (
                      <button
                        className="font-[500] text-gray-500 hover:text-main duration-300 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                      >
                        <FiEdit3 className="text-[17px]" />
                      </button>
                    )}
                    <button
                      className="font-[500] text-gray-500 hover:text-red-400 duration-300 cursor-pointer"
                      onClick={() => onDelete(comment.id)}
                    >
                      <RxTrash className="text-[20px]" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSave}
                    className="text-main font-semibold text-[14px] hover:opacity-70 duration-300 cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-700 mt-1">
            {isEditing ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={handleSave}
                className="w-full px-2 py-1 outline-none"
              />
            ) : (
              comment.text
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
