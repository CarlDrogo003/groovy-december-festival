'use client';

import { useState, useEffect } from 'react';
import { monnifyPaymentService, formatCurrency } from '@/lib/monnify';
import { Modal } from '@/components/ui/Modal';
import { useEventTracking } from '@/hooks/useAnalytics';

interface PaymentBreakdown {
  subtotal: number;
  fee: number;
  total: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  description?: string;
  customerEmail?: string;
  customerName?: string;
  paymentType?: string;
  itemId?: string;
  itemName?: string;
  paymentBreakdown?: PaymentBreakdown;
  paymentConfig?: any;
  onPaymentSuccess?: (response: any) => void;
  onPaymentError?: (error: any) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  customerEmail,
  customerName,
  paymentType,
  itemId,
  itemName,
  paymentBreakdown,
  paymentConfig,
  onPaymentSuccess,
  onPaymentError,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { trackEventPaymentStart, trackEventPaymentFailed } = useEventTracking();

  // Use provided breakdown or calculate automatically
  const safeAmount = amount || 0;
  const breakdown = paymentBreakdown || {
    subtotal: safeAmount,
    fee: monnifyPaymentService.calculateFee(safeAmount),
    total: safeAmount + monnifyPaymentService.calculateFee(safeAmount)
  };

  useEffect(() => {
    if (isOpen) {
      const loadSDK = async () => {
        try {
          await monnifyPaymentService.loadSDK();
          setSdkReady(true);
        } catch (error) {
          console.error('Failed to load Monnify SDK:', error);
        }
      };
      loadSDK();
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before proceeding.');
      return;
    }

    setLoading(true);

    try {
      // Track payment initiation
      trackEventPaymentStart(paymentType || 'unknown', safeAmount);

      // Initialize payment
      await monnifyPaymentService.initializePayment({
        type: (paymentType || 'general') as any,
        itemId: itemId || 'unknown',
        itemName: itemName || 'Payment',
        customerDetails: {
          fullName: customerName || '',
          email: customerEmail || '',
          phone: ''
        },
        amount: safeAmount,
        description: description || 'Festival payment'
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Track payment failure
      trackEventPaymentFailed(paymentType || 'unknown', safeAmount, errorMessage);
      
      onPaymentError?.(errorMessage);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Payment
          </h2>
          <p className="text-gray-600">
            {description}
          </p>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{formatCurrency(breakdown.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium">{formatCurrency(breakdown.fee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(breakdown.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 4l-8 5-8-5h16z" />
              </svg>
              Bank Transfer
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 6v-4h12v4H4z" />
              </svg>
              Debit/Credit Cards
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              USSD
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Phone Wallet
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Name:</span> {customerName}</p>
            <p><span className="font-medium">Email:</span> {customerEmail}</p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-green-600 hover:underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </a>
              . I authorize the payment of {formatCurrency(breakdown.total)} for {itemName}.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!agreedToTerms || loading || !sdkReady}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              agreedToTerms && !loading && sdkReady
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                🔒 Pay {formatCurrency(breakdown.total)} Securely
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secured by Monnify - PCI DSS Compliant</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentModal;