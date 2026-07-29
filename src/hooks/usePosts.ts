import useSWRInfinite from "swr/infinite";
import { useParams } from "react-router-dom";

import { postService } from "../services/post.service";
import { useAuthStore } from "../stores/auth";

const LIMIT = 10;

export type PostsMode = "all" | "saved" | "user";

export const usePosts = (mode: PostsMode | null) => {
  const { id: userIdFromUrl } = useParams();
  const userId = useAuthStore((s) => s.user?.id);

  const trueUserId = userIdFromUrl ?? userId;

  const getKey = (pageIndex: number, previousPage: any) => {
    if (!mode) return null;
    if (previousPage && !previousPage.hasMore) return null;

    return [mode, trueUserId, pageIndex + 1];
  };

  return useSWRInfinite(
    getKey,
    ([mode, userId, page]) => {
      switch (mode) {
        case "saved":
          return postService.getSavedPosts(page as number, LIMIT);

        case "user":
          return postService.getUserPosts(
            userId as string,
            page as number,
            LIMIT,
          );

        default:
          return postService.getAllPosts(page as number, LIMIT);
      }
    },
  );
};
