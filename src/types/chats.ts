import type { User } from "./user";

export interface Message {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  messages: Message[];
  participants: User[];
  unreadCount: number;
}

export interface IMessage {
  id: string;
  sender: User;
  type: "text" | "voice";
  text: string | null;
  chatId: string;
  createdAt: string;
  editedAt?: string | null;
  audioUrl?: string | null;
  durationMs?: number | null;
  waveform?: number[] | null;
}
