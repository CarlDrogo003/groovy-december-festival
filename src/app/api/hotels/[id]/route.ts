import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdminServer'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  const { data, error } = await supabaseAdmin
    .from('hotels')
    .select('*, rooms(*)')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }

  return NextResponse.json({ hotel: data }, { status: 200 })
}
