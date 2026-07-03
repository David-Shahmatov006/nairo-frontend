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
  online: boolean;
  messages: Message[];
  participants: User[]
}

export interface MessageFromServer {
  id: string;
  sender: { id: string };
  text: string;
  createdAt: string;
}
export interface UIMessage {
  id: string | number;
  fromMe: boolean;
  text: string;
  time: string;
}