"use client";

import { useEffect, useState } from "react";
// For live exchange rate (Frankfurter API, free)
const EXCHANGE_API_URL = "https://api.frankfurter.app/latest?from=USD&to=NGN";
import PaymentModal from "@/components/PaymentModal";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import ContactEventFooter from '@/components/ContactEventFooter';

interface DiasporaPackage {
  id: string;
  name: string;
  price_usd: number;
  duration: string;
  description: string;
  benefits: string[];
  image?: string;
  popular?: boolean;
  discount_eligible?: boolean;
}

interface ReferralData {
  referral_code: string;
  referrer_name: string;
  referrer_email: string;
  total_referrals: number;
  earnings_usd: number;
  status: 'active' | 'pending';
}

export default function DiasporaPage() {
  const [packages, setPackages] = useState<DiasporaPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<DiasporaPackage | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ngnAmount, setNgnAmount] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  // Sample diaspora packages data
  const diasporaPackages: DiasporaPackage[] = [
    {
      id: "platinum",
      name: "Platinum",
      price_usd: 5000,
      duration: "1 Week",
      description: "5-Star Accommodation & Breakfast + Dinner, Chauffeur Driven Vehicle + Security, Access to all events, 5 Groovy December Merchandise, Access to VIP Lounge, Selfie with Ex Football Internationals, Local Airline Return Ticket, Accident Insurance, Access to knock & Eat.",
      benefits: [
        "5-Star Accommodation & Breakfast + Dinner",
        "Chauffeur Driven Vehicle + Security",
        "Access to all events",
        "5 Groovy December Merchandise",
        "Access to VIP Lounge",
        "Selfie with Ex Football Internationals",
        "Local Airline Return Ticket",
        "Accident Insurance",
        "Access to knock & Eat"
      ],
      popular: true,
      discount_eligible: true
    },
    {
      id: "gold",
      name: "Gold",
      price_usd: 2000,
      duration: "1 Week",
      description: "3-4 Star Accommodation + Breakfast & Dinner, 3 Groovy December Merchandise, Access to all events, VIP Lounge, Selfie with Ex Football Internationals, Accident Insurance, Local Airline Return Ticket, Access to knock & Eat, Chauffeur Driven Car.",
      benefits: [
        "3-4 Star Accommodation + Breakfast & Dinner",
        "3 Groovy December Merchandise",
        "Access to all events",
        "VIP Lounge",
        "Selfie with Ex Football Internationals",
        "Accident Insurance",
        "Local Airline Return Ticket",
        "Access to knock & Eat",
        "Chauffeur Driven Car"
      ],
      discount_eligible: true
    },
    {
      id: "silver",
      name: "Silver",
      price_usd: 1000,
      duration: "1 Week",
      description: "2-3 Star Accommodation + Breakfast & Dinner, Access to all events, Selfie with Ex Football Internationals, 2 Groovy December Merchandise, Access to knock & Eat, Local Airline Return Ticket, Accident Insurance.",
      benefits: [
        "2-3 Star Accommodation + Breakfast & Dinner",
        "Access to all events",
        "Selfie with Ex Football Internationals",
        "2 Groovy December Merchandise",
        "Access to knock & Eat",
        "Local Airline Return Ticket",
        "Accident Insurance"
      ],
      discount_eligible: true
    },
    {
      id: "bronze",
      name: "Bronze",
      price_usd: 500,
      duration: "3 Days",
      description: "Access to all events, Selfie with Ex Football Internationals, Access to knock & Eat, 2 Groovy December Merchandise.",
      benefits: [
        "Access to all events",
        "Selfie with Ex Football Internationals",
        "Access to knock & Eat",
        "2 Groovy December Merchandise"
      ],
      discount_eligible: true
    },
    {
      id: "family-five",
      name: "Family Package (Five)",
      price_usd: 5000,
      duration: "1 Week",
      description: "Family of Five: 3-bedroom Apartment, Access to all events, Chauffeur Driven Vehicle + Security, 10 Groovy December Merchandise, Accident Insurance, Selfie with Ex Football Internationals, Access to VIP Lounge, Access to knock & Eat. Optional: Pay extra $2000 to enjoy breakfast & dinner.",
      benefits: [
        "3-bedroom Apartment",
        "Access to all events",
        "Chauffeur Driven Vehicle + Security",
        "10 Groovy December Merchandise",
        "Accident Insurance",
        "Selfie with Ex Football Internationals",
        "Access to VIP Lounge",
        "Access to knock & Eat",
        "Optional: Pay extra $2000 for breakfast & dinner"
      ],
      discount_eligible: true
    },
    {
      id: "family-three",
      name: "Family Package (Three)",
      price_usd: 4000,
      duration: "1 Week",
      description: "Family of Three: 2-bedroom Apartment, Access to all events, Chauffeur Driven Vehicle + Security, 7 Groovy December Merchandise, Accident Insurance, Selfie with Ex Football Internationals, Access to VIP Lounge, Access to knock & Eat. Optional: Pay extra $1500 to enjoy breakfast & dinner.",
      benefits: [
        "2-bedroom Apartment",
        "Access to all events",
        "Chauffeur Driven Vehicle + Security",
        "7 Groovy December Merchandise",
        "Accident Insurance",
        "Selfie with Ex Football Internationals",
        "Access to VIP Lounge",
        "Access to knock & Eat",
        "Optional: Pay extra $1500 for breakfast & dinner"
      ],
      discount_eligible: true
    }
  ];

  useEffect(() => {
    setPackages(diasporaPackages);
    setLoading(false);
    
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, []);

  const validateReferralCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('diaspora_referrals')
        .select('*')
        .eq('referral_code', code)
        .eq('status', 'active')
        .single();

      if (!error && data) {
        setDiscount(15); // 15% discount for valid referrals
        setMessage(`🎉 Great! You get 15% off with ${data.referrer_name}'s referral!`);
      }
    } catch (err) {
      console.log('Referral code not found or invalid');
    }
  };

  const generateReferralCode = (name: string) => {
    return name.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingRate(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const referral_code = String(formData.get("referral_code") || "").trim() || null;
    const booking = {
      package_id: selectedPackage?.id,
      package_name: selectedPackage?.name,
      full_name: String(formData.get("full_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      travelers: Number(formData.get("travelers") || 1),
      referral_code,
      original_price: selectedPackage?.price_usd || 0,
      discounted_price: discount > 0 ? (selectedPackage?.price_usd || 0) * (1 - discount/100) : selectedPackage?.price_usd || 0,
      special_requests: String(formData.get("special_requests") || "").trim(),
    };
    setPendingBooking(booking);
    // Fetch live USD/NGN rate with timeout and fallback
    const FIXED_RATE = 1500; // fallback rate
    let didTimeout = false;
    try {
      const fetchWithTimeout = (url: string, ms: number) => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            didTimeout = true;
            reject(new Error('timeout'));
          }, ms);
          fetch(url)
            .then(response => response.json())
            .then(data => {
              clearTimeout(timer);
              resolve(data);
            })
            .catch(err => {
              clearTimeout(timer);
              reject(err);
            });
        });
      };
      const data: any = await fetchWithTimeout(EXCHANGE_API_URL, 5000);
      // Frankfurter API: { rates: { NGN: <rate> }, ... }
      const rate = data?.rates?.NGN || null;
      if (rate) {
        const ngn = Math.round(booking.discounted_price * rate);
        setNgnAmount(ngn);
        setShowPaymentModal(true);
      } else {
        setMessage("❌ Could not fetch exchange rate. Using fallback rate.");
        const ngn = Math.round(booking.discounted_price * FIXED_RATE);
        setNgnAmount(ngn);
        setShowPaymentModal(true);
      }
    } catch (err) {
      setMessage(didTimeout ? "❌ Exchange rate fetch timed out. Using fallback rate." : "❌ Error fetching exchange rate. Using fallback rate.");
      const ngn = Math.round(booking.discounted_price * FIXED_RATE);
      setNgnAmount(ngn);
      setShowPaymentModal(true);
    } finally {
      setLoadingRate(false);
    }
  };

  // After successful payment, save booking
  const handlePaymentSuccess = async () => {
    if (!pendingBooking) return;
    try {
      const { error } = await supabase.from("diaspora_bookings").insert([pendingBooking]);
      if (error) {
        setMessage("❌ Error: " + error.message);
      } else {
        // Update referral count if referral was used
        if (pendingBooking.referral_code) {
          await supabase.rpc('increment_referral_count', { 
            ref_code: pendingBooking.referral_code,
            booking_amount: pendingBooking.discounted_price 
          });
        }
        setMessage("✅ Booking successful! Payment received. We'll contact you with details.");
        setSelectedPackage(null);
      }
    } catch (err: any) {
      setMessage("❌ Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setPendingBooking(null);
      setShowPaymentModal(false);
    }
  };

  const handleCreateReferral = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const referrerName = String(formData.get("referrer_name") || "").trim();
    const referrerEmail = String(formData.get("referrer_email") || "").trim();
    const generatedCode = generateReferralCode(referrerName);
    
    const referralData = {
      referral_code: generatedCode,
      referrer_name: referrerName,
      referrer_email: referrerEmail,
      total_referrals: 0,
      earnings_usd: 0,
      status: 'active'
    };

    try {
      const { error } = await supabase.from("diaspora_referrals").insert([referralData]);
      if (error) {
        setMessage("❌ Error creating referral: " + error.message);
      } else {
        setReferralData(referralData as ReferralData);
        setMessage("✅ Referral code created successfully!");
        form.reset();
      }
    } catch (err: any) {
      setMessage("❌ Unexpected error: " + (err?.message ?? String(err)));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading diaspora packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-900 via-red-900 to-yellow-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Welcome Home, Diaspora Family
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Come Home to <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Africa</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Reconnect with your roots at Africa's premier end-of-year celebration. Specially curated packages for our diaspora family with exclusive experiences, cultural immersion, and unforgettable memories.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#packages"
                className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300"
              >
                Explore Packages
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Club Tour Headline Event Section */}
      <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            THE ADRENALINE PUMPING “CLUB TOUR” YOU DON’T WANNA MISS!
          </h2>
          <div className="bg-white/10 rounded-xl shadow-lg p-6 sm:p-10 mb-4">
            <p className="text-lg sm:text-xl text-white font-medium mb-4">
              This December, Abuja explodes with the <span className="font-bold text-yellow-300">48 Hours Club Tour – Groovy December 2025</span>: the city’s wildest, most exclusive nightlife marathon ever. Six elite clubs. Forty-eight hours of non-stop luxury partying. From red-carpet champagne kickoffs and rooftop sunrise raves to poolside takeovers and a celebrity-stacked grand finale, every chapter is designed for thrill-seekers who demand more than ordinary nightlife. The legendary Party Bus keeps the fire alive between stops – a moving nightclub with DJs, dancers, and drinks that never stop flowing.
            </p>
            <p className="text-base sm:text-lg text-white mb-4">
              Created for foreign jet-setters and elitist Nigerians home for December, this isn’t just a party – it’s a rite of passage. Only <span className="font-bold text-yellow-300">100 people</span> will earn bragging rights to the most premium experience Abuja has ever staged. No random crowd, no guest list – just the elites who live for unforgettable December stories. The 48 Hours Club Tour is not an event… <span className="italic text-yellow-200">it’s history in the making.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Referral Benefits Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎁 Diaspora Referral Program
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="font-semibold text-gray-900">Refer Friends</h3>
                <p className="text-sm text-gray-600">Share your unique referral code with diaspora friends and family</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-gray-900">Earn Rewards</h3>
                <p className="text-sm text-gray-600">Get $50 for each successful booking + they get 15% off</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-900">VIP Status</h3>
                <p className="text-sm text-gray-600">Top referrers get exclusive VIP upgrades and bonuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diaspora Packages Grid */}
      <div id="packages" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ✈️ Diaspora Homecoming Packages
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Thoughtfully designed experiences that honor your journey and celebrate your return home.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {packages.map((pkg) => (
              <article key={pkg.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
                {pkg.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      🔥 Most Popular
                    </span>
                  </div>
                )}
                
                {/* Package Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">{pkg.name} Experience</p>
                    </div>
                  </div>
                </div>

                {/* Package Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {pkg.description}
                  </p>

                  {/* Price Display */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      {discount > 0 && referralCode ? (
                        <>
                          <span className="text-2xl font-bold text-green-600">
                            ${(pkg.price_usd * (1 - discount/100)).toFixed(0)}
                          </span>
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            ${pkg.price_usd}
                          </span>
                          <span className="ml-2 text-sm text-green-600 font-medium">
                            ({discount}% off!)
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          ${pkg.price_usd}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">per person</p>
                  </div>

                  {/* Key Benefits */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Package Highlights:</h4>
                    <ul className="space-y-1">
                      {pkg.benefits.slice(0, 4).map((benefit, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <svg className="mr-1 h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                      {pkg.benefits.length > 4 && (
                        <li className="text-xs text-gray-500">
                          +{pkg.benefits.length - 4} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Book Your Homecoming
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Code Input Section */}
      {/* Standalone referral code section removed. Referral code will be entered during package registration only. */}

      {/* Booking Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedPackage(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Book {selectedPackage.name}
                  </h3>
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Package Price:</span>
                      <div>
                        {discount > 0 && referralCode ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              ${(selectedPackage.price_usd * (1 - discount/100)).toFixed(0)}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ${selectedPackage.price_usd}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${selectedPackage.price_usd}
                          </span>
                        )}
                      </div>
                    </div>
                    {discount > 0 && referralCode && (
                      <p className="text-sm text-green-600 mt-2">
                        🎉 You're saving ${(selectedPackage.price_usd * (discount/100)).toFixed(0)} with referral code!
                      </p>
                    )}
                  </div>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        name="full_name"
                        placeholder="Full Name *"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address *"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        name="travelers"
                        type="number"
                        min="1"
                        defaultValue="1"
                        placeholder="Number of Travelers"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    {/* Referral Code Input */}
                    <input
                      name="referral_code"
                      placeholder="Referral Code (if any)"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                      maxLength={32}
                      autoComplete="off"
                    />
                    <textarea
                      name="special_requests"
                      placeholder="Special requests or dietary requirements..."
                      rows={3}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal for Diaspora Booking */}
      {showPaymentModal && pendingBooking && ngnAmount && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => { setShowPaymentModal(false); setPendingBooking(null); setNgnAmount(null); }}
          amount={ngnAmount}
          description={`Diaspora Package: ${pendingBooking.package_name}`}
          customerEmail={pendingBooking.email}
          customerName={pendingBooking.full_name}
          paymentType="diaspora"
          itemId={pendingBooking.package_id}
          itemName={pendingBooking.package_name}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={() => { setShowPaymentModal(false); setPendingBooking(null); setNgnAmount(null); setMessage('❌ Payment was not completed.'); }}
        />
      )}

      {/* Loading exchange rate spinner */}
      {loadingRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Fetching live exchange rate...</span>
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

      {/* Referral Creation Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowReferralModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎁 Create Your Referral Code
                  </h3>
                  
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">How it works:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Share your code with diaspora friends</li>
                      <li>• They get 15% off their package</li>
                      <li>• You earn $50 for each booking</li>
                      <li>• Track your earnings in real-time</li>
                    </ul>
                  </div>
                  
                  {!referralData ? (
                    <form onSubmit={handleCreateReferral} className="space-y-4">
                      <input
                        name="referrer_name"
                        placeholder="Your Full Name *"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <input
                        name="referrer_email"
                        type="email"
                        placeholder="Your Email Address *"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowReferralModal(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                        >
                          Generate Code
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center">
                      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Your Referral Code:</h4>
                        <div className="text-3xl font-bold text-green-600 mb-4">
                          {referralData.referral_code}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Share this code or send this link:
                        </p>
                        <div className="bg-white p-3 rounded border text-sm text-gray-700 break-all">
                          {window.location.origin}/diaspora?ref={referralData.referral_code}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{referralData.total_referrals}</div>
                          <div className="text-sm text-gray-600">Referrals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">${referralData.earnings_usd}</div>
                          <div className="text-sm text-gray-600">Earned</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/diaspora?ref=${referralData.referral_code}`);
                          setMessage("📋 Referral link copied to clipboard!");
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Copy Referral Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Why Diasporans Choose Groovy December
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Authentic Experience</h3>
                <p className="text-orange-100 text-sm">Genuine cultural immersion designed by locals for diaspora</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Community Connection</h3>
                <p className="text-orange-100 text-sm">Meet other diaspora and build lasting relationships</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Cultural Heritage</h3>
                <p className="text-orange-100 text-sm">Deep dive into traditions, history, and ancestral connections</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="font-semibold text-white mb-2">VIP Treatment</h3>
                <p className="text-orange-100 text-sm">Premium service and exclusive access throughout your stay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready for Your Homecoming?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Questions about packages or need help planning your journey? Our diaspora specialists are here to help.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300"
              >
                Contact Diaspora Team
              </Link>
              <Link
                href="tel:+234-xxx-xxx-xxxx"
                className="rounded-full border border-orange-200 px-8 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-all duration-300"
              >
                Call: +234-xxx-xxx-xxxx
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ContactEventFooter />
    </div>
  );
}