import { emptyToUndef } from "@/shared/helpers";
import type { TFunction } from "i18next";
import { z } from "zod";

export const FiltersSchema = z.object({});

export type Filters = z.infer<typeof FiltersSchema>;

export const createExecutionSchema = (t: TFunction, tExecution: TFunction) => {
  const durationSchema = z
    .object({
      hours: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tExecution("hours"),
            min: 1,
          }),
        }),
      minutes: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tExecution("minutes"),
            min: 1,
          }),
        })
        .max(59, {
          message: t("validation.max", {
            field: tExecution("minutes"),
            min: 1,
          }),
        }),
      seconds: z.coerce
        .number()
        .int()
        .min(0, {
          message: t("validation.min", {
            field: tExecution("seconds"),
            min: 1,
          }),
        })
        .max(59, {
          message: t("validation.max", {
            field: tExecution("seconds"),
            min: 1,
          }),
        }),
    })
    .refine((v) => v.hours + v.minutes + v.seconds > 0, {
      message: "validation.required",
    });
  return z.object({
    timeForm: durationSchema,
    timeInSeconds: z.number().int().min(0).optional(),
    quantity: z
      .number()
      .int()
      .min(1, {
        message: t("validation.min", {
          field: tExecution("quantity"),
          min: 1,
        }),
      }),
    processId: z
      .preprocess(emptyToUndef, z.union([z.string(), z.number()]))
      .transform((v) =>
        v == null || v === "undefined" ? undefined : Number(v)
      ),
  });
};
export type FormValues = z.output<ReturnType<typeof createExecutionSchema>>;
