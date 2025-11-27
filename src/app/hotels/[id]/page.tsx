import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdminServer'
import BookingForm from '@/components/hotels/BookingForm'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params
  const { data } = await supabaseAdmin.from('hotels').select('name').eq('id', id).single()
  return {
    title: data?.name ? `${data.name} - Hotels` : 'Hotel Details',
  }
}

export default async function HotelPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { data: hotel, error } = await supabaseAdmin
    .from('hotels')
    .select('*, rooms(*)')
    .eq('id', id)
    .single()

  if (error || !hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold">Hotel not found</h2>
        <p className="text-sm text-gray-600 mt-2">We could not find the requested hotel.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      {hotel.address && <p className="text-sm text-gray-600">{hotel.address}</p>}
      {hotel.description && <p className="mt-4 text-gray-700">{hotel.description}</p>}

      <section className="mt-8 grid gap-8 md:grid-cols-2">
        {hotel.rooms && hotel.rooms.length > 0 ? (
          hotel.rooms.map((room: any) => (
            <div key={room.id} className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">{room.room_number || room.type}</h3>
              <p className="text-sm text-gray-600">Type: {room.type}</p>
              <p className="mt-2 text-sm">Price per night: ₦{room.price_per_night}</p>
              <div className="mt-4">
                <BookingForm roomId={room.id} pricePerNight={parseFloat(room.price_per_night)} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">No rooms listed yet</h3>
            <p className="mt-2 text-sm text-gray-600">This hotel has not added rooms to the system yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
