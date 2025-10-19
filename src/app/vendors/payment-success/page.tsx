"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering to prevent prerender issues
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    // Get payment details from URL parameters or localStorage
    const paymentRef = reference || trxref;
    
    if (paymentRef) {
      // You could verify payment status here
      setPaymentDetails({
        reference: paymentRef,
        status: 'success'
      });
    }
    
    setLoading(false);
  }, [reference, trxref]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for registering as a vendor for Groovy December Festival 2025
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Payment Confirmed</h3>
              <p className="text-sm text-green-700">
                Reference: <span className="font-mono">{paymentDetails.reference}</span>
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-3 text-center">📋 What Happens Next?</h3>
            <div className="space-y-3 text-blue-700">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>Our team will review your application within 24-48 hours</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>You'll receive an email confirmation with your booth space assignment</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Setup instructions and vendor guidelines will be sent closer to the event</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p>Our vendor coordinator will contact you with final details</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">📞 Need Help?</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Email: <a href="mailto:vendors@groovydecember.ng" className="text-blue-600 hover:underline">vendors@groovydecember.ng</a></p>
              <p>Phone: <a href="tel:+234-xxx-xxx-xxxx" className="text-blue-600 hover:underline">+234-xxx-xxx-xxxx</a></p>
              <p>WhatsApp: <a href="https://wa.me/234xxxxxxxxx" className="text-blue-600 hover:underline">+234-xxx-xxx-xxxx</a></p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              🏠 Back to Home
            </Link>
            <Link 
              href="/vendors"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              📝 Register Another Vendor
            </Link>
          </div>

          {/* Social Media */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Follow us for updates:</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🎪 Groovy December Festival 2025 • December 25-31, 2025</p>
          <p>🌍 Celebrating African Culture & Innovation</p>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense to handle useSearchParams
export default function VendorPaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}