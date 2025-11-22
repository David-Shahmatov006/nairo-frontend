import { LuSend } from "react-icons/lu";
import { Comment } from "./components/Comment";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const mockComments = [
  {
    id: 1,
    author: "Emily",
    authorId: 1,
    text: "Very nice post! Nairo is so cool platform!!!",
  },
  { id: 2, author: "John", authorId: 2, text: "I agree!" },
  { id: 3, author: "Alice", authorId: 3, text: "Thanks for sharing." },
];

export const Comments = () => {
  const [comments, setComments] = useState(mockComments);
  const currentUserId = 1;
  const { t } = useTranslation();

  const handleDelete = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (id: number, newText: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-[600] text-gray-900">{t("comments")}</h2>
      <div className="custom-scrollbar max-h-[40vh] overflow-y-auto flex flex-col gap-3 mb-5">
        {comments.map((comment) => (
          <Comment
            postAuthorId={1}
            key={comment.id}
            comment={comment}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 px-4 h-12 rounded-xl outline-none focus:ring-2 ring-main/40 duration-300"
        />
        <button className="group bg-gray-800 h-12 font-medium text-white px-4 py-2 rounded-xl hover:ring-2 ring-main/70 duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
          <LuSend className="group-hover:translate-x-[10%] group-hover:-translate-y-[10%] text-[20px] duration-300" />
        </button>
      </div>
    </div>
  );
};
