'use client';

import { useState } from 'react';
import { PaystackPaymentService } from '@/lib/paystack';

export default function PaymentTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState({
    email: '',
    amount: 50000, // ₦500 in kobo
    fullName: 'Test User'
  });

  const paystackService = PaystackPaymentService.getInstance();

  const checkConfiguration = () => {
    const config = paystackService.getTestConfiguration();
    setTestResult({ type: 'config', data: config });
  };

  const testPayment = async () => {
    if (!paymentConfig.email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await paystackService.initializeFestivalPayment({
        type: 'general',
        itemName: 'Payment Test',
        customerDetails: {
          fullName: paymentConfig.fullName,
          email: paymentConfig.email
        },
        amount: paymentConfig.amount,
        description: 'Testing payment integration'
      });
      setTestResult({ type: 'payment', data: 'Payment initiated successfully' });
    } catch (error) {
      setTestResult({ type: 'error', data: (error instanceof Error ? error.message : String(error)) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🧪 Payment Gateway Test
          </h1>

          {/* Configuration Check */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Check Configuration</h2>
            <button
              onClick={checkConfiguration}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Check Paystack Configuration
            </button>
          </div>

          {/* Payment Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Test Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email:
                </label>
                <input
                  type="email"
                  value={paymentConfig.email}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Amount (₦):
                </label>
                <select
                  value={paymentConfig.amount}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={50000}>₦500 (Small amount)</option>
                  <option value={500000}>₦5,000 (Medium amount)</option>
                  <option value={5000000}>₦50,000 (Large amount)</option>
                  <option value={10000000}>₦100,000 (Very large)</option>
                </select>
              </div>

              <button
                onClick={testPayment}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Test Payment'}
              </button>
            </div>
          </div>

          {/* Test Cards Info */}
          <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">📋 Test Cards</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Success:</strong> 4084084084084081</div>
              <div><strong>Failed:</strong> 4084084084084084</div>
              <div><strong>Pending:</strong> 4084084084084089</div>
              <div className="mt-2 text-yellow-700">
                Use any future expiry date, any CVV, PIN: 0000, OTP: 123456
              </div>
            </div>
          </div>

          {/* Results */}
          {testResult && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Results:</h3>
              <div className={`p-4 rounded-lg ${
                testResult.type === 'error' ? 'bg-red-50 border border-red-200' :
                testResult.type === 'config' ? 'bg-blue-50 border border-blue-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🔧 Testing Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>First, check configuration to ensure Paystack keys are loaded</li>
              <li>Enter your real email (you'll get test notifications)</li>
              <li>Select a test amount</li>
              <li>Click "Test Payment" to open Paystack checkout</li>
              <li>Use the test card numbers provided above</li>
              <li>Complete the payment flow</li>
              <li>Check console logs for detailed information</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}