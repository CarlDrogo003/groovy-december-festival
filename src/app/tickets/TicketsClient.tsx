'use client';

import { useState } from 'react';
import { PaystackPaymentService, FestivalPaymentConfig } from '@/lib/paystack';
import Link from 'next/link';
import ContactEventFooter from '@/components/ContactEventFooter';

interface TicketType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  color: string;
  gradient: string;
  popular?: boolean;
  description: string;
  icon: string;
  maxQuantity: number;
}

const ticketTypes: TicketType[] = [
  {
    id: 'student',
    name: 'Student Pass',
    price: 15000,
    originalPrice: 25000,
    features: [
      'Access to all public events',
      'Student networking sessions',
      'Basic festival merchandise',
      'Digital certificate',
      'Access to cultural shows',
      'Food court discounts'
    ],
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Perfect for students wanting to experience the festival',
    icon: '🎓',
    maxQuantity: 4
  },
  {
    id: 'regular',
    name: 'Regular Pass',
  price: 2000,
    features: [
      'Access to all public events',
      'Priority seating at concerts',
      'Festival merchandise package',
      'Welcome drink voucher',
      'Access to all cultural shows',
      'Networking session access',
      'Digital photo memories'
    ],
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    popular: true,
    description: 'The complete festival experience for everyone',
    icon: '🎫',
    maxQuantity: 8
  },
  {
    id: 'vip',
    name: 'VIP Experience',
    price: 75000,
    features: [
      'Premium seating at all events',
      'VIP lounge access',
      'Meet & greet with performers',
      'Exclusive VIP merchandise',
      'Complimentary food & drinks',
      'Priority parking',
      'Dedicated VIP entrance',
      'Professional photo session',
      'VIP networking dinner'
    ],
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Ultimate luxury festival experience',
    icon: '👑',
    maxQuantity: 4
  },
  {
    id: 'premium',
    name: 'Premium All-Access',
    price: 120000,
    features: [
      'All VIP benefits included',
      'Backstage access passes',
      'Private artist meet sessions',
      'Premium gift package',
      'Concierge service',
      'Luxury transport to venues',
      'Exclusive after-parties',
      'Professional video coverage',
      'Certificate of recognition',
      'Lifetime festival membership'
    ],
    color: 'red',
    gradient: 'from-red-500 to-red-600',
    description: 'The ultimate festival experience with exclusive access',
    icon: '💎',
    maxQuantity: 2
  }
];

const groupDiscounts = [
  { min: 5, discount: 10, label: '5+ Tickets: 10% OFF' },
  { min: 10, discount: 15, label: '10+ Tickets: 15% OFF' },
  { min: 20, discount: 20, label: '20+ Tickets: 20% OFF' }
];

