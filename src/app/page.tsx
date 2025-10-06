'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Vibrant festival gradient */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white py-20 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-300 bg-opacity-20 rounded-full blur-2xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 December 16-19, 2025
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="block text-yellow-300">GROOVY</span>
            <span className="block text-white">DECEMBER</span>
            <span className="block text-2xl md:text-3xl font-medium text-blue-200">Abuja, Nigeria</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
            Africa's Ultimate End-of-Year Festival
            <span className="block text-lg text-blue-200 mt-2">Music • Culture • Tourism • Adventure</span>
          </p>
          <div className="flex gap-6 justify-center flex-wrap mb-12">
            <Link href="/events" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25">
              🎫 Get Tickets
            </Link>
            <Link href="/events" className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm bg-white bg-opacity-10">
              🎭 Explore Events
            </Link>
          </div>
          <div className="inline-flex items-center gap-3 bg-black bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-full text-lg">
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Dec 16-19, 2025 • Abuja, Nigeria</span>
            <span className="text-yellow-400">📍</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">4 Days</h3>
              <p className="text-gray-600 font-medium">Dec 16-19</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Abuja</h3>
              <p className="text-gray-600 font-medium">Nigeria's Capital</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">30+</h3>
              <p className="text-gray-600 font-medium">Epic Events</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">10K+</h3>
              <p className="text-gray-600 font-medium">Festival Seats</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🌍 About the Festival
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  Africa's <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Ultimate</span> End-of-Year Celebration
                </h2>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">
                Groovy December is Africa's premier end-of-year celebration, bringing together the best of 
                <span className="font-semibold text-purple-600"> music, culture, and tourism</span> in the heart of Nigeria's capital.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience world-class entertainment, authentic cultural experiences, and unforgettable adventures 
                that celebrate the richness of African heritage while embracing global influences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Learn More 📖
                </Link>
                <Link href="/about" className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all duration-300">
                  Watch Trailer 🎬
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 h-96 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                <div className="text-center z-10">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-gray-700">Festival Highlights</p>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-green-400 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ Festival Highlights
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              What Awaits <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in a world of entertainment, culture, and unforgettable experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Concerts</h3>
              <p className="text-gray-600 leading-relaxed">World-class artists and local talents on multiple stages</p>
            </div>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 8v10a2 2 0 002 2h10a2 2 0 002-2V8l-7-6zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Competitions</h3>
              <p className="text-gray-600 leading-relaxed">Talent shows, dance battles, and cultural contests</p>
            </div>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Art Exhibitions</h3>
              <p className="text-gray-600 leading-relaxed">Contemporary African art and cultural displays</p>
            </div>
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 8v10a2 2 0 002 2h10a2 2 0 002-2V8l-7-6zM8 13a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marketplace</h3>
              <p className="text-gray-600 leading-relaxed">Local crafts, food, fashion, and unique experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🚀 Get Involved
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Movement</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/vendors" className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full transform translate-x-16 -translate-y-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🏪 Become a Vendor</h3>
                  <p className="text-gray-600">Showcase your products and services</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
            <Link href="/diaspora" className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full transform translate-x-16 -translate-y-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🌍 Diaspora Experience</h3>
                  <p className="text-gray-600">Connect with your African roots</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
            <Link href="/pageant" className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full transform translate-x-16 -translate-y-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">👑 Groovy Queen Pageant</h3>
                  <p className="text-gray-600">Compete for the crown of beauty and culture</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
            <Link href="/sponsors" className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full transform translate-x-16 -translate-y-16 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🤝 Partner with Us</h3>
                  <p className="text-gray-600">Join us as a sponsor or collaborator</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🤝 Our Partners
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join these amazing brands supporting Africa's premier festival
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { name: "Premium Partner", level: "Platinum" },
              { name: "Media Partner", level: "Gold" },
              { name: "Tech Partner", level: "Silver" },
              { name: "Cultural Partner", level: "Bronze" }
            ].map((sponsor, index) => (
              <div key={index} className="group bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-opacity-20 transition-all duration-300 hover:-translate-y-2 border border-white border-opacity-20">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{sponsor.name}</h3>
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                  {sponsor.level}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/sponsors" className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Become a Sponsor 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
