import Link from 'next/link'

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-green-100 h-20 w-20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Registration Submitted!
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for registering your hotel. Our team will review your submission
          and get back to you within 2-3 business days.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly with more details about the next steps.
          </p>

          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}