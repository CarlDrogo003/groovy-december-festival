// src/app/api/admin/pageant/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

// GET all pageant contestants
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("pageant_contestants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, contestants: data });
}

// PATCH update contestant status
export async function PATCH(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, status, admin_notes, rejection_reason, payment_status } = body;

  if (!id) {
    return NextResponse.json({ error: "Contestant ID is required" }, { status: 400 });
  }

  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (admin_notes !== undefined) updates.admin_notes = admin_notes;
  if (rejection_reason !== undefined) updates.rejection_reason = rejection_reason;
  if (payment_status !== undefined) updates.payment_status = payment_status;

  // Add admin tracking for approvals
  if (status === 'approved') {
    updates.approved_at = new Date().toISOString();
    updates.approved_by = v.user?.id;
  }

  const { data, error } = await supabaseAdmin
    .from("pageant_contestants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, contestant: data });
}

// DELETE contestant
export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Contestant ID is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("pageant_contestants")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}