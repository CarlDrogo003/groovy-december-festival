import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminServer';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let vendorData;
    
    if (contentType.includes('application/json')) {
      vendorData = await request.json();
      // Map frontend fields to vendor_registrations table columns
      vendorData = {
        business_name: vendorData.business_name,
        owner_name: vendorData.owner_name || 'N/A',
        contact_email: vendorData.email,
        contact_phone: vendorData.phone || 'N/A',
        business_type: vendorData.business_type,
        description: vendorData.business_description || vendorData.description,
        website: vendorData.website,
        payment_status: vendorData.payment_status || 'pending'
      };
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      vendorData = {
        business_name: formData.get('business_name')?.toString().trim(),
        owner_name: formData.get('owner_name')?.toString().trim(),
        contact_email: formData.get('email')?.toString().trim(),
        contact_phone: formData.get('phone')?.toString().trim(),
        business_type: formData.get('business_type')?.toString().trim(),
        // Accept both 'description' and 'business_description' from multipart forms
        description: (formData.get('description') ?? formData.get('business_description'))?.toString().trim(),
        website: formData.get('website')?.toString().trim(),
        payment_status: 'pending',
        payment_reference: formData.get('payment_reference')?.toString(),
      };
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!vendorData.business_name || !vendorData.contact_email || !vendorData.business_type) {
      return NextResponse.json(
        { error: 'Missing required fields: business_name, contact_email, business_type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendorData.contact_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const { data: existing } = await supabaseAdmin
      .from('vendor_registrations')
      .select('id, email')
      .eq('email', vendorData.contact_email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A vendor with this email already exists' },
        { status: 409 }
      );
    }

    // Insert vendor using admin client (bypasses RLS) - use vendor_registrations table
    const { data, error } = await supabaseAdmin
      .from('vendor_registrations')
      .insert([{
        business_name: vendorData.business_name,
        owner_name: vendorData.owner_name || 'N/A', // Required field
        email: vendorData.contact_email,
        phone: vendorData.contact_phone || 'N/A', // Required field
        business_type: vendorData.business_type,
        years_in_business: 'N/A', // Required field, can be updated later
        business_description: vendorData.description || 'N/A', // Required field
        products_services: 'N/A', // Required field, can be updated later
        package_type: 'starter', // Default package
        package_amount: 75000, // Default starter package amount
        payment_status: vendorData.payment_status || 'pending',
        application_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Vendor registration error:', error);
      return NextResponse.json(
        { error: 'Failed to register vendor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Vendor registration successful!',
        vendor: data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Vendor registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}