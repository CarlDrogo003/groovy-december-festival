// src/app/api/admin/vendors/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

// GET all vendors
export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vendors: data });
}

// POST create vendor
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { 
    business_name, 
    owner_name, 
    email, 
    phone, 
    package: vendorPackage,
    business_type,
    description,
    website,
    status
  } = body;

  // Validate required fields
  if (!business_name || !owner_name || !email || !vendorPackage) {
    return NextResponse.json({ error: "Business name, owner name, email, and package are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("vendors")
    .insert([{
      business_name,
      owner_name,
      email,
      phone,
      package: vendorPackage,
      business_type: business_type || 'other',
      description,
      website,
      status: status || 'pending'
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vendor: data });
}

// PATCH update vendor
export async function PATCH(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
  }

  // Add admin tracking for status changes
  if (updates.status === 'approved') {
    updates.approved_at = new Date().toISOString();
    updates.approved_by = v.user.id; // If available from auth
  }

  const { data, error } = await supabaseAdmin
    .from("vendors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vendor: data });
}

// DELETE vendor
export async function DELETE(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);
  if (!v.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("vendors")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}