import { http } from "./http";

export type RawDictItem = { id: number; name: string };
export type Option = { value: string; label: string };

export async function fetchOptions(
  url: string,
  q?: string,
  mapItem: (i: any) => Option = (i: RawDictItem) => ({ value: String(i.id), label: i.name })
): Promise<Option[]> {
  const withQuery = q?.trim() ? `${url}?q=${encodeURIComponent(q.trim())}` : url;
  const res = await http.get(withQuery, {params: {
    'page': 0, 'size': 0
  }});
  if (res.status !== 200) return [];
  const data = await res.data['_embedded']?.[Object.keys(res.data['_embedded'])[0]];
  return (Array.isArray(data) ? data : []).map(mapItem);
}
