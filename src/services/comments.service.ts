import { $api } from "./interceptor";

export class CommentsService {
  async createComment(text: string, postId: string) {
    const { data } = await $api.post("/comments", {
      postId,
      text,
    });

    return data;
  }

  async deleteComment(commentId: string) {
    const { data } = await $api.delete(`/comments/${commentId}`);
    return data;
  }

  async getPostComments(postId: string) {
    const { data } = await $api.get(`/comments/${postId}`);
    return data;
  }

  async updateComment(newText: string, commentId: string) {
    const { data } = await $api.patch(`/comments/${commentId}`, { newText });

    return data;
  }
}
export const commentsService = new CommentsService();