export default function TicketsClient() {
  const [selectedTicket, setSelectedTicket] = useState<string>('regular');
  const [quantity, setQuantity] = useState<number>(1);
  const [buyerInfo, setBuyerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const currentTicket = ticketTypes.find(t => t.id === selectedTicket)!;
  const subtotal = currentTicket.price * quantity;
  
  // Calculate group discount
  const applicableDiscount = groupDiscounts
    .filter(d => quantity >= d.min)
    .reduce((max, current) => current.discount > max.discount ? current : max, { discount: 0 });
  
  const discountAmount = subtotal * (applicableDiscount.discount / 100);
  const total = subtotal - discountAmount;

  const handleBuyTickets = () => {
    setShowForm(true);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let paymentConfig: FestivalPaymentConfig | undefined;
    try {
      const paymentService = PaystackPaymentService.getInstance();
      paymentConfig = {
        type: 'general',
        itemName: `${currentTicket.name} (×${quantity}) - Groovy December Festival 2025`,
        customerDetails: {
          fullName: buyerInfo.fullName,
          email: buyerInfo.email,
          phone: buyerInfo.phone,
        },
        amount: total,
        description: `${quantity} × ${currentTicket.name} ticket${quantity > 1 ? 's' : ''} for Groovy December Festival 2025`,
        metadata: {
          type: 'ticket_purchase',
          ticketType: selectedTicket,
          quantity: quantity,
          buyerName: buyerInfo.fullName,
          buyerPhone: buyerInfo.phone,
          buyerOrganization: buyerInfo.organization || 'Individual',
          discountApplied: applicableDiscount.discount,
          originalAmount: subtotal,
          finalAmount: total
        }
      };

      // Log payment config for debugging
      console.log('Payment Configuration:', {
        type: paymentConfig.type,
        amount: paymentConfig.amount,
        customerEmail: paymentConfig.customerDetails.email,
        hasPaystackKey: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      });

      await paymentService.initializeFestivalPayment(paymentConfig);
      
      // Reset form on successful payment initialization
      setBuyerInfo({
        fullName: '',
        email: '',
        phone: '',
        organization: ''
      });
      setShowForm(false);
      
    } catch (error) {
      console.error('Payment error details:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        paymentConfig: paymentConfig
      });
      
      // More specific error message
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      alert(`Payment Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center"
              >
                ← Back to tickets
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span>{currentTicket.icon} {currentTicket.name}</span>
                <span>×{quantity}</span>
                <span className="font-semibold">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerInfo.fullName}
                  onChange={(e) => setBuyerInfo(prev => ({...prev, fullName: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={buyerInfo.email}
                  onChange={(e) => setBuyerInfo(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Institution (Optional)
                </label>
                <input
                  type="text"
                  value={buyerInfo.organization}
                  onChange={(e) => setBuyerInfo(prev => ({...prev, organization: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Company, University, etc."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Subtotal ({quantity}x {currentTicket.name})</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {applicableDiscount.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Group Discount ({applicableDiscount.discount}%)</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Important:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>Tickets are non-refundable but transferable</li>
                      <li>You'll receive digital tickets via email after payment</li>
                      <li>Valid ID required at festival entrance</li>
                      <li>Festival dates: December 15-31, 2025</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-600 to-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₦${total.toLocaleString()} with Paystack`
                )}
              </button>

              <div className="text-center text-xs text-gray-500">
                Secure payment powered by Paystack • SSL encrypted
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            DECEMBER 15-31, 2025 • ABUJA, NIGERIA
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Festival <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400">Tickets</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Get your entry pass to Africa's ultimate end-of-year celebration
          </p>
          <p className="text-green-300 font-medium">
            🎪 17 Days • 30+ Events • 10,000+ Festival-goers Expected
          </p>
        </div>
      </section>

      {/* Group Discounts Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-semibold">
            <span className="flex items-center">
              🎯 GROUP DISCOUNTS:
            </span>
            {groupDiscounts.map((discount, index) => (
              <span key={index} className="bg-white/20 px-3 py-1 rounded-full">
                {discount.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Ticket Types */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Experience</h2>
              <div className="grid gap-6">
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                      selectedTicket === ticket.id
                        ? 'border-green-500 shadow-xl transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    {ticket.popular && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`text-3xl bg-gradient-to-r ${ticket.gradient} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl`}>
                          {ticket.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{ticket.name}</h3>
                          <p className="text-gray-600 text-sm">{ticket.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {ticket.originalPrice && (
                          <div className="text-gray-400 line-through text-sm">₦{ticket.originalPrice.toLocaleString()}</div>
                        )}
                        <div className="text-2xl font-bold text-gray-900">₦{ticket.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {ticket.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className={`mt-4 w-6 h-6 rounded-full border-2 ${
                      selectedTicket === ticket.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    } absolute top-6 right-6 flex items-center justify-center`}>
                      {selectedTicket === ticket.id && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Selection</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{currentTicket.name}</span>
                    <span>₦{currentTicket.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Quantity</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(currentTicket.maxQuantity, quantity + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Max {currentTicket.maxQuantity} tickets per purchase
                  </div>

                  <hr />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>

                  {applicableDiscount.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Group Discount ({applicableDiscount.discount}%)</span>
                      <span>-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBuyTickets}
                  className={`w-full bg-gradient-to-r ${currentTicket.gradient} text-white py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  Get Tickets Now
                </button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Secure payment • Instant digital delivery • SSL encrypted
                </div>

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Instant ticket delivery
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mobile-friendly tickets
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Customer support included
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎪</span>
                What's Included
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Access to festival grounds for all 17 days</li>
                <li>• Entry to public performances and cultural shows</li>
                <li>• Welcome package with festival map and schedule</li>
                <li>• Access to food courts and vendor areas</li>
                <li>• Digital festival memories and photo opportunities</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Important Information
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Valid government-issued ID required for entry</li>
                <li>• Tickets are transferable but non-refundable</li>
                <li>• Children under 12 enter free with adult ticket</li>
                <li>• Festival location: Multiple venues across Abuja</li>
                <li>• Detailed event schedule sent after purchase</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What's the difference between festival tickets and event registration?</h3>
              <p className="text-gray-600">Festival tickets give you general access to the festival grounds and public events. Event registration is for vendors, performers, or pageant contestants who want to participate actively in specific events.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade my ticket later?</h3>
              <p className="text-gray-600">Yes! Contact our support team to upgrade your ticket. You'll only pay the difference in price.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Are there age restrictions?</h3>
              <p className="text-gray-600">The festival is family-friendly. Children under 12 enter free with an adult ticket. Some evening events may have age restrictions which will be clearly marked.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What if it rains?</h3>
              <p className="text-gray-600">The festival continues rain or shine! We have covered venues and indoor alternatives for all major events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you with any questions about tickets or the festival.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span>+2348030596162</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>tickets@groovydecember.ng</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💬</span>
              <span>WhatsApp: +2348033013624</span>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/contact" className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-red-700 transition-all duration-300">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <ContactEventFooter />
    </div>
  );
}