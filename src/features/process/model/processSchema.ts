import { emptyToUndef } from "@/shared/helpers";
import type { TFunction } from "i18next";
import { z } from "zod";

export const createProcessSchema = (t: TFunction, tProcess: TFunction) => {
  const durationSchema = z
    .object({
      hours: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tProcess("hours"),
            min: 1,
          }),
        }),
      minutes: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tProcess("minutes"),
            min: 1,
          }),
        })
        .max(59, {
          message: t("validation.max", {
            field: tProcess("minutes"),
            min: 1,
          }),
        }),
      seconds: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tProcess("seconds"),
            min: 1,
          }),
        })
        .max(59, {
          message: t("validation.max", {
            field: tProcess("seconds"),
            min: 1,
          }),
        }),
    })
    .refine((v) => v.hours + v.minutes + v.seconds > 0, {
      message: "validation.required",
    });
  return z.object({
    plannedTimeForm: durationSchema,
    plannedTimeSeconds: z.number().int().min(0),
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
