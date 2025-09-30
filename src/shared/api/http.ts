import axios from "axios";
import { useAuthStore } from "@/features/auth/model/store";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  config.headers = config.headers ?? {};
  if (token) 
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshWaiters: Array<(t: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  try {
    const r = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      null,
      { withCredentials: true, headers: { "X-Client": "WEB", "Content-Type" : 'application/json' } }
    );
    const token = r.data?.accessToken as string | undefined;
    return token ?? null;
  } catch {
    return null;
  }
}

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;
    if (status === 401 && !original?._retry) {
      if (isRefreshing) {
        const token = await new Promise<string | null>((res) => refreshWaiters.push(res));
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          original._retry = true;
          return http(original);
        }
        useAuthStore.getState().clearSession();
        throw error;
      }

      isRefreshing = true;
      const token = await refreshAccessToken();
      isRefreshing = false;
      refreshWaiters.forEach((cb) => cb(token));
      refreshWaiters = [];

      if (token) {
        useAuthStore.getState().setSession(
          useAuthStore.getState().user,
          token
        );
        original.headers.Authorization = `Bearer ${token}`;
        original._retry = true;
        return http(original);
      } else {
        useAuthStore.getState().clearSession();
      }
    }
    return Promise.reject(error);
  }
);
