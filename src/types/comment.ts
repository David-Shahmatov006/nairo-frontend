import type { Post } from "./post";
import type { User } from "./user";

export interface IComment {
  id: string;
  text: string;
  post: Post;
  user: User;
}
