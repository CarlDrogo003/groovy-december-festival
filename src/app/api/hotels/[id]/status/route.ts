import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { sendEmail, getApprovalEmail, getRejectionEmail } from '@/lib/emails'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, reason } = await request.json()
    
    // Verify admin status
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get admin record
    const { data: admin } = await supabase
      .from('admins')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get hotel details
    const { data: hotel } = await supabase
      .from('hotels')
      .select(`
        *,
        hotel_profile:hotel_profiles(email)
      `)
      .eq('id', params.id)
      .single()

    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      )
    }

    // Update hotel status
    const { error: updateError } = await supabase
      .from('hotels')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) throw updateError

    // Send notification email
    const ownerEmail = hotel.hotel_profile.email
    if (status === 'approved') {
      await sendEmail({
        to: ownerEmail,
        ...getApprovalEmail(hotel.name)
      })
    } else if (status === 'rejected') {
      await sendEmail({
        to: ownerEmail,
        ...getRejectionEmail(hotel.name, reason)
      })
    }

    return NextResponse.json({
      message: `Hotel ${status} successfully`,
      status
    })

  } catch (err: any) {
    console.error('Error updating hotel status:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to update hotel status' },
      { status: 500 }
    )
  }
}