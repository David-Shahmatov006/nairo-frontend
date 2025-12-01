import { $api } from "./interceptor";

export class UserService {
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
  }) {
    const res = await $api.post("/user/update", data);
    return res.data;
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await $api.post("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data;
  }
}

export const userService = new UserService();
