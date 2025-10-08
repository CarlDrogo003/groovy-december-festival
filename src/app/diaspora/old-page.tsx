"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Tour {
  id: string
  name: string
  price_usd: number
  duration: string
  description: string
  benefits: string[]
}

export default function DiasporaPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase.from("tours").select("*")
      if (error) console.error(error)
      else setTours(data || [])
      setLoading(false)
    }
    fetchTours()
  }, [])

  // Handle Booking Submission
    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // capture form reference immediately

    const formData = new FormData(form);
    const booking = {
      tour_id: selectedTour?.id,
      full_name: String(formData.get("full_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      travelers: Number(formData.get("travelers") || 1),
      special_requests: String(formData.get("special_requests") || "").trim(),
    };

    try {
      const { error } = await supabase.from("tour_bookings").insert([booking]);
      if (error) {
        alert("❌ Error: " + error.message);
      } else {
        alert("✅ Booking successful!");
        form.reset(); // safe reset
        setSelectedTour(null); // close modal
      }
    } catch (err: any) {
      alert("❌ Unexpected error: " + (err?.message ?? String(err)));
    }
  };

  if (loading) return <p className="text-center p-8">Loading tours...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        Groovy December 2025 — Tour Packages
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="p-6 border rounded-xl shadow bg-white">
            <h2 className="text-xl font-semibold">{tour.name}</h2>
            <p className="text-gray-600">
              {tour.duration} — <span className="font-bold">${tour.price_usd}</span>
            </p>
            <ul className="list-disc pl-5 mt-3 text-sm text-gray-700">
              {tour.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedTour(tour)}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
{selectedTour && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
      {/* Close Button */}
      <button
        onClick={() => setSelectedTour(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4 text-green-700">
        Book {selectedTour.name}
      </h2>

      <form onSubmit={handleBooking} className="space-y-4">
        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-3 rounded-lg"
        />
        <input
          name="travelers"
          type="number"
          min="1"
          defaultValue="1"
          className="w-full border p-3 rounded-lg"
        />
        <textarea
          name="special_requests"
          placeholder="Special Requests"
          className="w-full border p-3 rounded-lg"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setSelectedTour(null)}
            className="px-5 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}
