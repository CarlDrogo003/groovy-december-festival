// src/app/api/admin/events/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

// GET all events
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("events").select("*").order("date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, events: data });
}

// POST create event
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, description, date, venue, banner_image, max_capacity, registration_fee, status } = body;

  // Validate required fields
  if (!title || !date || !venue) {
    return NextResponse.json({ error: "Title, date, and venue are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("events").insert([
    { 
      title, 
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'), 
      description, 
      date, 
      venue, 
      banner_image,
      max_capacity,
      registration_fee,
      status: status || 'published',
      current_registrations: 0
    },
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, event: data });
}
