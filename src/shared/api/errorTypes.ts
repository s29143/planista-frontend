export type FieldErrorDTO = { field: string; message: string; code?: string };

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: FieldErrorDTO[];
};

export type NormalizedError = {
  status: number;
  title: string;
  message: string;
  fieldErrors: Record<string, string>;
};

export function normalizeProblem(raw: any): NormalizedError {
  if (!raw || typeof raw !== "object") {
    return {
      status: 500,
      title: "Error",
      message: String(raw ?? "Unknown error"),
      fieldErrors: {},
    };
  }
  if ("status" in raw || "title" in raw || "detail" in raw || "errors" in raw) {
    const status = Number(raw.status ?? 500);
    const title = String(raw.title ?? "Error");
    const message = String(raw.detail ?? raw.message ?? "Something went wrong");
    const fieldErrors: Record<string, string> = {};
    if (typeof raw.errors === "object") {
      for (const [key, val] of Object.entries(raw.errors)) {
        if (Array.isArray(val)) {
          fieldErrors[key] = val.map((v) => String(v)).join(", ");
        } else {
          fieldErrors[key] = String(val);
        }
      }
      return { status, title, message, fieldErrors };
    }
  }

  if ("error" in raw || "message" in raw) {
    const status = Number(raw.status ?? 500);
    const title = String(raw.error ?? "Error");
    const message = String(raw.message ?? "Something went wrong");
    return { status, title, message, fieldErrors: {} };
  }

  return {
    status: 500,
    title: "Error",
    message: JSON.stringify(raw),
    fieldErrors: {},
  };
}
