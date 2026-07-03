import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const SOCKET_URL = `${API_URL}/chats`;

const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const socket: Socket = io(SOCKET_URL, {
  auth: {
    token: getAuthToken(),
  },
  transports: ["websocket"],
});
