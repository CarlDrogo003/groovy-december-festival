import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST: Called when a booking is marked as paid. Updates coordinator stats.
export async function POST(req: NextRequest) {
  const { referral_code, final_amount } = await req.json();
  if (!referral_code || !final_amount) {
    return NextResponse.json({ error: 'Missing referral_code or final_amount' }, { status: 400 });
  }

  // Calculate 5% commission
  const commission = Number(final_amount) * 0.05;

  // Fetch current values
  const { data: current, error: fetchError } = await supabase
    .from('diaspora_referrals')
    .select('total_referrals, earnings_usd')
    .eq('referral_code', referral_code)
    .eq('status', 'active')
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: fetchError?.message || 'Coordinator not found' }, { status: 404 });
  }

  const updated = {
    total_referrals: (current.total_referrals || 0) + 1,
    earnings_usd: Number(current.earnings_usd || 0) + commission
  };

  const { data, error } = await supabase
    .from('diaspora_referrals')
    .update(updated)
    .eq('referral_code', referral_code)
    .eq('status', 'active')
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
