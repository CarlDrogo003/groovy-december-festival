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

            {/* Location & Dates */}
            <div className="mt-6 space-y-2">
              <p className="text-lg text-gray-400">
                📍 Abuja, Nigeria • 🗓️ December 15-31, 2025
              </p>
              <p className="text-sm text-green-300 font-medium">
                Seventeen Days of Culture, Business & Entertainment
              </p>
              <p className="text-sm text-yellow-300">
                🎵 Live Performances • 🎪 Cultural Shows • 🤝 Business Networking • 👑 Beauty Pageant
              </p>
            </div>

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
                <div className="text-3xl font-bold text-white sm:text-4xl">400K+</div>
                <div className="mt-2 text-sm font-medium text-gray-400">Expected</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tickets"
                className="rounded-full bg-gradient-to-r from-green-600 to-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transform hover:scale-105 transition-all duration-300"
              >
                Get Tickets
              </Link>
              <a
                href="#raffle"
                className="rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                🛺 Win KEKE Every 2 Days!
              </a>
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

          {/* Featured Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Headliner */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 rounded-bl-lg text-xs font-bold">
                HEADLINER
              </div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  🎤
                </div>
                <h3 className="text-2xl font-bold mb-2">BURNA BOY</h3>
                <p className="text-purple-100 text-sm mb-4">Grammy Winner • African Giant</p>
                <div className="flex justify-center space-x-2">
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Afrobeats</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Dec 30</span>
                </div>
              </div>
            </div>

            {/* Featured Artists */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-6 text-white group hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🎵
                </div>
                <h3 className="text-lg font-bold mb-2">TIWA SAVAGE</h3>
                <p className="text-green-100 text-xs mb-3">Queen of Afrobeats</p>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Dec 28</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white group hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🎸
                </div>
                <h3 className="text-lg font-bold mb-2">DAVIDO</h3>
                <p className="text-orange-100 text-xs mb-3">OBO • 30BG</p>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Dec 29</span>
              </div>
            </div>

            {/* Cultural Acts */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-6 text-white group hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🥁
                </div>
                <h3 className="text-lg font-bold mb-2">FOLKLORE</h3>
                <p className="text-yellow-100 text-xs mb-3">Traditional Dance</p>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Daily</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white group hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🎭
                </div>
                <h3 className="text-lg font-bold mb-2">COMEDY</h3>
                <p className="text-indigo-100 text-xs mb-3">Stand-up Shows</p>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Dec 25</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white group hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                  🎻
                </div>
                <h3 className="text-lg font-bold mb-2">ORCHESTRA</h3>
                <p className="text-pink-100 text-xs mb-3">Classical Fusion</p>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">Dec 24</span>
              </div>
            </div>
          </div>

          {/* More Artists Coming Soon */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-6 py-3">
              <span className="text-gray-600 font-medium">+ 20 More Artists to be Announced</span>
              <div className="ml-3 flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
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
            <Link href="/tickets" className="group">
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

      {/* Festival Highlights Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              WHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">GROOVY DECEMBER?</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Experience Africa's most comprehensive festival celebrating culture, business, and entertainment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Highlight 1: Scale */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">17 DAYS OF CELEBRATION</h3>
              <p className="text-gray-300 text-center">
                The longest cultural festival in West Africa, featuring over 30 unique events across multiple venues
              </p>
            </div>

            {/* Highlight 2: Diversity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">MULTI-CULTURAL EXPERIENCE</h3>
              <p className="text-gray-300 text-center">
                Celebrating Nigerian diversity with performers and participants from all 36 states plus diaspora
              </p>
            </div>

            {/* Highlight 3: Business */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">BUSINESS NETWORKING</h3>
              <p className="text-gray-300 text-center">
                Connect with entrepreneurs, investors, and business leaders from across Africa and the diaspora
              </p>
            </div>
          </div>

          {/* Featured Numbers */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">400K+</div>
              <div className="text-gray-300">Expected Attendees</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Vendors & Exhibitors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Performing Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">₦50M+</div>
              <div className="text-gray-300">Prize Pool</div>
            </div>
          </div>
        </div>
      </section>

      {/* Raffle Draw Section - KEKE Grand Prize with Every 2 Days Draws */}
      <section id="raffle" className="py-20 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/raffle-draw.jpg')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-green-800/80 to-red-900/85"></div>
        
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
              <span>EVERY 2 DAYS DRAW</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
              🛺 WIN BRAND NEW KEKE 🛺
            </h2>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto font-semibold">
              Every 2 Days During Groovy December Festival!
            </p>
          </div>

          {/* KEKE Prize Showcase */}
          <div className="mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300 max-w-2xl mx-auto">
              <div className="text-8xl mb-6">🛺</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">BRAND NEW KEKE</h3>
              <div className="text-2xl font-black text-green-600 mb-4">Auto Rickshaw/Tricycle</div>
              <p className="text-gray-600 font-semibold mb-6">Professional commercial vehicle perfect for business or personal use</p>
              
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="font-bold text-green-800">💪 Durable</div>
                  <div className="text-green-600">Built to Last</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="font-bold text-blue-800">⛽ Efficient</div>
                  <div className="text-blue-600">Low Fuel Cost</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="font-bold text-purple-800">💼 Business</div>
                  <div className="text-purple-600">Income Ready</div>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <div className="font-bold text-orange-800">🎯 Reliable</div>
                  <div className="text-orange-600">Daily Transport</div>
                </div>
              </div>
            </div>
          </div>

          {/* Draw Schedule Information */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/30">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-3">📅</div>
                <h4 className="text-xl font-bold text-white mb-2">DRAW FREQUENCY</h4>
                <p className="text-yellow-100 font-semibold text-2xl">Every 2 Days</p>
                <p className="text-yellow-200 text-sm">Multiple chances to win</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🏧</div>
                <h4 className="text-xl font-bold text-white mb-2">HOW TO QUALIFY</h4>
                <p className="text-yellow-100 font-semibold">A Bank ATM qualifies you</p>
                <p className="text-yellow-200 text-sm">Buy raffle tickets to enter</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="text-xl font-bold text-white mb-2">WIN STRATEGY</h4>
                <p className="text-yellow-100 font-semibold">More tickets = More chances</p>
                <p className="text-yellow-200 text-sm">Increase your winning odds</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20">
            <h3 className="text-2xl font-bold text-white text-center mb-8">🎲 How to Participate</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h4 className="font-bold text-white mb-2">Visit ATM</h4>
                <p className="text-yellow-200 text-sm">Use any bank ATM to qualify for participation</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h4 className="font-bold text-white mb-2">Buy Tickets</h4>
                <p className="text-yellow-200 text-sm">Purchase raffle tickets for the draw</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h4 className="font-bold text-white mb-2">Join Draws</h4>
                <p className="text-yellow-200 text-sm">Participate in draws every 2 days</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h4 className="font-bold text-white mb-2">Win KEKE!</h4>
                <p className="text-yellow-200 text-sm">Stand a chance to win brand new KEKE</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
                <span className="text-white font-semibold">Next Draw:</span>
                <span className="text-2xl font-black text-yellow-300">2 Days</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full text-xl font-black hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl min-w-[200px] border-2 border-white">
                🎫 BUY RAFFLE TICKETS
              </button>
              <button className="bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 border border-white/30">
                📋 View Draw Rules
              </button>
            </div>

            {/* Contact Information */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <h4 className="text-lg font-bold text-white mb-4">📞 For More Information</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-yellow-200 font-semibold">📱 Call Us:</p>
                  <p className="text-white">08067469060</p>
                  <p className="text-white">08030596162</p>
                </div>
                <div>
                  <p className="text-yellow-200 font-semibold">🌐 Online:</p>
                  <p className="text-white">www.groovydecember.ng</p>
                  <p className="text-white">hello@groovydecember.ng</p>
                </div>
              </div>
            </div>

            <div className="text-center text-white/80 text-sm">
              <p>🎪 <strong>Festival Integration:</strong> Combine your festival experience with amazing winning opportunities!</p>
              <p className="mt-2">� <strong>Secure & Verified:</strong> All draws are conducted transparently with official supervision</p>
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
          
          <div className="mb-8 space-y-4">
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Don't miss out on seventeen days of unforgettable experiences in Abuja, Nigeria
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>World-class performers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Business networking</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Cultural experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>₦50M+ prizes</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/tickets" className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
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
            <p className="mb-2">&copy; 2025 Groovy December Festival. explore, enjoy and experience...</p>
            <p className="text-sm text-gray-500">Organized by <span className="text-green-400 font-semibold">Kenneth Handsome Lifestyle Ltd</span></p>
          </div>
        </div>
      </section>
    </div>
  );
}