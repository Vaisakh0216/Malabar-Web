import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Setup check for the live site: says which settings are present and whether the tables answer.
// Never returns key values.
function keyType(key: string | undefined) {
  if (!key) return "missing";
  if (key.startsWith("sb_secret_")) return "secret (correct)";
  if (key.startsWith("sb_publishable_")) return "publishable (wrong key: use the secret / service_role key)";
  const parts = key.split(".");
  if (parts.length === 3) {
    try {
      const role = JSON.parse(Buffer.from(parts[1], "base64url").toString()).role;
      if (role === "service_role") return "service_role (correct)";
      if (role === "anon") return "anon (wrong key: use the service_role key)";
      return `jwt with role ${role}`;
    } catch {}
  }
  return "unrecognised";
}

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const report: Record<string, unknown> = {
    supabaseUrl: url ? new URL(url).host : "missing",
    supabaseKey: keyType(key),
    adminPassword: process.env.ADMIN_PASSWORD ? "set" : "missing",
  };

  if (url && key) {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    for (const table of ["orders", "custom_requests"]) {
      const { error } = await supabase.from(table).select("id", { head: true, count: "exact" });
      report[`table ${table}`] = error ? `error: ${error.message || error.code}` : "ok";
    }
  }

  return NextResponse.json(report);
}
