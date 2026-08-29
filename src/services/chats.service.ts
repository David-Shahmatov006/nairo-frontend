import type { Chat, IMessage } from "../types/chats";
import { $api } from "./interceptor";

const audioExtension = (mimeType: string) => {
  const mime = mimeType.split(";")[0];

  if (mime.includes("mp4") || mime.includes("m4a")) {
    return "mp4";
  }

  if (mime.includes("ogg") || mime.includes("opus")) {
    return "ogg";
  }

  if (mime.includes("mpeg") || mime.includes("mp3")) {
    return "mp3";
  }

  if (mime.includes("wav")) {
    return "wav";
  }

  return "webm";
};

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

  async sendVoiceMessage(params: {
    chatId: string | null;
    receiverId: string;
    blob: Blob;
    durationMs: number;
    waveform: number[];
    onUploadProgress?: (percent: number) => void;
  }): Promise<IMessage> {
    const formData = new FormData();
    const extension = audioExtension(params.blob.type);

    formData.append("audio", params.blob, `voice.${extension}`);
    formData.append("receiverId", params.receiverId);
    formData.append("durationMs", String(params.durationMs));
    formData.append("waveform", JSON.stringify(params.waveform));

    if (params.chatId) {
      formData.append("chatId", params.chatId);
    }

    const { data } = await $api.post<IMessage>("/chats/voice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!params.onUploadProgress || !event.total) {
          return;
        }

        params.onUploadProgress(Math.round((event.loaded / event.total) * 100));
      },
    });

    return data;
  }
}

export const chatsService = new ChatsService();
