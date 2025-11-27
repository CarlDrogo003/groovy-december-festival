"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ContactEventFooter from '@/components/ContactEventFooter'

type HotelSummary = {
  id: string
  name: string
  address?: string
  description?: string
  rooms_count: number
  lowest_price: number | null
}

export default function HotelsClient() {
  const [hotels, setHotels] = useState<HotelSummary[]>([]) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/hotels')
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load hotels')
        if (mounted) setHotels(json.hotels || [])
      } catch (err: any) {
        if (mounted) setError(err.message || 'Unexpected error')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-8">
          <h1 className="text-3xl font-bold">Hotel Bookings</h1>
          <p className="mt-2 text-gray-600">Find and book accommodations for your stay during the Groovy December Festival</p>
        </div>

        <div className="mt-8">
          {loading && <div className="text-sm text-gray-500">Loading hotels…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hotels.length === 0 ? (
                <div className="rounded-lg border p-6">
                  <h3 className="text-xl font-semibold">No hotels available yet</h3>
                  <p className="mt-2 text-muted-foreground">We are adding hotels for the festival — check back soon.</p>
                </div>
              ) : (
                hotels.map((h) => (
                  <article key={h.id} className="rounded-lg border p-6">
                    <h3 className="text-lg font-semibold">{h.name}</h3>
                    {h.address && <p className="text-sm text-gray-600">{h.address}</p>}
                    <p className="mt-3 text-sm text-gray-700">{h.description?.slice(0, 160)}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-600">{h.rooms_count} room(s)</div>
                      <div className="text-sm font-semibold">{h.lowest_price ? `₦${h.lowest_price}` : 'Price N/A'}</div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/hotels/${h.id}`} className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg">View</Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
  </div>

      <ContactEventFooter />
    </>
  )
}