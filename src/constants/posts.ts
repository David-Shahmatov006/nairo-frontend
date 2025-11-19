import type { Post } from "../types/post";

export const postsMock: Post[] = [
  {
    id: 1,
    author: "Alice Johnson",
    date: "2025.06.01 20:09",
    title: "My First Adventure",
    description:
      "Today I started exploring the Nairo platform and it's awesome!",
    image:
      "https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    author: "Bob Doe",
    date: "2025.04.27 22:03",
    title: "Hello World",
    description:
      "Just saying hi to everyone here, excited to join the community!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROHxYft1f_Ln_y_scKnh8-g5rLMmce7JKyPQ&s",
    likes: 5,
    comments: 1,
  },
  {
    id: 3,
    author: "Charlie Chaplin",
    date: "2025.11.17 09:13",
    title: "Loving Nairo Coins",
    description:
      "The new reward system is amazing, can't wait to earn more coins!",
    image: "https://via.placeholder.com/150",
    likes: 20,
    comments: 4,
  },
];