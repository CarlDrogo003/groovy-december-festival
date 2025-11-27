import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdminServer'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { sendEmail, getRegistrationConfirmationEmail, getAdminNotificationEmail } from '@/lib/emails'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    
    // Get the user's session
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }} = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // First, create the hotel profile if it doesn't exist
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('hotel_profiles')
      .upsert({
        id: session.user.id,
        email: session.user.email,
        full_name: json.contactName || session.user.user_metadata?.full_name,
        phone: json.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json(
        { error: 'Failed to create hotel profile' },
        { status: 500 }
      )
    }

    // Then register the hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('hotels')
      .insert([{
        name: json.name,
        description: json.description,
        address: json.address,
        city: json.city,
        state: json.state,
        country: json.country,
        phone: json.phone,
        email: json.email,
        website: json.website,
        check_in_time: json.checkInTime,
        check_out_time: json.checkOutTime,
        amenities: json.amenities,
        images: json.images,
        owner_id: session.user.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (hotelError) {
      console.error('Hotel registration error:', hotelError)
      return NextResponse.json(
        { error: 'Failed to register hotel' },
        { status: 500 }
      )
    }

    // Send confirmation email to hotel owner
    try {
      if (process.env.RESEND_API_KEY) {
        await sendEmail({
          to: json.email,
          ...getRegistrationConfirmationEmail(json.name)
        })

        // Send notification to admin
        const { data: admins } = await supabaseAdmin
          .from('admins')
          .select('email')
          .eq('role', 'admin')

        if (admins) {
          for (const admin of admins) {
            await sendEmail({
              to: admin.email,
              ...getAdminNotificationEmail(json.name, hotel.id)
            })
          }
        }
      } else {
        console.log('Email notifications skipped - RESEND_API_KEY not configured')
      }
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError)
      // Continue execution - don't fail registration if emails fail
    }

    return NextResponse.json({
      message: 'Hotel registered successfully',
      hotel
    })

  } catch (err: any) {
    console.error('Hotel registration error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to register hotel' },
      { status: 500 }
    )
  }
}