export type Post = {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
};