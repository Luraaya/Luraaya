import { GoogleAuth } from "google-auth-library";

export type ComputeRequestV1 = {
  language: "de" | "en" | "fr";
  plan_tier: "base" | "premium";
  birth_date: string; // YYYY-MM-DD
  birth_time: string | null; // HH:MM oder null
  birth_place: {
    lat: number;
    lon: number;
    place_id: string;
    name: string;
    country_code: string; // ISO-2
  };
  name: string; // Vorname
};

export type ComputeResponseV1 = {
  schema_version: "v1";
  calc_version: string;
  facts_hash: string;
  has_birth_time: boolean;
  errors: Array<{ code: string; message: string }>;
  facts: unknown;
  signals: unknown[];
};

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`MISSING_ENV:${name}`);
  return v;
}

async function getIdToken(audience: string): Promise<string> {
  // Erwartet, dass ein Service Account Credential via ENV verfuegbar ist.
  // Empfehlung: GOOGLE_APPLICATION_CREDENTIALS_JSON (kompletter JSON Inhalt)
  const saJson = getRequiredEnv("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  const credentials = JSON.parse(saJson);

  const auth = new GoogleAuth({ credentials });
  const client = await auth.getIdTokenClient(audience);
  const headers = await client.getRequestHeaders();

  const authHeader = headers["Authorization"] || headers["authorization"];
  if (!authHeader) throw new Error("ID_TOKEN_MISSING_AUTH_HEADER");

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("ID_TOKEN_EMPTY");

  return token;
}

export async function callComputeV1(
  payload: ComputeRequestV1
): Promise<{ httpStatus: number; body: ComputeResponseV1 | null; rawText: string }> {
  const baseUrl = getRequiredEnv("COMPUTE_BASE_URL"); // z.B. https://<service>-<hash>.europe-west6.run.app
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

  let body: ComputeResponseV1 | null = null;
  try {
    body = rawText ? (JSON.parse(rawText) as ComputeResponseV1) : null;
  } catch {
    body = null;
  }

  return { httpStatus: resp.status, body, rawText };
}
