import { $api } from "./interceptor";

export class PostService {
  async createPost(title: string, description: string, image: File) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    const { data } = await $api.post("/posts/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  }

  async deletePost(postId: string) {
    const { data } = await $api.delete(`/posts/${postId}`);

    return data;
  }

  async getRandomPosts() {
    const { data } = await $api.get("/posts/random");
    return data;
  }

  async getUserPosts(userId: string) {
    const { data } = await $api.get(`/posts/user/${userId}`);
    return data;
  }

  async getSavedPosts() {
    const { data } = await $api.get("/posts/saved");
    return data;
  }

  async getPostInfo(postId: string) {
    const { data } = await $api.get(`/posts/${postId}`);

    return data;
  }

  async toggleSave(postId: string) {
    const { data } = await $api.post(`/posts/${postId}/toggle-save`);
    return data;
  }

  async toggleLike(postId: string) {
    const { data } = await $api.post(`/posts/${postId}/like`);
    return data;
  }
}
export const postService = new PostService();
