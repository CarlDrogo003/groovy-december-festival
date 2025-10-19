'use client';

import { useState, useEffect } from 'react';
import { paystackService } from '@/lib/paystack';
import { useEventTracking } from '@/hooks/useAnalytics';

interface PaymentButtonProps {
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  paymentType: string;
  itemId: string;
  itemName: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  showFeeBreakdown?: boolean;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (response: any) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentButton({
  amount,
  description,
  customerEmail,
  customerName,
  paymentType,
  itemId,
  itemName,
  buttonText = 'Pay Now',
  className = '',
  disabled = false,
  showFeeBreakdown = true,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const { trackEventPaymentStart, trackEventPaymentFailed } = useEventTracking();

  useEffect(() => {
    // Load Paystack SDK on component mount
    const loadSDK = async () => {
      try {
        await paystackService.loadSDK();
        setSdkReady(true);
        setSdkError(false);
      } catch (error) {
        console.error('Failed to load Paystack SDK:', error);
        setSdkError(true);
        // Still set sdkReady to true to allow fallback payment flow
        setSdkReady(true);
      }
    };

    loadSDK();
  }, []);

  const handlePayment = async () => {
    if (!sdkReady) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    if (sdkError) {
      alert('Payment system unavailable. Please try refreshing the page or contact support.');
      return;
    }

    setLoading(true);
    onPaymentStart?.();

    try {
      console.log('🔄 PaymentButton: Starting payment...', {
        amount,
        customerEmail,
        customerName,
        paymentType
      });

      // Track payment button click
      trackEventPaymentStart(paymentType, amount);

      // Initialize payment
      await paystackService.initializeFestivalPayment({
        type: paymentType as 'event_registration' | 'vendor_booth' | 'pageant_application' | 'general',
        itemId,
        itemName,
        customerDetails: {
          fullName: customerName,
          email: customerEmail,
        },
        amount,
        description,
      });
      
      console.log('✅ PaymentButton: Payment initialization completed');
      
    } catch (error) {
      console.error('💥 PaymentButton: Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Show user-friendly error message
      alert(`Payment failed: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`);
      
      trackEventPaymentFailed(paymentType, amount, errorMessage);
      onPaymentError?.(errorMessage);
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

  const fee = paystackService.calculatePaystackFee(amount);
  const totalAmount = amount + fee;

  return (
    <div className="payment-button-container">
      {/* Fee Breakdown */}
      {showFeeBreakdown && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">💳 Payment Breakdown</h4>
          <div className="space-y-1 text-sm text-green-700">
            <div className="flex justify-between">
              <span>{itemName}:</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment processing fee:</span>
              <span className="font-medium">{formatCurrency(fee)}</span>
            </div>
            <div className="flex justify-between border-t border-green-300 pt-1 mt-2 font-semibold">
              <span>Total Amount:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            💡 Multiple payment options: Bank Transfer, Cards, USSD
          </div>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={disabled || loading || !sdkReady}
        className={`
          w-full py-3 px-6 text-white font-semibold rounded-lg transition-all duration-200
          ${loading || !sdkReady || disabled
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
          }
          ${className}
        `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        ) : !sdkReady ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-pulse rounded-full h-4 w-4 bg-white/50"></div>
            <span>Loading Payment...</span>
          </div>
        ) : sdkError ? (
          <div className="flex items-center justify-center gap-2">
            <span>⚠️ Payment Unavailable</span>
          </div>
        ) : (
          <>
            {buttonText} • {formatCurrency(totalAmount)}
          </>
        )}
      </button>

      {/* Payment Methods Info */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500 mb-2">Secure payments powered by Paystack</div>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            🏦 <span>Bank Transfer</span>
          </span>
          <span className="flex items-center gap-1">
            💳 <span>Cards</span>
          </span>
          <span className="flex items-center gap-1">
            📱 <span>USSD</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PaymentButton;