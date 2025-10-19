import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let contestantData;
    
    if (contentType.includes('application/json')) {
      contestantData = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      contestantData = {
        full_name: formData.get('full_name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        age: Number(formData.get('age')),
        bio: formData.get('bio')?.toString().trim(),
        payment_status: 'pending',
        payment_reference: formData.get('payment_reference')?.toString(),
        headshot_url: formData.get('headshot_url')?.toString(),
        full_body_url: formData.get('full_body_url')?.toString(),
      };
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!contestantData.full_name || !contestantData.email || !contestantData.age || !contestantData.bio) {
      return NextResponse.json(
        { error: 'Missing required fields: full_name, email, age, bio' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contestantData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate age
    if (contestantData.age < 18 || contestantData.age > 35) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 35' },
        { status: 400 }
      );
    }

    // Check if contestant already exists
    const { data: existing } = await supabaseAdmin
      .from('pageant_contestants')
      .select('id, email')
      .eq('email', contestantData.email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A contestant with this email already exists' },
        { status: 409 }
      );
    }

    // Insert contestant using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('pageant_contestants')
      .insert([{
        full_name: contestantData.full_name,
        email: contestantData.email,
        phone: contestantData.phone || null,
        age: contestantData.age,
        bio: contestantData.bio,
        headshot_url: contestantData.headshot_url || null,
        full_body_url: contestantData.full_body_url || null,
        payment_status: contestantData.payment_status || 'pending',
        payment_reference: contestantData.payment_reference || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Pageant registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register contestant', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pageant registration successful!',
        contestant: data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Pageant registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}