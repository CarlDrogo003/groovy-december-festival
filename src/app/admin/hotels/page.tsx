'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Hotel } from '@/types/hotels'
import { useRouter } from 'next/navigation'

interface ExpandedHotel extends Hotel {
  hotel_profile: {
    full_name: string
    email: string
  }
}

export default function AdminHotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<ExpandedHotel[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedHotel, setSelectedHotel] = useState<ExpandedHotel | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadHotels()
  }, [filter])

  async function loadHotels() {
    try {
      setLoading(true)
      let query = supabase
        .from('hotels')
        .select(`
          *,
          hotel_profile:hotel_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error

      setHotels(data as ExpandedHotel[])
    } catch (err) {
      console.error('Error loading hotels:', err)
      alert('Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (hotelId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('hotels')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', hotelId)

      if (error) throw error

      // Refresh the hotels list
      loadHotels()
      
      // Close the modal if open
      setShowModal(false)
      setSelectedHotel(null)

    } catch (err) {
      console.error('Error updating hotel status:', err)
      alert('Failed to update hotel status')
    }
  }

  const openHotelDetails = (hotel: ExpandedHotel) => {
    setSelectedHotel(hotel)
    setShowModal(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotel Registrations</h1>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="all">All Hotels</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotels...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Hotel Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Owner</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Location</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{hotel.hotel_profile.full_name}</div>
                    <div className="text-sm text-gray-500">{hotel.hotel_profile.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{hotel.city}</div>
                    <div className="text-sm text-gray-500">{hotel.state}, {hotel.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${hotel.status === 'approved' ? 'bg-green-100 text-green-800' :
                        hotel.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openHotelDetails(hotel)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hotel Details Modal */}
      {showModal && selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto shadow-xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">{selectedHotel.name}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Email:</span> {selectedHotel.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedHotel.phone}</p>
                      {selectedHotel.website && (
                        <p><span className="font-medium">Website:</span> {selectedHotel.website}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <div className="mt-2 space-y-2">
                      <p>{selectedHotel.address}</p>
                      <p>{selectedHotel.city}, {selectedHotel.state}</p>
                      <p>{selectedHotel.country}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-2 text-gray-600">{selectedHotel.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Operating Hours</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Check-in:</span> {selectedHotel.checkInTime}</p>
                    <p><span className="font-medium">Check-out:</span> {selectedHotel.checkOutTime}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Amenities</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Images</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {selectedHotel.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedHotel.name} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                {selectedHotel.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedHotel.id, 'rejected')}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedHotel.id, 'approved')}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}