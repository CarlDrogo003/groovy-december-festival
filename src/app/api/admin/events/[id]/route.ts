// src/app/api/admin/events/[id]/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from("events")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, event: data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("events").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
