// companySchema.ts
import { z } from "zod";
import type { TFunction } from "i18next";

const nipRegex = /^\d{10}$/;
const postalRegex = /^\d{2}-\d{3}$/;
const phoneRegex = /^[0-9+\-\s()]{6,20}$/i;

const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

const emailOptional = z.preprocess(
  emptyToUndef,
  z.email("Niepoprawny e-mail").optional()
);

const urlOptional = z.preprocess(
  emptyToUndef,
  z.url("Niepoprawny adres URL").optional()
);

const stringOptional = z.preprocess(emptyToUndef, z.string().optional());


export const createCompanySchema = (t: TFunction, tCompany: TFunction) =>
   z.object({
    shortName: z
      .string()
      .min(2, t("validation.min", { field: tCompany("shortName"), min: 2 }))
      .max(255, t("validation.max", { field: tCompany("shortName"), max: 255 })),

    fullName: z
      .string()
      .min(5, t("validation.min", { field: tCompany("fullName"), min: 5 }))
      .max(512, t("validation.max", { field: tCompany("fullName"), max: 512 })),

    nip: z
      .preprocess(emptyToUndef, z.string().optional())
      .refine((v) => !v || nipRegex.test(v), { message: "NIP powinien zawierać 10 cyfr" }),

    postalCode: z
      .preprocess(emptyToUndef, z.string().optional())
      .refine((v) => !v || postalRegex.test(v), { message: "Kod pocztowy w formacie 00-000" }),

    street: stringOptional,
    houseNumber: stringOptional,
    apartmentNumber: stringOptional,

    phoneNumber: z
      .preprocess(emptyToUndef, z.string().optional())
      .refine((v) => !v || phoneRegex.test(v), { message: "Niepoprawny numer telefonu" }),

    email: emailOptional,
    wwwSite: urlOptional,

    comments: stringOptional,
    userId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) => (v == null || v === "undefined" ? undefined : Number(v))),

    acquiredId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) => (v == null || v === "undefined" ? undefined : Number(v))),

    districtId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) => (v == null || v === "undefined" ? undefined : Number(v))),

    countryId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) => (v == null || v === "undefined" ? undefined : Number(v))),

    statusId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) => (v == null || v === "undefined" ? undefined : Number(v))),
  });

export type FormValues = z.output<ReturnType<typeof createCompanySchema>>;
