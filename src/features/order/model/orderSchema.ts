import type { TFunction } from "i18next";
import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

export const createOrderSchema = (t: TFunction, tOrder: TFunction) => {
  return z.object({
    product: z.string().min(2, {
      message: t("validation.minLength", {
        field: tOrder("product"),
        min: 2,
      }),
    }),
    quantity: z
      .number()
      .int()
      .min(1, {
        message: t("validation.min", {
          field: tOrder("quantity"),
          min: 1,
        }),
      }),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    statusId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .optional()
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    companyId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    contactId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .optional()
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    typeId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
  });
};
export type FormValues = z.output<ReturnType<typeof createOrderSchema>>;
