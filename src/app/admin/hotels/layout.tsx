export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function AdminHotelsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is an admin
  const { data: adminProfile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!adminProfile) {
    redirect('/')
  }

  return (
    <>
      {children}
    </>
  )
}