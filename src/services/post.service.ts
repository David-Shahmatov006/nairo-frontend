import { $api } from "./interceptor";

export class PostService {
  async createPost(title: string, description: string, image: File) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);

    const { data } = await $api.post<{ newlyUnlocked?: string[] }>(
      "/posts/create",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  }

  async deletePost(postId: string) {
    const { data } = await $api.delete(`/posts/${postId}`);

    return data;
  }

  async getAllPosts(page: number = 1, limit: number = 20) {
    const { data } = await $api.get("/posts/all", {
      params: {
        page,
        limit,
      },
    });

    return data;
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    const { data } = await $api.get(`/posts/user/${userId}`, {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  async getSavedPosts(page: number = 1, limit: number = 20) {
    const { data } = await $api.get("/posts/saved", {
      params: {
        page,
        limit,
      },
    });
    return data;
  }

  async getPostInfo(postId: string) {
    const { data } = await $api.get(`/posts/${postId}`);

    return data;
  }

  async updatePost(
    postId: string,
    body: {
      title: string;
      description: string;
      imageFile?: File | null;
    },
  ) {
    const formData = new FormData();

    formData.append("title", body.title);
    formData.append("description", body.description);

    if (body.imageFile) {
      formData.append("image", body.imageFile);
    }

    const { data } = await $api.patch(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
