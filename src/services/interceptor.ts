import axios from "axios";
import { useAuthStore } from "../stores/auth";

const baseUrl = import.meta.env.VITE_API_URL;

export const $api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
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

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${baseUrl}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        useAuthStore.getState().setToken(data.accessToken);
        localStorage.setItem("token", data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return $api(originalRequest);
      } catch {
        const { logout } = useAuthStore.getState();

        logout();
        localStorage.removeItem("token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
