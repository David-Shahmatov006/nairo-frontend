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
  participants: User[]
}

export interface MessageFromServer {
  id: string;
  sender: { id: string };
  text: string;
  createdAt: string;
  editedAt?: string | null;
}

export interface IMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  editedAt?: string | null;
}
