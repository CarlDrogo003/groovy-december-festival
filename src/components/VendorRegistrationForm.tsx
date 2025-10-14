"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PaymentButton } from "@/components/PaymentButton";
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
}

interface VendorPackageOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export default function VendorRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<VendorPackageOption | null>(null);
  const [formData, setFormData] = useState<Partial<VendorFormData>>({});

  const vendorPackages: VendorPackageOption[] = [
    {
      id: "starter",
      name: "Starter Package",
      price: 75000,
      description: "Perfect for first-time vendors or small businesses testing the waters",
      features: [
        "8ft x 8ft booth space",
        "1 display table",
        "2 chairs",
        "Power outlet access",
        "Basic signage support",
        "Event marketing inclusion",
        "3-day festival access"
      ]
    },
    {
      id: "professional",
      name: "Professional Package",
      price: 150000,
      description: "Most popular choice for serious vendors looking to maximize their impact",
      features: [
        "10ft x 10ft premium booth",
        "Corner or high-traffic location",
        "Display table + shelving",
        "4 chairs + storage space",
        "LED lighting package",
        "Multiple power outlets",
        "Professional signage",
        "Social media promotion",
        "Setup & breakdown help",
        "3-day festival access"
      ]
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 250000,
      description: "VIP experience with maximum visibility and exclusive benefits",
      features: [
        "12ft x 12ft prime location",
        "Corner spot with maximum visibility",
        "Complete furniture package",
        "Premium LED lighting",
        "Multiple power & internet",
        "Professional backdrop",
        "VIP marketing package",
        "Dedicated support staff",
        "Setup, maintenance & breakdown",
        "VIP vendor networking events",
        "3-day festival access",
        "Post-event analytics report"
      ]
    }
  ];

  const handlePackageSelection = (pkg: VendorPackageOption) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({ ...prev, package: pkg.name }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formDataSubmit = new FormData(form);
    
    const vendorData: Partial<VendorFormData> = {
      business_name: String(formDataSubmit.get("business_name") || "").trim(),
      owner_name: String(formDataSubmit.get("owner_name") || "").trim(),
      email: String(formDataSubmit.get("email") || "").trim(),
      phone: String(formDataSubmit.get("phone") || "").trim(),
      package: selectedPackage?.name || "",
      business_type: String(formDataSubmit.get("business_type") || "").trim(),
      business_description: String(formDataSubmit.get("business_description") || "").trim(),
      years_in_business: String(formDataSubmit.get("years_in_business") || "").trim(),
      products_services: String(formDataSubmit.get("products_services") || "").trim(),
      payment_status: 'pending'
    };

    setFormData(vendorData);

    // If selected package has a cost, show payment modal
    if (selectedPackage && selectedPackage.price > 0) {
      setShowPaymentModal(true);
      setLoading(false);
      return;
    }

    // For free packages or no package selected, register directly
    await registerVendor(vendorData);
  };

  const registerVendor = async (vendorData: Partial<VendorFormData>) => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .insert([vendorData])
        .select()
        .single();

      if (error) {
        setMessage("❌ Error: " + error.message);
      } else {
        setMessage("✅ Registration successful! We'll contact you soon.");
        // Reset form
        setFormData({});
        setSelectedPackage(null);
        (document.getElementById('vendor-form') as HTMLFormElement)?.reset();
      }
    } catch (err: any) {
      setMessage("❌ Unexpected error: " + (err?.message ?? String(err)));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    // Update vendor data with payment information
    const updatedVendorData = {
      ...formData,
      payment_status: 'paid' as const,
      payment_reference: paymentData.transactionReference
    };

    await registerVendor(updatedVendorData);
    setShowPaymentModal(false);
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
        </div>

        {/* Package Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Choose Your Package
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {vendorPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handlePackageSelection(pkg)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                  <input
                    type="radio"
                    name="package_selection"
                    value={pkg.id}
                    checked={selectedPackage?.id === pkg.id}
                    onChange={() => handlePackageSelection(pkg)}
                    className="text-green-600"
                  />
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  ₦{pkg.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {pkg.description}
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  <li className="text-gray-400">
                    +{pkg.features.length - 3} more features
                  </li>
                </ul>
              </div>
            ))}
          </div>
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
          {selectedPackage && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Payment Summary
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-green-700">{selectedPackage.name}</span>
                <span className="font-bold text-green-900">
                  ₦{selectedPackage.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Payment will be processed securely through Paystack
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            {selectedPackage && selectedPackage.price > 0 ? (
              <PaymentButton
                amount={selectedPackage.price}
                description={`Vendor Registration - ${selectedPackage.name}`}
                customerEmail=""
                customerName=""
                paymentType="vendor_booth"
                itemId="pending"
                itemName={selectedPackage.name}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                disabled={loading}
                className="w-full py-4 text-lg"
              />
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
                  loading 
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
                    Submitting...
                  </span>
                ) : "Register as Vendor"}
              </button>
            )}
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
      {showPaymentModal && selectedPackage && formData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={selectedPackage.price}
          description={`Vendor Registration - ${selectedPackage.name}`}
          customerEmail={formData.email || ""}
          customerName={formData.owner_name || ""}
          paymentType="vendor_booth"
          itemId="pending"
          itemName={selectedPackage.name}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          paymentBreakdown={{
            subtotal: selectedPackage.price,
            fee: paystackService.calculatePaystackFee(selectedPackage.price),
            total: selectedPackage.price + paystackService.calculatePaystackFee(selectedPackage.price)
          }}
        />
      )}
    </div>
  );
}