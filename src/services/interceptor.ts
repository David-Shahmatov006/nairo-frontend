import axios from "axios";
import { useAuthStore } from "../stores/auth";

const baseUrl = import.meta.env.VITE_API_URL;

export const $api = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
});

$api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const { logout } = useAuthStore.getState();

      logout();

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
