import crypto from "crypto";
// WICHTIG: .js Endung für den ESM-Modus auf Vercel
import { getSupabaseAdmin } from "./supabaseAdmin.js";

export type OrchestrateResult = {
  processed: number;
  sent: number;
  failed: number;
};

type HoroscopeJob = {
  id: string;
  status: string | null;
  scheduled_at: string | null;
  locked_at: string | null;
  attempt_count: number | null;
  idempotency_key: string | null;
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
      error_code: null,
      error_message: null,
      locked_at: null,
      locked_by: null,
      run_id: args.runId,
      updated_at: now,
    })
    .eq("id", args.jobId);

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
    .eq("id", args.jobId);

  if (error) throw new Error(`DB_MARK_FAILED_FAILED:${error.message}`);
}

export async function orchestrate(): Promise<OrchestrateResult> {
  const supabase = getSupabaseAdmin();

  const runId = crypto.randomUUID(); 
  const now = nowIso();
  const cutoff = ttlCutoffIso();

  const { data, error } = await supabase
    .from("horoscope")
    .select("id,status,scheduled_at,locked_at,attempt_count,idempotency_key")
    .eq("status", "queued")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .lt("attempt_count", MAX_ATTEMPTS)
    .or('locked_at.is.null')
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

    const { data: updated, error: upErr } = await supabase
      .from("horoscope")
      .update({
        locked_at: now,
        locked_by: runId,
        run_id: runId,
        attempt_count: (job.attempt_count ?? 0) + 1,
        idempotency_key: desiredIdempotencyKey,
        updated_at: now,
      })
      .eq("id", job.id)
      .eq("status", "queued")
      .lt("attempt_count", MAX_ATTEMPTS)
      .or('locked_at.is.null')
      .select("id");

    if (upErr) throw new Error(`DB_LOCK_UPDATE_FAILED:${upErr.message}`);

    if (!updated || updated.length === 0) continue;

    processed += 1;
  }

  return { processed, sent: 0, failed: 0 };
}