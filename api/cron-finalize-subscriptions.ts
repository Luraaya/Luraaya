import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optionaler Schutz (empfohlen)
  if (process.env.CRON_SECRET) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }

  try {
    const { data, error } = await supabase.rpc("finalize_expired_subscriptions");
    if (error) {
      console.error("finalize_expired_subscriptions failed:", error);
      return res.status(500).json({ error: "db error" });
    }

    return res.status(200).json({ finalized: data });
  } catch (e: any) {
    console.error("cron exception:", e?.message || e);
    return res.status(500).json({ error: "exception" });
  }
}
