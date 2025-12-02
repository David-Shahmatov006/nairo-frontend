import type { User } from "./user";

export type Post = {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  liked?: boolean;
  isSaved?: boolean;
  user: User,
  createdAt: string
};