// src/app/api/admin/stats/detailed/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdminServer";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1] ?? null;
  const v = await verifyAdminToken(token);

  if (!v.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Get detailed analytics
    const statsPromises = [
      // Recent registrations (last 7 days)
      supabaseAdmin
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

      // Vendor status counts
      supabaseAdmin
        .from("vendors")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      supabaseAdmin
        .from("vendors")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),

      // Pageant contestant status counts
      supabaseAdmin
        .from("pageant_contestants")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      supabaseAdmin
        .from("pageant_contestants")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),

      // Tour booking status
      supabaseAdmin
        .from("tour_bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "confirmed"),

      // Popular events (events with most registrations)
      supabaseAdmin
        .from("events")
        .select(`
          id,
          title,
          current_registrations
        `)
        .order("current_registrations", { ascending: false })
        .limit(5),

      // Revenue calculation from pageant fees
      supabaseAdmin
        .from("pageant_contestants")
        .select("payment_amount")
        .eq("payment_status", "paid"),

      // Tour bookings revenue
      supabaseAdmin
        .from("tour_bookings")
        .select("total_amount")
        .eq("payment_status", "paid"),
    ];

    const [
      recentRegs,
      pendingVendors,
      approvedVendors,
      pendingContestants,
      approvedContestants,
      confirmedBookings,
      popularEvents,
      pageantRevenue,
      tourRevenue,
    ] = await Promise.all(statsPromises.map(async (p) => {
      try {
        return await p;
      } catch (err: any) {
        return { count: 0, data: [], error: err };
      }
    }));

    // Calculate total revenue
    const pageantTotal = Array.isArray(pageantRevenue.data) 
      ? pageantRevenue.data.reduce((sum, item: any) => sum + (item.payment_amount || 0), 0)
      : 0;

    const tourTotal = Array.isArray(tourRevenue.data)
      ? tourRevenue.data.reduce((sum, item: any) => sum + (item.total_amount || 0), 0)
      : 0;

    const stats = {
      recent_registrations: recentRegs.count || 0,
      pending_vendors: pendingVendors.count || 0,
      approved_vendors: approvedVendors.count || 0,
      pending_contestants: pendingContestants.count || 0,
      approved_contestants: approvedContestants.count || 0,
      confirmed_bookings: confirmedBookings.count || 0,
      total_revenue: pageantTotal + tourTotal,
      popular_events: Array.isArray(popularEvents.data) 
        ? popularEvents.data.map(event => ({
            event_name: (event as any).title || 'Unknown Event',
            registration_count: (event as any).current_registrations || 0
          }))
        : [],
    };

    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    console.error("Error fetching detailed stats:", error);
    return NextResponse.json({ error: "Failed to fetch detailed stats" }, { status: 500 });
  }
}