import crypto from "crypto";
import { GoogleAuth } from "google-auth-library";
// WICHTIG: .js Endung für den ESM-Modus auf Vercel
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type OrchestrateResult = {
  processed: number;
  sent: number;
  failed: number;
};

type HoroscopeJob = {
  id: string;
  user_id: string | null;
  status: string | null;
  scheduled_at: string | null;
  locked_at: string | null;
  locked_by: string | null;
  attempt_count: number | null;
  idempotency_key: string | null;
  language: string | null;
  plan_tier: string | null;
  schema_version: string | null;
  facts_hash: string | null;
  calc_version: string | null;
};

type UserRow = {
  id: string;
  first_name: string | null;
  fullname: string | null;
  dateOfBirth: string | null; // Supabase liefert date meist als string
  birth_time: string | null;  // time ohne tz kommt i. d. R. als string "HH:MM:SS"
  birth_time_is_unknown: boolean | null;
  birth_place_lat: number | null;
  birth_place_lon: number | null;
  birth_place_provider_id: string | null;
  birth_place_display_name: string | null;
  birth_place_country_code: string | null;
};


const LOCK_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

function nowIso(): string {
  return new Date().toISOString();
}

function ttlCutoffIso(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - LOCK_TTL_MINUTES);
  return d.toISOString();
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function buildIdempotencyKey(jobId: string, scheduledAtIso: string): string {
  return sha256Hex(`${jobId}|${scheduledAtIso}`);
}

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

