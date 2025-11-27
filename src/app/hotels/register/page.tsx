import HotelRegistrationForm from '@/components/hotels/registration/HotelRegistrationForm'

export default function HotelRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Register Your Hotel
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with us to showcase your hotel to festival attendees. Complete this form to begin the registration process.
          </p>
        </div>

        {/* Registration Form */}
        <HotelRegistrationForm />
      </div>
    </div>
  )
}