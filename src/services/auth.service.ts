import { $api } from "./interceptor";

export class AuthService {
  async register(body: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }) {
    try {
      const { data } = await $api.post("/auth/register", body);
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
  async login(body: { email: string; password: string }) {
    try {
      const { data } = await $api.post("/auth/login", body);
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}
export const authService = new AuthService();
