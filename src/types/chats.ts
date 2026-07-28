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
  text: string;
  chatId: string;
  createdAt: string;
  editedAt?: string | null;
}
