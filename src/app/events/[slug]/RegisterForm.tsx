"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEventTracking } from "@/hooks/useAnalytics";
import PaymentButton from "@/components/PaymentButton";
import PaymentModal from "@/components/PaymentModal";
import { MonnifyPaymentService, FestivalPaymentConfig } from "@/lib/monnify";
import { useAuth } from "@/contexts/AuthContext";

interface Event {
  id: string;
  title: string;
  registration_fee: number;
  description?: string;
}

export default function RegisterForm({ 
  eventId, 
  eventName, 
  eventFee = 0,
  event 
}: { 
  eventId: string; 
  eventName: string; 
  eventFee?: number;
  event?: Event;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { trackEventRegistrationStart, trackEventRegistration, trackEventRegistrationComplete } = useEventTracking();

  // Determine if this is a paid event
  const isPaidEvent = eventFee > 0;
  const actualEventFee = event?.registration_fee || eventFee;

  useEffect(() => {
    // Pre-fill user data if authenticated
    if (user) {
      setEmail(user.email || '');
      // You could fetch user profile data here
    }
  }, [user]);

  const handleFreeRegistration = async (formData: any) => {
    try {
      setIsSubmitting(true);

      // Insert registration into Supabase for free events
      const { error } = await supabase.from("event_registrations").insert([{
        event_id: eventId,
        user_id: user?.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        payment_status: 'paid', // Free events are considered "paid"
        payment_reference: `FREE_${Date.now()}`
      }]);

      if (error) throw error;

      // Track successful free registration
      trackEventRegistration(eventName, eventId, 0);
      trackEventRegistrationComplete(eventName, 'free');
      
      setStatus("✅ Successfully registered for free event!");
      
      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");

    } catch (error) {
      console.error('Free registration error:', error);
      setStatus("❌ Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = { fullName, email, phone };
    
    // Validate form
    if (!fullName.trim() || !email.trim()) {
      setStatus("❌ Please fill in all required fields.");
      return;
    }

    // Track registration attempt
    trackEventRegistrationStart(eventName);

    if (!isPaidEvent) {
      // Handle free event registration
      await handleFreeRegistration(formData);
    } else {
      // Store registration data and show payment modal
      setRegistrationData(formData);
      setShowPaymentModal(true);
    }
  };

  // Create payment configuration for paid events
  const createPaymentConfig = (): FestivalPaymentConfig | null => {
    if (!registrationData || !isPaidEvent) return null;

    return MonnifyPaymentService.getEventRegistrationConfig({
      id: eventId,
      name: eventName,
      fee: actualEventFee,
      customerDetails: {
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
      }
    });
  };

  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      // Save registration with payment details
      const { error } = await supabase.from("event_registrations").insert([{
        event_id: eventId,
        user_id: user?.id,
        full_name: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        payment_status: 'paid',
        payment_reference: paymentResponse.paymentReference || paymentResponse.transactionReference,
        additional_info: {
          payment_method: paymentResponse.paymentMethod,
          transaction_reference: paymentResponse.transactionReference,
          amount_paid: paymentResponse.amountPaid,
        }
      }]);

      if (error) throw error;

      // Track successful paid registration
      trackEventRegistration(eventName, eventId, actualEventFee);
      trackEventRegistrationComplete(eventName, paymentResponse.paymentMethod);

      setStatus("🎉 Registration and payment completed successfully!");
      setShowPaymentModal(false);
      
      // Clear form
      setFullName("");
      setEmail("");
      setPhone("");
      setRegistrationData(null);

    } catch (error) {
      console.error('Post-payment registration error:', error);
      setStatus("⚠️ Payment successful but registration save failed. Please contact support.");
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setStatus("❌ Payment failed. Please try again or contact support.");
    setShowPaymentModal(false);
  };

  const paymentConfig = createPaymentConfig();

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-6 p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg max-w-lg"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPaidEvent ? '🎫 Event Registration & Payment' : '📝 Event Registration'}
          </h2>
          <p className="text-gray-600">
            {isPaidEvent 
              ? `Registration fee: ₦${actualEventFee.toLocaleString()} + processing fee`
              : 'This is a free event - no payment required!'
            }
          </p>
        </div>

        {/* Event Info */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">{eventName}</h3>
          {event?.description && (
            <p className="text-sm text-green-700 mt-1">{event.description}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {isPaidEvent ? 'Required for payment confirmation' : 'Optional - for event updates'}
            </p>
          </div>
        </div>

        {/* Registration Button */}
        <div className="space-y-3">
          {isPaidEvent ? (
            // Show payment button for paid events
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200
                ${isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Continue to Payment • ₦${actualEventFee.toLocaleString()}`
              )}
            </button>
          ) : (
            // Show free registration button
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200
                ${isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                '✅ Register for Free Event'
              )}
            </button>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className={`
            mt-4 p-3 rounded-lg text-sm font-medium
            ${status.includes('✅') || status.includes('🎉') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : status.includes('⚠️')
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : 'bg-red-50 text-red-800 border border-red-200'
            }
          `}>
            {status}
          </div>
        )}

        {/* Event Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>🔒 Secure Registration</span>
            {isPaidEvent && <span>💳 Multiple Payment Options</span>}
          </div>
        </div>
      </form>

      {/* Payment Modal */}
      {paymentConfig && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentConfig={paymentConfig}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </>
  );
}
