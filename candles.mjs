import { getStore } from "@netlify/blobs";

const MAX_PER_IP_PER_DAY = 20; // generous: a family gathering can share one Wi-Fi
const json = (o, s = 200, extra = {}) =>
  new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store", ...extra } });

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

// Race-safe +1: write only if nobody changed the count since we read it, otherwise re-read and retry.
async function increment(store) {
  for (let i = 0; i < 12; i++) {
    const cur = await store.getWithMetadata("count", { type: "json" });
    const n = (cur?.data?.n ?? 0) + 1;
    const res = cur
      ? await store.setJSON("count", { n }, { onlyIfMatch: cur.etag })
      : await store.setJSON("count", { n }, { onlyIfNew: true });
    if (!res || res.modified !== false) return n;
    await new Promise((r) => setTimeout(r, 10 + Math.random() * 60));
  }
  const n = (await store.get("count", { type: "json" }))?.n ?? 0; // gave up: return what is stored
  return n;
}

export default async (req, context) => {
  const store = getStore({ name: "candles", consistency: "strong" });
  const read = async () => (await store.get("count", { type: "json" }))?.n ?? 0;

  // Browsers never cache it; Netlify's edge may share one answer for 5s, so many visitors cost only a few function runs.
  if (req.method === "GET") return json({ count: await read() }, 200, { "netlify-cdn-cache-control": "public, max-age=5" });

  if (req.method === "POST") {
    // per-IP daily cap. Only a hash is stored, never the address itself.
    const day = new Date().toISOString().slice(0, 10);
    const key = "ip/" + (await hash(`${context.ip}|${day}|${Netlify.env.get("SALT") || ""}`));
    const used = (await store.get(key, { type: "json" }))?.n ?? 0;
    if (used >= MAX_PER_IP_PER_DAY) return json({ count: await read(), limited: true }, 429);
    await store.setJSON(key, { n: used + 1 });
    return json({ count: await increment(store) });
  }

  // Family-only correction: PUT /api/candles with  Authorization: Bearer <ADMIN_KEY>  and body {"count":123}
  if (req.method === "PUT") {
    const admin = Netlify.env.get("ADMIN_KEY");
    if (!admin || req.headers.get("authorization") !== "Bearer " + admin) return json({ error: "unauthorized" }, 401);
    const body = await req.json().catch(() => ({}));
    const n = Math.max(0, parseInt(body.count, 10) || 0);
    await store.setJSON("count", { n });
    return json({ count: n });
  }
  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/candles" };
