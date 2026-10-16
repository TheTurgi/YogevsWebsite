import { getStore } from "@netlify/blobs";

const MAX_PER_IP_PER_DAY = 20; // generous: a family gathering can share one Wi-Fi
const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

export default async (req, context) => {
  const store = getStore({ name: "candles", consistency: "strong" });
  const read = async () => (await store.get("count", { type: "json" }))?.n ?? 0;

  if (req.method === "GET") return json({ count: await read() });

  if (req.method === "POST") {
    // per-IP daily cap. Only a hash is stored, never the address itself.
    const day = new Date().toISOString().slice(0, 10);
    const key = "ip/" + (await hash(`${context.ip}|${day}|${Netlify.env.get("SALT") || ""}`));
    const used = (await store.get(key, { type: "json" }))?.n ?? 0;
    if (used >= MAX_PER_IP_PER_DAY) return json({ count: await read(), limited: true }, 429);
    await store.setJSON(key, { n: used + 1 });
    const n = (await read()) + 1;
    await store.setJSON("count", { n });
    return json({ count: n });
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
