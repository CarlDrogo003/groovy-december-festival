import { Suspense } from 'react'
import TicketsClient from './TicketsClient'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-red-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading tickets...</p>
      </div>
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TicketsClient />
    </Suspense>
  )
}

export const metadata = {
  title: 'Festival Tickets - Groovy December',
  description: 'Purchase your entry tickets for Groovy December Festival. VIP, Regular, and Student passes available. December 15-31, 2025 in Abuja, Nigeria.',
  openGraph: {
    title: 'Festival Tickets - Groovy December',
    description: 'Get your tickets for Africa\'s ultimate end-of-year festival! 17 days of culture, business & entertainment in Abuja.',
    url: 'https://www.groovydecember.ng/tickets',
  },
}