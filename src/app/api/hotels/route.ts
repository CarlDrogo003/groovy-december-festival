import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';

// GET /api/hotels - list hotels with basic info and room counts
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hotels')
      .select(`id, name, address, description, created_at, updated_at, rooms:rooms(id, price_per_night, type)`, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hotels:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map to a lighter payload
    const hotels = (data || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      address: h.address,
      description: h.description,
      rooms_count: Array.isArray(h.rooms) ? h.rooms.length : 0,
      lowest_price: Array.isArray(h.rooms) && h.rooms.length > 0 ? Math.min(...h.rooms.map((r: any) => parseFloat(r.price_per_night))) : null,
      created_at: h.created_at,
      updated_at: h.updated_at,
    }));

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Unexpected error in /api/hotels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
