import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET: Returns all active coordinators and their stats
export async function GET(req: NextRequest) {
  const { data, error } = await supabase
    .from('diaspora_referrals')
    .select('referral_code, referrer_name, referrer_email, total_referrals, earnings_usd, status')
    .eq('status', 'active')
    .order('earnings_usd', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ coordinators: data });
}
