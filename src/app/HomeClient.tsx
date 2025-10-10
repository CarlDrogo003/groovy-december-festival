'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Tailwind UI Simple centered with background image */}
      <section className="relative bg-gray-900 py-24 sm:py-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea"/><stop offset="100%" style="stop-color:%23764ba2"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23a)" opacity="0.1"/><circle cx="200" cy="200" r="100" fill="%23ffffff" opacity="0.05"/><circle cx="800" cy="300" r="150" fill="%23ffffff" opacity="0.03"/><circle cx="400" cy="700" r="120" fill="%23ffffff" opacity="0.04"/></svg>')`
          }}
        ></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Date Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-600 to-red-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                December 15-31, 2025
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              GROOVY{' '}
              <span className="bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">
                DECEMBER
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-xl leading-8 text-gray-300 sm:text-2xl">
              Africa's Ultimate End-of-Year Festival
            </p>
            <p className="mt-2 text-lg text-green-300 font-medium italic">
              explore, enjoy and experience...
            </p>

            {/* Location */}
            <p className="mt-4 text-lg text-gray-400">
              Abuja, Nigeria • Seventeen Days of Culture, Business & Entertainment
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">17</div>
                <div className="mt-2 text-sm font-medium text-gray-400">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">30+</div>
                <div className="mt-2 text-sm font-medium text-gray-400">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">10K+</div>
                <div className="mt-2 text-sm font-medium text-gray-400">Expected</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                href="/events"
                className="rounded-full bg-gradient-to-r from-green-600 to-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transform hover:scale-105 transition-all duration-300"
              >
                Get Tickets
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-400">
                Join thousands of festival-goers for the celebration of the year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmed Performers Section - Enhanced with colorful accents */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-600 to-red-600 rounded-full"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              COMING SOON
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              CONFIRMED <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PERFORMERS</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              World-class artists and cultural icons bringing Africa's best to the stage
            </p>
          </div>

          {/* Placeholder for upcoming performer announcements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group hover:from-blue-50 hover:to-purple-50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    ANNOUNCED SOON
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation Options - Professional cards with color accents */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              HOW TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PARTICIPATE</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join Groovy December in the way that suits you best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Attend Events */}
            <Link href="/events" className="group">
              <div className="bg-white border-2 border-gray-100 p-8 text-center rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM9 9V6h2v3h3v2h-3v3H9v-3H6V9h3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  ATTEND EVENTS
                </h3>
                <p className="text-gray-600 mb-6">
                  Join us for concerts, conferences, cultural shows, and networking sessions
                </p>
                <span className="text-blue-600 font-bold group-hover:text-blue-700">
                  GET TICKETS →
                </span>
              </div>
            </Link>

            {/* Become Vendor */}
            <Link href="/vendors" className="group">
              <div className="bg-white border-2 border-gray-100 p-8 text-center rounded-2xl hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  BECOME VENDOR
                </h3>
                <p className="text-gray-600 mb-6">
                  Showcase your products and services to thousands of festival visitors
                </p>
                <span className="text-purple-600 font-bold group-hover:text-purple-700">
                  APPLY NOW →
                </span>
              </div>
            </Link>

            {/* Pageant Competition */}
            <Link href="/pageant" className="group">
              <div className="bg-white border-2 border-gray-100 p-8 text-center rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                  PAGEANT QUEEN
                </h3>
                <p className="text-gray-600 mb-6">
                  Compete for the crown in our prestigious beauty and talent competition
                </p>
                <span className="text-orange-600 font-bold group-hover:text-orange-700">
                  REGISTER →
                </span>
              </div>
            </Link>

            {/* Sponsor Event */}
            <Link href="/sponsors" className="group">
              <div className="bg-white border-2 border-gray-100 p-8 text-center rounded-2xl hover:border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  SPONSOR EVENT
                </h3>
                <p className="text-gray-600 mb-6">
                  Partner with us and reach thousands of potential customers
                </p>
                <span className="text-green-600 font-bold group-hover:text-green-700">
                  PARTNER WITH US →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Raffle Draw Section - Exciting manual event showcase */}
      <section className="py-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-1/3 w-14 h-14 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            {/* Live Badge */}
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
              <span>LIVE DRAW EVENT</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
              🎁 MEGA RAFFLE 🎁
            </h2>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto font-semibold">
              Win Amazing Prizes! Live Draw on New Year's Eve
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Grand Prize */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GRAND PRIZE</h3>
              <div className="text-4xl font-black text-orange-600 mb-2">$10,000</div>
              <p className="text-gray-600 font-semibold">Cash Prize + VIP Festival Package</p>
            </div>

            {/* Second Prize */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🥈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SECOND PRIZE</h3>
              <div className="text-3xl font-black text-orange-600 mb-2">$5,000</div>
              <p className="text-gray-600 font-semibold">Cash Prize + Festival Tickets</p>
            </div>

            {/* Third Prize */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🥉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">THIRD PRIZE</h3>
              <div className="text-3xl font-black text-orange-600 mb-2">$2,500</div>
              <p className="text-gray-600 font-semibold">Cash Prize + Merchandise</p>
            </div>
          </div>

          {/* Draw Information */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/30">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-3">📅</div>
                <h4 className="text-xl font-bold text-white mb-2">DRAW DATE</h4>
                <p className="text-yellow-100 font-semibold">December 31, 2025</p>
                <p className="text-yellow-200 text-sm">11:30 PM (Live on Stage)</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🎫</div>
                <h4 className="text-xl font-bold text-white mb-2">TICKET PRICE</h4>
                <p className="text-yellow-100 font-semibold text-2xl">₦1,000</p>
                <p className="text-yellow-200 text-sm">Limited to 10,000 tickets</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-xl font-bold text-white mb-2">TOTAL PRIZES</h4>
                <p className="text-yellow-100 font-semibold">50+ Winners</p>
                <p className="text-yellow-200 text-sm">Including consolation prizes</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
                <span className="text-white font-semibold">Tickets Available:</span>
                <span className="text-2xl font-black text-yellow-300">7,543 / 10,000</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-gray-900 px-10 py-4 rounded-full text-xl font-black hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl min-w-[200px] border-2 border-yellow-300">
                🎫 BUY TICKETS
              </button>
              <div className="flex items-center space-x-2 text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Must be present to win grand prize</span>
              </div>
            </div>

            <div className="mt-8 text-center text-white/80 text-sm">
              <p>🎪 <strong>Live Draw Experience:</strong> Join us on New Year's Eve for the most exciting raffle draw in Africa!</p>
              <p className="mt-2">📱 <strong>Digital Tickets:</strong> Secure, verified, and instantly delivered to your phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section - Professional tiered structure with colors */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              SPONSORS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-red-600">PARTNERS</span>
            </h2>
            <p className="text-lg text-gray-600">
              Join these amazing organizations supporting Africa's premier festival
            </p>
          </div>

          {/* Diamond Tier */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-red-600 text-white px-6 py-3 rounded-full text-lg font-bold">
                <span>💎</span>
                <span>DIAMOND</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-40 bg-white border-2 border-blue-200 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="text-gray-400 font-medium">DIAMOND SPONSOR LOGO</span>
              </div>
            </div>
          </div>

          {/* Gold Tier */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2 rounded-full text-base font-bold">
                <span>🥇</span>
                <span>GOLD</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="w-full h-32 bg-white border-2 border-yellow-200 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <span className="text-gray-400 font-medium">GOLD SPONSOR LOGO</span>
              </div>
              <div className="w-full h-32 bg-white border-2 border-yellow-200 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <span className="text-gray-400 font-medium">GOLD SPONSOR LOGO</span>
              </div>
            </div>
          </div>

          {/* Silver Tier */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <span>🥈</span>
                <span>SILVER</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="w-full h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <span className="text-gray-400 text-sm font-medium">SILVER LOGO</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bronze Tier */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                <span>🥉</span>
                <span>BRONZE</span>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="w-full h-20 bg-white border border-orange-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <span className="text-gray-400 text-xs">BRONZE</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsorship CTA */}
          <div className="text-center">
            <Link href="/sponsors" className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              BECOME A SPONSOR
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Partner with Africa's premier end-of-year celebration
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Professional with strategic colors */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            DECEMBER 15-31, 2025
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            READY TO JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-red-400">AFRICA'S</span><br />
            BIGGEST CELEBRATION?
          </h2>
          
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Don't miss out on seventeen days of unforgettable experiences in Abuja, Nigeria
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/events" className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              GET TICKETS NOW
            </Link>
            <Link href="/contact" className="inline-block border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

      {/* Official Contact Footer */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">Get In Touch</h3>
              <div className="space-y-2 text-gray-300">
                <p>📱 +2348030596162</p>
                <p>📱 +2349168942222</p>
                <p>💬 WhatsApp: +2348033013624</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400">Online</h3>
              <div className="space-y-2 text-gray-300">
                <p>📧 hello@groovydecember.ng</p>
                <p>🌐 www.groovydecember.ng</p>
                <p>📱 @groovydecember</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Event Details</h3>
              <div className="space-y-2 text-gray-300">
                <p>📅 December 15-31, 2025</p>
                <p>📍 Abuja, Nigeria</p>
                <p>🎆 17 Days of Culture & Fun</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 Groovy December Festival. explore, enjoy and experience...</p>
          </div>
        </div>
      </section>
    </div>
  );
}