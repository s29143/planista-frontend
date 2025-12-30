import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import { z } from "zod";
import { useAuthStore } from "../model/store";

const LoginDto = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});
const LoginResponse = z.object({
  accessToken: z.string(),
});

const MeResponse = z.object({
  id: z.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.string().optional(),
});

const Session = z.object({
  user: MeResponse,
  accessToken: z.string(),
});

export type Session = z.infer<typeof Session>;

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (payload: z.infer<typeof LoginDto>) => {
      const dto = LoginDto.parse(payload);

      const r1 = await http.post("/auth/login", dto, {
        withCredentials: true,
        headers: { "X-Client": "WEB" },
      });
      const { accessToken } = LoginResponse.parse(r1.data);

      useAuthStore.getState().setSession(null, accessToken);

      const r2 = await http.get("/auth/me", { withCredentials: true });
      const user = MeResponse.parse(r2.data);

      return Session.parse({ user, accessToken });
    },
    onSuccess: ({ user, accessToken }) => {
      useAuthStore.getState().setSession(user, accessToken);
      qc.setQueryData(["auth", "me"], user);
      qc.setQueryData(["auth", "session"], { user, accessToken });
    },
    onError: () => {
      useAuthStore.getState().clearSession();
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      await http.post("/auth/logout", null, {
        withCredentials: true,
        headers: { "X-Client": "WEB", "Content-Type": "application/json" },
      });
      return true;
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["auth"] });
    },
  });
}

const UserSchema = Session.shape.user;
export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const r = await http.get("/auth/me", { withCredentials: true });
      return UserSchema.parse(r.data);
    },
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}
