import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleAuth } from "google-auth-library";

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

async function callComputeV1(payload: ComputeRequestV1) {
  const baseUrl = getRequiredEnv("COMPUTE_BASE_URL"); // z.B. https://<service>-<hash>-<region>.a.run.app
  const url = `${baseUrl.replace(/\/$/, "")}/v1/compute`;

  const saJson = getRequiredEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(saJson);

  const auth = new GoogleAuth({ credentials });
  const client = await auth.getIdTokenClient(baseUrl);

  // Wichtig: client.request() setzt Authorization selbst (kein Token-Parsing nötig)
  const resp = await (client as any).request({
    url,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload, // google-auth-library nutzt gaxios; "data" ist korrekt
    responseType: "text",
    validateStatus: () => true, // wir wollen Status/Body auch bei 4xx sehen
  });

  const httpStatus = resp?.status ?? 0;
  const rawText =
    typeof resp?.data === "string" ? resp.data : JSON.stringify(resp?.data ?? "");

  return { httpStatus, rawText };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

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
      rawTextFirst200: ping.rawText.slice(0, 200),
    },
  });
}
