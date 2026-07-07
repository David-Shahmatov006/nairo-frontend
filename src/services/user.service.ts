import { $api } from "./interceptor";

export class UserService {
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
  }) {
    const res = await $api.patch("/user/update", data);
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

  async toggleFollow(targetUserId: string) {
    const { data } = await $api.post(`/user/${targetUserId}/follow`);

    return data;
  }

  async searchUsers(query: string) {
    const { data } = await $api.get(`/user/search/${query}`);
    return data;
  }

  async checkUserFields(email: string, username: string) {
    const { data } = await $api.post("/user/check", {
      email,
      username,
    });

    return data;
  }

  async sendNairoCoins(receiverId: string, nairoCount: number) {
    const { data } = await $api.post(`/user/${receiverId}/send-nairo-coins`, {
      nairoCount,
    });

    return data;
  }
}

export const userService = new UserService();
