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
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }

  async getUserById(id: string) {
    const { data } = await $api.get(`/user/${id}`);
    return data;
  }

  async changeEmail(newEmail: string) {
    const { data } = await $api.patch("/user/change-email", {
      newEmail,
    });
    return data;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const { data } = await $api.patch("/user/change-password", {
      oldPassword,
      newPassword,
    });
    return data;
  }

  async changeLanguage(language: string) {
    const { data } = await $api.patch("/user/change-language", {
      language,
    });
    return data;
  }
}

export const userService = new UserService();