async function callComputeV1(payload: ComputeRequestV1): Promise<{ httpStatus: number; rawText: string }> {
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

async function persistComputeResult(args: {
  jobId: string;
  runId: string;
  schemaVersion: string;
  calcVersion: string;
  factsHash: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("horoscope")
    .update({
      schema_version: args.schemaVersion,
      calc_version: args.calcVersion,
      facts_hash: args.factsHash,
      error_code: null,
      error_message: null,
      locked_at: null,
      locked_by: null,
      run_id: args.runId,
      updated_at: now,
    })
    .match({ id: args.jobId });

  if (error) throw new Error(`DB_PERSIST_COMPUTE_FAILED:${error.message}`);
}

function normalizeBirthTime(t: string | null): string | null {
  if (!t) return null;
  // erwartet HH:MM oder HH:MM:SS -> wir nehmen HH:MM
  if (t.length >= 5) return t.slice(0, 5);
  return null;
}


async function markSent(args: {
  jobId: string;
  runId: string;
  providerMessageId: string;
  content: string;
  promptVersion: string;
  factsHash: string;
  calcVersion: string;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("horoscope")
    .update({
      status: "sent",
      sentat: now,
      failed_at: null,
      provider_message_id: args.providerMessageId,
      content: args.content,
      prompt_version: args.promptVersion,
      facts_hash: args.factsHash,
      schema_version: "v1",
      calc_version: args.calcVersion,
      error_code: null,
      error_message: null,
      locked_at: null,
      locked_by: null,
      run_id: args.runId,
      updated_at: now,
    })
    .match({ id: args.jobId }); // Sicherer als .eq

  if (error) throw new Error(`DB_MARK_SENT_FAILED:${error.message}`);
}

async function markFailed(args: {
  jobId: string;
  runId: string;
  errorCode: string;
  errorMessage: string;
  errorStep: "compute" | "select" | "llm" | "send" | "orchestrate";
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const safeMessage = args.errorMessage.slice(0, 500);

  const { error } = await supabase
    .from("horoscope")
    .update({
      status: "failed",
      failed_at: now,
      error_code: args.errorCode,
      error_message: `${args.errorStep}:${safeMessage}`,
      locked_at: null,
      locked_by: null,
      run_id: args.runId,
      updated_at: now,
    })
    .match({ id: args.jobId });

  if (error) throw new Error(`DB_MARK_FAILED_FAILED:${error.message}`);
}

export async function orchestrate(): Promise<OrchestrateResult> {
  const supabase = getSupabaseAdmin();

  const runId = crypto.randomUUID(); 
  const now = nowIso();
  const cutoff = ttlCutoffIso();

  // 1. Suche nach Jobs: Entweder locked_at ist NULL oder der Lock ist älter als 15 Min
  const { data, error } = await supabase
    .from("horoscope")
    .select("id,user_id,status,scheduled_at,locked_at,locked_by,attempt_count,idempotency_key,language,plan_tier,schema_version,facts_hash,calc_version")
    .eq("status", "queued")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .lt("attempt_count", MAX_ATTEMPTS)
    .or(`locked_at.is.null,locked_at.lte.${cutoff}`)
    .order("scheduled_at", { ascending: true })
    .limit(25);

  if (error) throw new Error(`DB_SELECT_FAILED:${error.message}`);

  const candidates = (data ?? []) as HoroscopeJob[];
  let processed = 0;

  for (const job of candidates) {
    const scheduledAt = job.scheduled_at;
    if (!scheduledAt) continue;

    const desiredIdempotencyKey =
      job.idempotency_key ?? buildIdempotencyKey(job.id, scheduledAt);


    // 2. Lock setzen atomar ohne .or() im Update:
    // Versuch A: locked_at IS NULL
    let updated: any[] | null = null;

    {
    const { data: u1, error: e1 } = await supabase
        .from("horoscope")
        .update({
        locked_at: now,
        locked_by: runId,
        run_id: runId,
        attempt_count: (job.attempt_count ?? 0) + 1,
        idempotency_key: desiredIdempotencyKey,
        updated_at: now,
        })
        .match({ id: job.id, status: "queued" })
        .is("locked_at", null)
        .filter("attempt_count", "lt", MAX_ATTEMPTS)
        .select("id");

    if (e1) throw new Error(`DB_LOCK_UPDATE_FAILED:${e1.message}`);
    updated = (u1 as any[]) ?? null;
    }

    if (!updated || updated.length === 0) {
    // Versuch B: locked_at <= cutoff
    const { data: u2, error: e2 } = await supabase
        .from("horoscope")
        .update({
        locked_at: now,
        locked_by: runId,
        run_id: runId,
        attempt_count: (job.attempt_count ?? 0) + 1,
        idempotency_key: desiredIdempotencyKey,
        updated_at: now,
        })
        .match({ id: job.id, status: "queued" })
        .lte("locked_at", cutoff)
        .filter("attempt_count", "lt", MAX_ATTEMPTS)
        .select("id");

    if (e2) throw new Error(`DB_LOCK_UPDATE_FAILED:${e2.message}`);
    updated = (u2 as any[]) ?? null;
    }

    if (!updated || updated.length === 0) continue;

    processed += 1;

    try {
    const alreadyComputed =
        Boolean(job.facts_hash) && Boolean(job.calc_version) && Boolean(job.schema_version);

    if (alreadyComputed) {
        await persistComputeResult({
        jobId: job.id,
        runId,
        schemaVersion: job.schema_version as string,
        calcVersion: job.calc_version as string,
        factsHash: job.facts_hash as string,
        });
    } else {
    const language = job.language;
    const planTier = job.plan_tier;
    const userId = job.user_id;

    if (!userId) throw new Error("INVALID_JOB:user_id missing");
    if (language !== "de" && language !== "en" && language !== "fr") throw new Error("INVALID_JOB:language invalid");
    if (planTier !== "base" && planTier !== "premium") throw new Error("INVALID_JOB:plan_tier invalid");

    const { data: u, error: ue } = await supabase
        .from("users")
        .select("id,first_name,fullname,dateOfBirth,birth_time,birth_time_is_unknown,birth_place_lat,birth_place_lon,birth_place_provider_id,birth_place_display_name,birth_place_country_code")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

    if (ue) throw new Error(`DB_USER_SELECT_FAILED:${ue.message}`);

    const user = (u ?? null) as UserRow | null;
    if (!user) throw new Error("USER_NOT_FOUND:no user row");

    const name = user.first_name ?? user.fullname ?? null;
    const birthDate = user.dateOfBirth ?? null;

    const birthTime =
        user.birth_time_is_unknown ? null : normalizeBirthTime(user.birth_time ?? null);

    const lat = user.birth_place_lat;
    const lon = user.birth_place_lon;
    const placeId = user.birth_place_provider_id;
    const placeName = user.birth_place_display_name;
    const countryCode = user.birth_place_country_code;

    if (!name || !birthDate || lat == null || lon == null || !placeId || !placeName || !countryCode) {
        throw new Error("INVALID_USER_DATA:missing name/birth_date/birth_place fields");
    }

    const payload: ComputeRequestV1 = {
        language,
        plan_tier: planTier,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_place: {
        lat,
        lon,
        place_id: placeId,
        name: placeName,
        country_code: countryCode,
        },
        name,
    };

    const compute = await callComputeV1(payload);

    if (compute.httpStatus !== 200) {
        throw new Error(`COMPUTE_HTTP_ERROR:status=${compute.httpStatus} body=${compute.rawText.slice(0, 200)}`);
    }

    let parsed: any = null;
    try {
        parsed = JSON.parse(compute.rawText);
    } catch {
        throw new Error(`COMPUTE_BAD_JSON:${compute.rawText.slice(0, 200)}`);
    }

    const schemaVersion = parsed?.schema_version;
    const calcVersion = parsed?.calc_version;
    const factsHash = parsed?.facts_hash;

    if (schemaVersion !== "v1" || typeof calcVersion !== "string" || typeof factsHash !== "string") {
        throw new Error("COMPUTE_BAD_RESPONSE:missing/invalid schema_version|calc_version|facts_hash");
    }

    await persistComputeResult({
        jobId: job.id,
        runId,
        schemaVersion,
        calcVersion,
        factsHash,
    });
    await markSent({
        jobId: job.id,
        runId,
        providerMessageId: "DUMMY",
        content: "<DUMMY_CONTENT>",
        promptVersion: "1.0.0",
        factsHash,
        calcVersion,
        });

    }


    } catch (err: any) {
    try {
        await markFailed({
        jobId: job.id,
        runId,
        errorCode: "COMPUTE_STAGE_ERROR",
        errorMessage: err?.message ?? "unknown",
        errorStep: "compute",
        });
    } catch (e: any) {
        // Fallback: Lock lösen, damit nichts hängen bleibt
        await supabase
        .from("horoscope")
        .update({ locked_at: null, locked_by: null, updated_at: new Date().toISOString() })
        .match({ id: job.id });
    }

    break; // Variante 1: 1 Job pro Run



   

    // Hier würde normalerweise die weitere Verarbeitung (Compute/LLM) folgen.
    // Für diesen Test stoppen wir beim erfolgreichen Locking.
  }

  return { processed, sent: 0, failed: 0 };
}