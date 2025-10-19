import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';

export async function POST(request: NextRequest) {
  try {
    console.log('Event registration API called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { event_id, user_id, full_name, email, phone, payment_status, payment_reference } = body;

    // Validate required fields
    if (!event_id || !full_name || !email) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: event_id, full_name, email' },
        { status: 400 }
      );
    }

    console.log('Attempting to insert registration with supabaseAdmin');
    
    // Insert registration using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .insert([{
        event_id,
        user_id: user_id || null, // Allow null for anonymous users
        full_name,
        email,
        phone,
        payment_status: payment_status || 'paid',
        payment_reference: payment_reference || `FREE_${Date.now()}`
      }])
      .select()
      .single();

    if (error) {
      console.error('Event registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register for event', details: error.message },
        { status: 500 }
      );
    }

    console.log('Registration successful:', data);
    return NextResponse.json({ 
      success: true, 
      registration: data 
    });

  } catch (error) {
    console.error('Event registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}