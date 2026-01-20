import { z } from "zod";
import type { TFunction } from "i18next";

export const FiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
});
export type Filters = z.infer<typeof FiltersSchema>;

export const createDictItemSchema = (t: TFunction, tDictItem: TFunction) =>
  z.object({
    name: z
      .string()
      .min(2, t("validation.min", { field: tDictItem("name"), min: 2 }))
      .max(255, t("validation.max", { field: tDictItem("name"), max: 255 })),
    color: z
      .string()
      .regex(
        /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
        t("validation.color", { field: tDictItem("color") }),
      ),
  });

export type FormValues = z.output<ReturnType<typeof createDictItemSchema>>;
