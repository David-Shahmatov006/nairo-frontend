import { $api } from "./interceptor";

export class PasswordService {
  async generateOTP(email: string) {
    try {
      const { data } = await $api.post("password-reset/generate-otp", {
        email,
      });
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
  async verifyOTP(body: { email: string; code: string }) {
    try {
      const { data } = await $api.post("password-reset/verify-otp", body);
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async resetPassword(body: {
    email: string;
    newPassword: string;
    resetToken: string;
  }) {
    try {
      const { data } = await $api.patch("password-reset/reset", body);
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
export const passwordService = new PasswordService();
