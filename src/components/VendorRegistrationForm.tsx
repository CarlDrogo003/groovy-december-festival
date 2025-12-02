"use client";

import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { paystackService } from "@/lib/paystack";

interface VendorFormData {
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  package: string;
  business_type: string;
  business_description: string;
  years_in_business: string;
  products_services: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_reference?: string;
  // New fields for space quantities
  premium_booth_qty?: number;
  standard_booth_qty?: number;
  food_kiosk_qty?: number;
}

interface VendorSpaceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  size: string;
  features: string[];
}

export default function VendorRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [spaceQuantities, setSpaceQuantities] = useState<Record<string, number>>({
    premium_booth: 0,
    standard_booth: 0
  });
  const [pendingFormData, setPendingFormData] = useState<Partial<VendorFormData>>({});

  // Comment out packages for potential future use
  /*
  const vendorPackages: VendorPackageOption[] = [
    // Package definitions commented out
  ];
  */

  const vendorSpaces: VendorSpaceOption[] = [
    {
      id: "premium_booth",
      name: "Premium Booth",
      size: "5ft x 5ft",
      price: 80000,
      description: "Prime location booth with maximum visibility and foot traffic. Perfect for established businesses looking to make a big impact.",
      features: [
        "5ft x 5ft prime location",
        "High foot traffic area",
        "Professional setup assistance",
        "Premium lighting package",
        "Power outlet",
        "3-day festival access"
      ]
    },
    {
      id: "standard_booth",
      name: "Standard Booth",
      size: "4ft x 4ft",
      price: 50000,
      description: "Well-positioned booth space ideal for small to medium businesses. Great value with essential amenities included.",
      features: [
        "4ft x 4ft booth space",
        "Good location placement",
        "Display table included",
        "Basic lighting",
        "Power outlet access",
        "Setup assistance",
        "3-day festival access"
      ]
    }
  ];

  const incrementQuantity = (spaceId: string) => {
    setSpaceQuantities(prev => ({
      ...prev,
      [spaceId]: prev[spaceId] + 1
    }));
  };

  const decrementQuantity = (spaceId: string) => {
    setSpaceQuantities(prev => ({
      ...prev,
      [spaceId]: Math.max(0, prev[spaceId] - 1)
    }));
  };

  const getTotalPrice = () => {
    let total = 0;
    vendorSpaces.forEach(space => {
      const quantity = spaceQuantities[space.id] || 0;
      total += space.price * quantity;
    });
    return total;
  };

  const getSelectedSpacesSummary = () => {
    const selected: string[] = [];
    vendorSpaces.forEach(space => {
      const quantity = spaceQuantities[space.id] || 0;
      if (quantity > 0) {
        selected.push(`${space.name} (x${quantity})`);
      }
    });
    return selected.join(', ');
  };

  const getTotalSpacesCount = () => {
    return Object.values(spaceQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formDataSubmit = new FormData(form);
    
    // Debug: Check what form data we're getting
    console.log('📋 Raw form data:');
    for (const [key, value] of formDataSubmit.entries()) {
      console.log(`  ${key}: "${value}"`);
    }
    
    const vendorData: Partial<VendorFormData> = {
      business_name: String(formDataSubmit.get("business_name") || "").trim(),
      owner_name: String(formDataSubmit.get("owner_name") || "").trim(),
      email: String(formDataSubmit.get("email") || "").trim(),
      phone: String(formDataSubmit.get("phone") || "").trim(),
      package: getSelectedSpacesSummary(), // Store selected space names with quantities
      business_type: String(formDataSubmit.get("business_type") || "").trim(),
      business_description: String(formDataSubmit.get("business_description") || "").trim(),
      years_in_business: String(formDataSubmit.get("years_in_business") || "").trim(),
      products_services: String(formDataSubmit.get("products_services") || "").trim(),
      payment_status: 'pending',
      // Store individual quantities for database
      premium_booth_qty: spaceQuantities.premium_booth || 0,
      standard_booth_qty: spaceQuantities.standard_booth || 0,
      food_kiosk_qty: spaceQuantities.food_kiosk || 0
    };

    setPendingFormData(vendorData);

    console.log('🔍 Vendor Form Data:', vendorData);
    console.log('📦 Space Quantities:', spaceQuantities);

    // Ensure at least one space is selected
    if (getTotalSpacesCount() === 0) {
      setMessage("❌ Please select at least one space before proceeding.");
      setLoading(false);
      return;
    }

    // Validate required fields before payment
    if (!vendorData.email || !vendorData.owner_name) {
      setMessage("❌ Please fill in all required fields (Business Name, Owner Name, Email).");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendorData.email)) {
      setMessage("❌ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    console.log('✅ Validation passed, opening payment modal');

    // All vendor spaces require payment
    setShowPaymentModal(true);
    setLoading(false);
    return;
  };



  const handlePaymentSuccess = async (paymentData: any) => {
    // Update vendor data with payment information
    const updatedVendorData = {
      ...pendingFormData,
      payment_status: 'paid' as const,
      payment_reference: paymentData.transactionReference
    };

    try {
      // Register the vendor
      const response = await fetch('/api/vendors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVendorData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Redirect to vendor success page instead of showing inline message
      window.location.href = `/vendors/payment-success?reference=${paymentData.transactionReference}`;
      
    } catch (err: any) {
      setMessage("❌ Registration failed after payment: " + (err?.message ?? String(err)));
      console.error(err);
    } finally {
      setShowPaymentModal(false);
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setMessage(`❌ Payment failed: ${error}`);
    setShowPaymentModal(false);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            🏪 Vendor Registration
          </h2>
          <p className="mt-2 text-gray-600">
            Join Africa's premier end-of-year festival
          </p>
          
          {/* Payment Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💳 <strong>Payment Required:</strong> All vendor spaces require payment to secure your booth.
            </p>
          </div>
        </div>

        {/* Space Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🏢 Choose Your Perfect Space
          </h3>
          <p className="text-gray-600 mb-6">
            From premium booths to specialized kiosks, we have the perfect space for every business type and budget.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {vendorSpaces.map((space) => {
              const quantity = spaceQuantities[space.id] || 0;
              const isPremium = space.id === "premium_booth";
              return (
                <div
                  key={space.id}
                  className={`relative border-2 rounded-xl p-6 transition-all ${
                    quantity > 0
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                        🔥 Popular Choice
                      </span>
                    </div>
                  )}
                  
                  {/* Space Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      quantity > 0 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <div className={`text-2xl ${quantity > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        🏢
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h4 className={`text-lg font-semibold mb-2 ${
                      quantity > 0 ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {space.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{space.description}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      📏 Size: {space.size}
                    </div>
                    <div className={`text-2xl font-bold ${
                      quantity > 0 ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      ₦{space.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center justify-center mb-4 space-x-3">
                    <button
                      type="button"
                      onClick={() => decrementQuantity(space.id)}
                      disabled={quantity === 0}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 transition-colors"
                    >
                      <span className="text-gray-600 font-bold">−</span>
                    </button>
                    
                    <div className="bg-white border-2 border-gray-200 rounded-lg px-4 py-2 min-w-[60px] text-center">
                      <span className="text-lg font-semibold text-gray-900">{quantity}</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => incrementQuantity(space.id)}
                      className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                    >
                      <span className="font-bold">+</span>
                    </button>
                  </div>

                  {quantity > 0 && (
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ {quantity} space{quantity > 1 ? 's' : ''} selected
                      </span>
                    </div>
                  )}

                  <ul className="text-xs text-gray-600 space-y-2">
                    {space.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {space.features.length > 4 && (
                      <li className="text-gray-400 text-center mt-2">
                        +{space.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Selection Summary */}
          {getTotalSpacesCount() > 0 && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-4 text-center">
                📋 Your Selected Spaces ({getTotalSpacesCount()} total)
              </h4>
              <div className="space-y-3">
                {vendorSpaces
                  .filter(space => (spaceQuantities[space.id] || 0) > 0)
                  .map((space) => {
                    const quantity = spaceQuantities[space.id];
                    return (
                      <div key={space.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-blue-900">{space.name}</span>
                          <span className="text-blue-600 text-sm ml-2">
                            ({space.size}) × {quantity}
                          </span>
                        </div>
                        <span className="font-bold text-blue-800">
                          ₦{(space.price * quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                <div className="border-t border-blue-300 pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold text-blue-900">
                    <span>Total Amount:</span>
                    <span>₦{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-blue-600 text-center mt-2">
                    💳 Payment will be processed securely through Paystack
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <form id="vendor-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                name="business_name"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner's Full Name *
              </label>
              <input
                name="owner_name"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="business@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                name="business_type"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Business Type</option>
                <option value="retail">Retail</option>
                <option value="food_beverage">Food & Beverage</option>
                <option value="fashion">Fashion & Clothing</option>
                <option value="arts_crafts">Arts & Crafts</option>
                <option value="technology">Technology</option>
                <option value="services">Services</option>
                <option value="beauty_wellness">Beauty & Wellness</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in Business *
              </label>
              <select
                name="years_in_business"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Experience</option>
                <option value="less_than_1">Less than 1 year</option>
                <option value="1_2">1-2 years</option>
                <option value="3_5">3-5 years</option>
                <option value="6_10">6-10 years</option>
                <option value="more_than_10">More than 10 years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              name="business_description"
              required
              rows={3}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Briefly describe your business and what makes it unique..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products/Services Offered *
            </label>
            <textarea
              name="products_services"
              required
              rows={3}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="List the main products or services you'll be offering at the festival..."
            />
          </div>

          {/* Payment Information */}
          {getTotalSpacesCount() > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Payment Summary
              </h4>
              <div className="space-y-1">
                {vendorSpaces
                  .filter(space => (spaceQuantities[space.id] || 0) > 0)
                  .map((space) => {
                    const quantity = spaceQuantities[space.id];
                    return (
                      <div key={space.id} className="flex justify-between items-center">
                        <span className="text-green-700">
                          {space.name} ({space.size}) × {quantity}
                        </span>
                        <span className="font-medium text-green-900">
                          ₦{(space.price * quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-green-800">Total Amount:</span>
                    <span className="text-green-900">₦{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Payment will be processed securely through Paystack
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || getTotalSpacesCount() === 0}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
                loading || getTotalSpacesCount() === 0
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                getTotalSpacesCount() > 0 
                  ? `Proceed to Payment - ₦${getTotalPrice().toLocaleString()}`
                  : 'Select Space(s) First'
              )}
            </button>
          </div>
        </form>

        {message && (
          <div className={`text-center mt-6 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && getTotalSpacesCount() > 0 && pendingFormData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={getTotalPrice()}
          description={`Vendor Registration - ${getSelectedSpacesSummary()}`}
          customerEmail={pendingFormData.email || ""}
          customerName={pendingFormData.owner_name || pendingFormData.business_name || ""}
          paymentType="vendor_booth"
          itemId="pending"
          itemName={getSelectedSpacesSummary()}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          paymentBreakdown={{
            subtotal: getTotalPrice(),
            fee: paystackService.calculatePaystackFee(getTotalPrice()),
            total: getTotalPrice() + paystackService.calculatePaystackFee(getTotalPrice())
          }}
        />
      )}
    </div>
  );
}