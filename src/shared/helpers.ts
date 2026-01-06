type DurationParts = {
  hours: number;
  minutes: number;
  seconds: number;
};
export function durationToSeconds(d: DurationParts): number {
  return d.hours * 3600 + d.minutes * 60 + d.seconds;
}

export function secondsToDurationParts(totalSeconds: number): DurationParts {
  const safe = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return { hours, minutes, seconds };
}

export const s = (v: unknown) => (v == null ? "" : String(v));

export const idOrUndef = (v: unknown) => (v == null ? undefined : Number(v));

export const emptyToUndef = (v: unknown) =>
  typeof v === "string" ? (v.trim() === "" ? undefined : v.trim()) : v;

export type SortDir = "asc" | "desc";
