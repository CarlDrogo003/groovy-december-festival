"use client"

import { useState } from 'react'

type Props = {
  roomId: string
  pricePerNight: number
}

export default function BookingForm({ roomId, pricePerNight }: Props) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!checkIn || !checkOut) {
      setMessage('Select check-in and check-out dates')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: roomId, check_in_date: checkIn, check_out_date: checkOut })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Booking failed')

      setMessage('Booking created. Complete payment to confirm. Payment reference: ' + json.payment?.transaction_reference)
    } catch (err: any) {
      setMessage(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 block w-full rounded-md border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 block w-full rounded-md border p-2" />
        </div>
      </div>

      <div className="text-sm text-gray-700">Price per night: ₦{pricePerNight}</div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg">
          {loading ? 'Booking…' : 'Book now'}
        </button>
      </div>

      {message && <div className="text-sm text-gray-700">{message}</div>}
    </form>
  )
}
