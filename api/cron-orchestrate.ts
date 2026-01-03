import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callComputeV1 } from "./_lib/computeClient.js";
import { orchestrate } from "./_lib/orchestrate";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Method-Guard: Cron wird typischerweise per GET aufgerufen
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  // Optionaler Guard: Cron-Secret (derzeit deaktiviert)
  // const secret = req.headers["x-cron-secret"];
  // if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
  //   return res.status(401).json({ error: "UNAUTHORIZED" });
  // }

  // --- Schritt 18: IAM Smoke-Test (bewusst vorzeitig return) ---
  const ping = await callComputeV1({
    language: "de",
    plan_tier: "base",
    birth_date: "2000-01-01",
    birth_time: null,
    birth_place: {
      lat: 47.3769,
      lon: 8.5417,
      place_id: "smoke",
      name: "Zuerich",
      country_code: "CH",
    },
    name: "Test",
  });

  return res.status(200).json({
    status: "ok",
    smoke: {
      httpStatus: ping.httpStatus,
      bodyParsed: Boolean(ping.body),
      rawTextFirst200: ping.rawText.slice(0, 200),
    },
  });

  // --- Produktiv-Orchestrator (nach Smoke-Test wieder aktivieren) ---
  // const result = await orchestrate();
  // return res.status(200).json({ status: "ok", result });
}
