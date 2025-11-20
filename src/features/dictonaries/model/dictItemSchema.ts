import { z } from "zod";
import type { TFunction } from "i18next";

export const createDictItemSchema = (t: TFunction, tDictItem: TFunction) =>
   z.object({
    name: z
      .string()
      .min(2, t("validation.min", { field: tDictItem("name"), min: 2 }))
      .max(255, t("validation.max", { field: tDictItem("name"), max: 255 })),
  });

export type FormValues = z.output<ReturnType<typeof createDictItemSchema>>;
