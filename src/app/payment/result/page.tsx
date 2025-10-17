'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

function PaymentResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  const status = searchParams.get('status')
  const reference = searchParams.get('reference')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency') || 'NGN'
  const message = searchParams.get('message')
  const customer = searchParams.get('customer')
  const channel = searchParams.get('channel')
  const transactionId = searchParams.get('transaction_id')
  const paidAt = searchParams.get('paid_at')

  // Countdown for auto-redirect
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status, router])

  const getStatusDisplay = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful! 🎉',
          description: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800'
        }
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          description: message || 'Your payment could not be processed.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800'
        }
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: 'Payment Pending',
          description: 'Your payment is being processed. Please wait.',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800'
        }
      case 'error':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-orange-500" />,
          title: 'Payment Error',
          description: message || 'An error occurred while processing your payment.',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-800'
        }
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-gray-500" />,
          title: 'Unknown Status',
          description: 'Payment status could not be determined.',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800'
        }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Result Card */}
        <div className={`${statusDisplay.bgColor} rounded-lg p-8 text-center mb-6 border shadow-lg`}>
          <div className="mb-4">
            {statusDisplay.icon}
          </div>
          
          <h1 className={`text-2xl font-bold ${statusDisplay.textColor} mb-2`}>
            {statusDisplay.title}
          </h1>
          
          <p className={`${statusDisplay.textColor} mb-4`}>
            {statusDisplay.description}
          </p>

          {/* Payment Details */}
          {status === 'success' && amount && (
            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {currency === 'NGN' ? '₦' : currency} {parseFloat(amount).toLocaleString()}
                  </span>
                </div>
                {reference && (
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-mono text-xs">{reference}</span>
                  </div>
                )}
                {channel && (
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize font-medium">{channel}</span>
                  </div>
                )}
                {customer && (
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{customer}</span>
                  </div>
                )}
                {paidAt && (
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {new Date(paidAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Details */}
          {(status === 'failed' || status === 'error') && reference && (
            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Reference</h3>
              <p className="text-sm text-gray-600 font-mono">{reference}</p>
              <p className="text-xs text-gray-500 mt-2">
                Please save this reference for future inquiries
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === 'success' && (
            <>
              <div className="bg-white/10 rounded-lg p-4 text-center text-white">
                <p className="text-sm">
                  Redirecting to homepage in {countdown} seconds...
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Homepage
              </button>
            </>
          )}

          {(status === 'failed' || status === 'error') && (
            <button
              onClick={() => router.back()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}

          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Back to Homepage
          </button>

          {(status === 'failed' || status === 'error') && (
            <button
              onClick={() => router.push('/contact')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Contact Support
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Need help? Contact us at{' '}
            <a 
              href="mailto:hello@groovydecember.ng" 
              className="text-blue-300 hover:text-blue-200 underline"
            >
              hello@groovydecember.ng
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Processing payment result...</p>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  )
}