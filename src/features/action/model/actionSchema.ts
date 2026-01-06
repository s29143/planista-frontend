import { emptyToUndef } from "@/shared/helpers";
import { z } from "zod";

export const createActionSchema = () => {
  return z.object({
    date: z.string().optional(),
    text: z.string().optional(),
    done: z.boolean().optional(),
    prior: z.boolean().optional(),
    reminder: z.boolean().optional(),
    userId: z
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
export type FormValues = z.output<ReturnType<typeof createActionSchema>>;
