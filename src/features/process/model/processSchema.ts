import type { TFunction } from "i18next";
import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

export const createProcessSchema = (t: TFunction, tProcess: TFunction) => {
  return z.object({
    plannedTime: z.string().optional(),
    quantity: z
      .number()
      .int()
      .min(1, {
        message: t("validation.min", {
          field: tProcess("quantity"),
          min: 1,
        }),
      }),
    statusId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .optional()
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    technologyId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    orderId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
    workstationId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]).optional())
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
  });
};
export type FormValues = z.output<ReturnType<typeof createProcessSchema>>;
