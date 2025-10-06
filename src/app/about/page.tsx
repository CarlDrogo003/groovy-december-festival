import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            About Groovy December
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Africa's Premier End-of-Year Festival Experience
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Groovy December was born from a vision to create Africa's most spectacular end-of-year celebration. 
                Since its inception, the festival has grown to become a cultural phenomenon that brings together 
                music, art, food, and the vibrant spirit of African culture.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Set in the heart of Nigeria's capital, Abuja, this four-day extravaganza attracts visitors 
                from across the globe who come to experience authentic African culture while enjoying 
                world-class entertainment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 h-80 rounded-2xl flex items-center justify-center">
              <span className="text-gray-600 text-lg">Festival History Video</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Music</h3>
              <p className="text-gray-600">Featuring the best of Afrobeats, traditional music, and international acts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Culture</h3>
              <p className="text-gray-600">Celebrating African heritage through art, fashion, and cultural exhibitions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tourism</h3>
              <p className="text-gray-600">Showcasing the beauty and diversity of Nigeria and Africa as a whole</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us This December</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Be part of something extraordinary. Experience the magic of Groovy December 2025 
              and create memories that will last a lifetime.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/events" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                View Events
              </Link>
              <Link href="/contact" className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
