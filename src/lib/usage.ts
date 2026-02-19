import { env } from "./env";

type Usage = { date: string; used: number };
const mem = new Map<string, Usage>();

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function checkAndIncrementUsage(ip: string) {
  const t = todayStr();
  const cur = mem.get(ip);
  const limit = env.FREE_DAILY_LIMIT;

  if (!cur || cur.date !== t) {
    mem.set(ip, { date: t, used: 1 });
    return { ok: true, remaining: limit - 1, limit };
  }

  if (cur.used >= limit) return { ok: false, remaining: 0, limit };

  cur.used += 1;
  mem.set(ip, cur);
  return { ok: true, remaining: limit - cur.used, limit };
}
