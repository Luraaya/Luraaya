import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleAuth } from "google-auth-library";
import { orchestrate } from "./_lib/orchestrate.js";

type ComputeRequestV1 = {
  language: "de" | "en" | "fr";
  plan_tier: "base" | "premium";
  birth_date: string;
  birth_time: string | null;
  birth_place: {
    lat: number;
    lon: number;
    place_id: string;
    name: string;
    country_code: string;
  };
  name: string;
};

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`MISSING_ENV:${name}`);
  return v;
}

/**
 * Hilfsfunktion für den Compute-Aufruf.
 * Wird intern von orchestrate() oder anderen Logiken genutzt.
 */
async function callComputeV1(payload: ComputeRequestV1) {
  const baseUrl = getRequiredEnv("COMPUTE_BASE_URL");
  const url = `${baseUrl.replace(/\/$/, "")}/v1/compute`;

  const saJson = getRequiredEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(saJson);

  const auth = new GoogleAuth({ credentials });
  const client = await auth.getIdTokenClient(baseUrl);

  const resp = await (client as any).request({
    url,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload,
    responseType: "text",
    validateStatus: () => true,
  });

  const httpStatus = resp?.status ?? 0;
  const rawText =
    typeof resp?.data === "string" ? resp.data : JSON.stringify(resp?.data ?? "");

  return { httpStatus, rawText };
}

/**
 * Main Handler für den Cron-Job / Orchestrator
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {

  // Nur GET-Requests erlauben (typisch für Cron-Jobs)
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  try {
    // START: Produktiv-Logik
    // Ruft die orchestrate-Funktion auf, die User-Daten lädt und Berechnungen triggert
    const result = await orchestrate();
    
    return res.status(200).json({ 
      status: "ok", 
      result 
    });
    // ENDE: Produktiv-Logik

  } catch (err: any) {
    // Fehler-Reporting, falls die Orchestrierung fehlschlägt
    console.error("Orchestration Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}
