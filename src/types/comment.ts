import type { User } from "./user";

export interface IComment {
  id: string;
  text: string;
  user: User;
}
