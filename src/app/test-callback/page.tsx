'use client'

import { useRouter } from 'next/navigation'

export default function TestCallbackPage() {
  const router = useRouter()

  const testCallback = () => {
    // Simulate a successful payment callback
    const testReference = 'GROOVY2025_TEST_' + Date.now()
    window.location.href = `/api/payments/callback?reference=${testReference}&trxref=${testReference}`
  }

  const testSuccessResult = () => {
    // Test the success result page directly
    const params = new URLSearchParams({
      status: 'success',
      reference: 'GROOVY2025_TEST_SUCCESS',
      amount: '50000',
      currency: 'NGN',
      channel: 'card',
      customer: 'test@groovydecember.ng',
      transaction_id: '12345',
      paid_at: new Date().toISOString()
    })
    router.push(`/payment/result?${params.toString()}`)
  }

  const testErrorResult = () => {
    // Test the error result page directly
    router.push('/payment/result?status=error&message=Test%20error%20message')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Payment Callback Testing</h1>
      
      <div className="space-y-4">
        <button
          onClick={testSuccessResult}
          className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
        >
          🎉 Test Success Result Page
        </button>
        
        <button
          onClick={testErrorResult}
          className="block w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700"
        >
          ❌ Test Error Result Page
        </button>
        
        <button
          onClick={testCallback}
          className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
        >
          🔄 Test Callback Handler (will attempt verification)
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Testing Instructions:</h2>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Use "Test Success Result Page" to see how the success page should look</li>
          <li>Use "Test Error Result Page" to see how the error page should look</li>
          <li>Use "Test Callback Handler" to test the actual callback flow (will try to verify a fake transaction)</li>
        </ol>
      </div>
    </div>
  )
}