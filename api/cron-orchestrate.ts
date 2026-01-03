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

async function getIdToken(audience: string): Promise<string> {
  const saJson = getRequiredEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(saJson);

  const auth = new GoogleAuth({ credentials });

  // ID-Token direkt holen (robuster als Header-Parsing)
  const token = await auth.fetchIdToken(audience);

  if (!token) throw new Error("ID_TOKEN_EMPTY");
  return token;
}


async function callComputeV1(payload: ComputeRequestV1) {
  const baseUrl = getRequiredEnv("COMPUTE_BASE_URL");
  const url = `${baseUrl.replace(/\/$/, "")}/v1/compute`;

  const idToken = await getIdToken(baseUrl);

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  const rawText = await resp.text();
  return { httpStatus: resp.status, rawText };
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
