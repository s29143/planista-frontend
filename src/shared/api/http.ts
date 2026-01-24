import axios from "axios";
import { normalizeProblem } from "../errors/errorTypes";
import i18next from "i18next";
import { useAuthStore } from "./authStore";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  const lang = i18next.language || "en";
  config.headers["Accept-Language"] = lang;
  return config;
});

async function refreshAccessToken(): Promise<boolean> {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, null, {
      withCredentials: true,
      headers: { "X-Client": "WEB", "Content-Type": "application/json" },
    });
    return true;
  } catch {
    return false;
  }
}

let isRefreshing = false;
let refreshWaiters: Array<() => void> = [];

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;

    if (status === 401 && !original?._retry) {
      if (isRefreshing) {
        await new Promise<void>((res) => refreshWaiters.push(res));
        original._retry = true;
        return http(original);
      }

      isRefreshing = true;
      const refreshed = await refreshAccessToken();
      isRefreshing = false;
      refreshWaiters.forEach((cb) => cb());
      refreshWaiters = [];

      if (refreshed) {
        original._retry = true;
        return http(original);
      }

      useAuthStore.getState().clearSession();
    }

    if (!error.normalized) {
      if (error.response?.data) {
        error.normalized = normalizeProblem(error.response.data);
      } else if (error.request) {
        error.normalized = {
          status: 0,
          title: "Network Error",
          message: "Network error occurred. Please check your connection.",
          fieldErrors: {},
        };
      } else {
        error.normalized = {
          status: 500,
          title: "Error",
          message: error.message ?? "Unknown error",
          fieldErrors: {},
        };
      }
    }

    return Promise.reject(error);
  },
);
