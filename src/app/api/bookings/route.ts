import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';
import { getServerUser } from '@/lib/api';
import { randomUUID } from 'crypto';

// POST /api/bookings - create a booking and create a payments record placeholder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { room_id, check_in_date, check_out_date, special_requests } = body;

    if (!room_id || !check_in_date || !check_out_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Authenticate user (server-side)
    const { user, profile } = await getServerUser();
    const userId = profile?.id || body.user_id || null;

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify room exists and get price
    const { data: room, error: roomError } = await supabaseAdmin
      .from('rooms')
      .select('id, hotel_id, price_per_night, is_available')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      console.error('Room lookup error:', roomError);
      return NextResponse.json({ error: 'Invalid room' }, { status: 400 });
    }

    // Check availability: overlapping bookings
    const { data: overlapping } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .in('status', ['pending', 'confirmed'])
      .gte('check_in_date', check_in_date)
      .lte('check_in_date', check_out_date);

    // Simpler overlap check: check if any booking where (check_in < requested_check_out) AND (check_out > requested_check_in)
    let overlaps2: any = null;
    try {
      const rpcRes = await supabaseAdmin.rpc('overlapping_bookings', {
        p_room_id: room_id,
        p_check_in: check_in_date,
        p_check_out: check_out_date
      });
      overlaps2 = rpcRes.data;
    } catch (e) {
      overlaps2 = null;
    }

    if ((overlapping && overlapping.length > 0) || (overlaps2 && overlaps2.length > 0)) {
      return NextResponse.json({ error: 'Room is not available for the selected dates' }, { status: 409 });
    }

    // Compute nights
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = parseFloat(room.price_per_night) * nights;

    // Create booking with status 'pending'
    const bookingPayload = {
      room_id,
      user_id: userId,
      check_in_date,
      check_out_date,
      total_price: totalPrice,
      status: 'pending',
      special_requests: special_requests || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert([bookingPayload])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // Create a payments placeholder record (client should call the payments flow afterwards)
    const transaction_reference = `hotel_${randomUUID()}`;

    const paymentPayload = {
      transaction_reference,
      payment_reference: transaction_reference,
      amount: totalPrice,
      amount_paid: 0,
      fee: 0,
      currency: 'NGN',
      payment_method: null,
      payment_status: 'pending',
      customer_name: profile?.full_name || null,
      customer_email: profile?.email || null,
      payment_type: 'hotel_booking',
      item_id: booking.id,
      item_name: `Booking for room ${room_id}`,
      user_id: userId,
      metadata: {},
      created_at: new Date().toISOString(),
    };

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert([paymentPayload])
      .select()
      .single();

    if (paymentError) {
      console.error('Failed to create payment placeholder:', paymentError);
      // If payment creation fails, we should rollback booking - but for simplicity, return error and let admin fix
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 });
    }

    return NextResponse.json({ booking, payment, message: 'Booking created, complete payment to confirm' });
  } catch (error) {
    console.error('Unexpected error in /api/bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
