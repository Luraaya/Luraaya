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
  const baseUrl = getRequiredEnv("COMPUTE_BASE_URL");
  const url = `${baseUrl.replace(/\/$/, "")}/v1/compute`;

  const saJson = getRequiredEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(saJson);

  const auth = new GoogleAuth({ credentials });
  const client = await auth.getIdTokenClient(baseUrl);

  // Hier war das "git push" - jetzt entfernt:
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  try {
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
        // Korrigiert: Zugriff auf ping.rawText statt nur rawText
        rawTextFirst500: ping.rawText.slice(0, 500)
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}