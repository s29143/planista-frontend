import { z } from "zod";
import type { TFunction } from "i18next";

export const createUserSchema = (t: TFunction, tUser: TFunction) =>
   z.object({
    username: z
      .string()
      .min(2, t("validation.min", { field: tUser("username"), min: 2 }))
      .max(40, t("validation.max", { field: tUser("username"), max: 40 })),
    firstname: z
      .string()
      .min(2, t("validation.min", { field: tUser("firstname"), min: 2 }))
      .max(50, t("validation.max", { field: tUser("firstname"), max: 50 })),
    lastname: z
      .string()
      .min(2, t("validation.min", { field: tUser("firstname"), min: 2 }))
      .max(50, t("validation.max", { field: tUser("firstname"), max: 50 })),
    password: z.string()
      .min(8, t("validation.min", { field: tUser("password"), min: 8 }))
      .max(32, t("validation.max", { field: tUser("password"), max: 32 }))
      .optional(),
    repassword: z.string().optional(),
  }).refine(
      (data) => {
        if (!data.password && !data.repassword) return true;
        return data.password === data.repassword;
      },
      {
        path: ["repassword"],
        message: t("validation.passwordMatch"),
      }
    );;

export type FormValues = z.output<ReturnType<typeof createUserSchema>>;
