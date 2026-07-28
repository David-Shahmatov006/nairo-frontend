import type { Chat } from "../types/chats";
import { $api } from "./interceptor";

export class ChatsService {
  async getUserChats(): Promise<Chat[]> {
    const response = await $api.get("/chats");
    return response.data;
  }

  async getMessages(chatId: string) {
    const response = await $api.get(`/chats/${chatId}/messages`);
    return response.data;
  }

  async getOrCreateChat(targetUserId: string) {
    const response = await $api.post(`/chats/user/${targetUserId}`);
    return response.data;
  }

  async findChat(targetUserId: string) {
    const { data } = await $api.get(`/chats/find/${targetUserId}`);
    return data;
  }

  async deleteChat(chatId: string) {
    return $api.delete(`/chats/${chatId}`);
  }

  async searchChat(text: string) {
    const { data } = await $api.get(`/chats/search?q=${text}`);
    return data;
  }
}

export const chatsService = new ChatsService();
