import { z } from "zod";
import type { TFunction } from "i18next";

const phoneRegex = /^[0-9+\-\s()]{6,20}$/i;

const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

export const createContactSchema = (t: TFunction, tContact: TFunction) => {
  const emailOptional = z.preprocess(
    emptyToUndef,
    z.email(t("validation.invalidEmail")).optional()
  );
  return z.object({
    firstName: z
      .string()
      .min(2, t("validation.min", { field: tContact("firstName"), min: 2 }))
      .max(50, t("validation.max", { field: tContact("firstName"), max: 50 })),

    lastName: z
      .string()
      .min(2, t("validation.min", { field: tContact("lastName"), min: 2 }))
      .max(50, t("validation.max", { field: tContact("lastName"), max: 50 })),
    jobTitle: z
      .string()
      .max(255, t("validation.max", { field: tContact("lastName"), max: 255 }))
      .optional(),
    phoneNumber: z
      .preprocess(emptyToUndef, z.string().optional())
      .refine((v) => !v || phoneRegex.test(v), {
        message: tContact("errors.invalidPhone"),
      }),
    mobileNumber: z
      .preprocess(emptyToUndef, z.string().optional())
      .refine((v) => !v || phoneRegex.test(v), {
        message: tContact("errors.invalidPhone"),
      }),
    email: emailOptional,

    phoneAgreement: z.boolean().optional(),
    emailAgreement: z.boolean().optional(),
    companyId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),

    userId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),

    statusId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
  });
};
export type FormValues = z.output<ReturnType<typeof createContactSchema>>;
