"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ImageUpload from './ImageUpload'

interface FormData {
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  website?: string
  checkInTime: string
  checkOutTime: string
  amenities: string[]
  images: File[]
}

export default function HotelRegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    checkInTime: '14:00', // Default check-in time
    checkOutTime: '12:00', // Default check-out time
    amenities: [],
    images: []
  })

  const totalSteps = 3

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const validateStep = (step: number): boolean => {
    const errors: string[] = []

    switch (step) {
      case 1: // Basic Information
        if (!formData.name) errors.push("Hotel name is required")
        if (!formData.description) errors.push("Description is required")
        if (!formData.email) errors.push("Email is required")
        if (!formData.phone) errors.push("Phone number is required")
        break
      case 2: // Location & Contact
        if (!formData.address) errors.push("Address is required")
        if (!formData.city) errors.push("City is required")
        if (!formData.state) errors.push("State is required")
        if (!formData.country) errors.push("Country is required")
        break
      case 3: // Images & Amenities
        if (formData.images.length === 0) errors.push("At least one image is required")
        if (formData.amenities.length === 0) errors.push("Select at least one amenity")
        break
    }

    if (errors.length > 0) {
      setMessage(errors.join("\\n"))
      return false
    }

    setMessage(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // First, upload the images
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          const filePath = `hotels/${Date.now()}_${file.name}`
          const { data, error } = await supabase.storage
            .from('hotels')
            .upload(filePath, file)

          if (error) throw error

          const { data: { publicUrl } } = supabase.storage
            .from('hotels')
            .getPublicUrl(filePath)

          return publicUrl
        })
      )

      // Now submit the hotel registration
      const { data, error } = await supabase
        .from('hotels')
        .insert([
          {
            ...formData,
            images: imageUrls,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      router.push('/hotels/register/success')
      setMessage("✅ Registration submitted successfully! We'll review your application and get back to you soon.")
    } catch (err: any) {
      console.error("Registration error:", err)
      setMessage(`❌ Error: ${err.message || 'Failed to submit registration'}`)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter your hotel's name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                  placeholder="Describe your hotel, its unique features, and what guests can expect"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Contact email for bookings and inquiries"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Contact phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="https://www.yourhotel.com"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location & Operating Hours</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Country"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Time *
                  </label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Time *
                  </label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Images & Amenities</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Images *
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload at least one image of your hotel. Include photos of the exterior, lobby, rooms, and any special features.
                </p>
                <ImageUpload
                  onUpload={handleImageUpload}
                  maxFiles={5}
                  acceptedTypes={['image/jpeg', 'image/png']}
                />
                {formData.images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities *
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Select all amenities available at your hotel
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'Wi-Fi',
                    'Parking',
                    'Restaurant',
                    'Room Service',
                    'Swimming Pool',
                    'Fitness Center',
                    'Spa',
                    'Conference Rooms',
                    'Bar/Lounge',
                    'Airport Shuttle',
                    '24/7 Front Desk',
                    'Laundry Service'
                  ].map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep === i + 1
                    ? 'bg-blue-600 text-white'
                    : currentStep > i + 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Images & Amenities</span>
          </div>
        </div>

        {renderStep()}

        {message && (
          <div className={`p-4 rounded-lg ${
            message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
              ${currentStep === 1 ? 'invisible' : ''}`}
          >
            Previous
          </button>

          <button
            type={currentStep === totalSteps ? 'submit' : 'button'}
            onClick={currentStep === totalSteps ? undefined : nextStep}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
          >
            {loading
              ? 'Processing...'
              : currentStep === totalSteps
              ? 'Submit Registration'
              : 'Next Step'}
          </button>
        </div>
      </form>
    </div>
  )
}