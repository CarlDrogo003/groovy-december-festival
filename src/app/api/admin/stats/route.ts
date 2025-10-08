// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);

  if (!v.ok) {
    return NextResponse.json({ error: "unauthorized", reason: v.reason }, { status: 401 });
  }

  const counts: Record<string, number | null> = {};
  
  // Updated table names to match your database structure
  const tables = [
    "events",
    "registrations", // Changed from event_registrations
    "vendors",
    "pageant_contestants", // Changed from pageant_applications
    "tour_bookings", // Changed from diaspora_bookings
    "sponsors",
  ];

  for (const t of tables) {
    try {
      const { count, error } = await supabaseAdmin
        .from(t)
        .select("*", { count: "exact", head: true });

      counts[t] = error ? null : count;
    } catch (err) {
      // Handle case where table doesn't exist yet
      console.log(`Table ${t} does not exist yet:`, err);
      counts[t] = null;
    }
  }

  // Try raffle_entries separately (might not exist)
  try {
    const { count: raffleCount, error: raffleError } = await supabaseAdmin
      .from("raffle_entries")
      .select("*", { count: "exact", head: true });
    counts["raffle_entries"] = raffleError ? null : raffleCount;
  } catch (err) {
    counts["raffle_entries"] = null;
  }

  return NextResponse.json({ ok: true, counts });
}
