"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEventTracking } from "@/hooks/useAnalytics";
import { PaymentButton } from "@/components/PaymentButton";
import { PaymentModal } from "@/components/PaymentModal";
import { paystackService } from "@/lib/paystack";

interface ContestantFormData {
  full_name: string;
  email: string;
  phone: string;
  age: number;
  bio: string;
  headshot_url?: string;
  full_body_url?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_reference?: string;
}

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ContestantFormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{
    headshot?: File;
    fullBody?: File;
  }>({});
  const [message, setMessage] = useState("");
  
  const { trackPageantApplicationStart, trackPageantApplicationSubmit } = useEventTracking();
  
  // Pageant application fee - ₦25,000
  const PAGEANT_FEE = 25000;

  // Track when form is opened
  useEffect(() => {
    trackPageantApplicationStart();
  }, []);

  // Helper function to upload and return public URL
  const uploadFile = async (file: File | null, label: string, email: string) => {
    if (!file) return null;

    const filePath = `contestants/${email}/${label}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("pageant-files")
      .upload(filePath, file);

    if (error) {
      console.error(`❌ Upload error (${label}):`, error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("pageant-files")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formDataSubmit = new FormData(form);

    const contestantData: Partial<ContestantFormData> = {
      full_name: String(formDataSubmit.get("full_name") || "").trim(),
      email: String(formDataSubmit.get("email") || "").trim(),
      phone: String(formDataSubmit.get("phone") || "").trim(),
      age: Number(formDataSubmit.get("age") || 0),
      bio: String(formDataSubmit.get("bio") || "").trim(),
      payment_status: 'pending'
    };

    // Validate required fields
    if (!contestantData.full_name || !contestantData.email || !contestantData.age || !contestantData.bio) {
      setMessage("❌ Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Store files for upload after payment
    const headshot = formDataSubmit.get("headshot") as File | null;
    const fullBody = formDataSubmit.get("full_body") as File | null;
    
    if (!headshot || !fullBody) {
      setMessage("❌ Please upload both headshot and full body photos");
      setLoading(false);
      return;
    }

    setUploadedFiles({
      headshot: headshot,
      fullBody: fullBody
    });

    setFormData(contestantData);
    setShowPaymentModal(true);
    setLoading(false);
  };

  const registerContestant = async (contestantData: Partial<ContestantFormData>) => {
    try {
      setLoading(true);

      // Upload files
      const headshotUrl = await uploadFile(uploadedFiles.headshot || null, "headshot", contestantData.email || "");
      const fullBodyUrl = await uploadFile(uploadedFiles.fullBody || null, "fullbody", contestantData.email || "");

      // Insert contestant into DB
      const { data, error } = await supabase.from("pageant_contestants").insert([
        {
          ...contestantData,
          headshot_url: headshotUrl,
          full_body_url: fullBodyUrl,
        },
      ]).select().single();

      if (error) {
        setMessage("❌ Error saving contestant: " + error.message);
      } else {
        // Track successful application submission
        trackPageantApplicationSubmit(contestantData.age || 0);
        setMessage("✅ Registration submitted successfully! Welcome to Miss Groovy December 2024!");
        
        // Reset form
        setFormData({});
        setUploadedFiles({});
        (document.getElementById('pageant-form') as HTMLFormElement)?.reset();
      }
    } catch (err: any) {
      setMessage("❌ Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    // Update contestant data with payment information
    const updatedContestantData = {
      ...formData,
      payment_status: 'paid' as const,
      payment_reference: paymentData.transactionReference
    };

    await registerContestant(updatedContestantData);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👑 Miss Groovy December 2024
          </h1>
          <p className="text-lg text-gray-600">
            Join Nigeria's Premier Beauty Pageant
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
            Application Fee: ₦{PAGEANT_FEE.toLocaleString()}
          </div>
        </div>

        {/* Application Requirements */}
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">📋 Application Requirements</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Age 18-26 years old
            </div>
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Nigerian citizen or resident
            </div>
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              High-quality headshot photo
            </div>
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Full body photo in formal attire
            </div>
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Personal bio (max 200 words)
            </div>
            <div className="flex items-start">
              <span className="text-pink-500 mr-2">•</span>
              Application fee payment
            </div>
          </div>
        </div>

        <form id="pageant-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                name="full_name"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Your full legal name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                name="age"
                type="number"
                min="18"
                max="26"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="18-26 years"
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
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="contestant@example.com"
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
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Bio *
            </label>
            <textarea
              name="bio"
              required
              rows={4}
              maxLength={200}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Tell us about yourself, your interests, goals, and why you want to be Miss Groovy December (max 200 words)..."
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 200 words</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headshot Photo *
              </label>
              <input
                type="file"
                name="headshot"
                accept="image/*"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Professional headshot, high resolution (JPG, PNG)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Body Photo *
              </label>
              <input
                type="file"
                name="full_body"
                accept="image/*"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Full body photo in formal attire (JPG, PNG)
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-pink-50 p-6 rounded-lg">
            <h4 className="font-semibold text-pink-900 mb-3">
              💳 Application Fee Payment
            </h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-pink-700">Application Fee</span>
              <span className="font-bold text-pink-900">
                ₦{PAGEANT_FEE.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-pink-700">Processing Fee</span>
              <span className="font-bold text-pink-900">
                ₦{paystackService.calculatePaystackFee(PAGEANT_FEE).toLocaleString()}
              </span>
            </div>
            <hr className="border-pink-200 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-pink-700">Total</span>
              <span className="font-bold text-pink-900 text-lg">
                ₦{(PAGEANT_FEE + paystackService.calculatePaystackFee(PAGEANT_FEE)).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-pink-600 mt-2">
              Secure payment processed by Paystack. All major payment methods accepted.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <PaymentButton
              amount={PAGEANT_FEE}
              description="Miss Groovy December 2024 - Application Fee"
              customerEmail={formData.email || ""}
              customerName={formData.full_name || ""}
              paymentType="pageant_application"
              itemId="pending"
              itemName="Miss Groovy December Application"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              disabled={loading}
              className="w-full py-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              buttonText="Pay Application Fee & Submit"
            />
          </div>

          <p className="text-xs text-gray-500 text-center">
            By submitting this application, you agree to our terms and conditions and 
            confirm that all information provided is accurate.
          </p>
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
      {showPaymentModal && formData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={PAGEANT_FEE}
          description="Miss Groovy December 2024 - Application Fee"
          customerEmail={formData.email || ""}
          customerName={formData.full_name || ""}
          paymentType="pageant_application"
          itemId="pending"
          itemName="Miss Groovy December Application"
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          paymentBreakdown={{
            subtotal: PAGEANT_FEE,
            fee: paystackService.calculatePaystackFee(PAGEANT_FEE),
            total: PAGEANT_FEE + paystackService.calculatePaystackFee(PAGEANT_FEE)
          }}
        />
      )}
    </div>
  );
}
