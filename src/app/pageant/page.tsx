import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PageantPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Miss Groovy December
              <span className="block text-2xl md:text-4xl font-light mt-2 text-pink-200">
                Beauty • Grace • Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the most prestigious beauty pageant celebrating African excellence, 
              culture, and empowerment. Showcase your talent, intelligence, and beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pageant/register">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg">
                  Register Now
                </Button>
              </Link>
              <Link href="/pageant/contestants">
                <Button size="lg" variant="secondary" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg">
                  Meet Our Contestants
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Competition Information
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Miss Groovy December 2025
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Eligibility */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Eligibility</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Ages 18-27 years</li>
                <li>• Single, never married</li>
                <li>• No children</li>
                <li>• African heritage</li>
                <li>• Available for full reign</li>
              </ul>
            </div>

            {/* Prizes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prizes & Benefits</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• $5,000 Cash Prize</li>
                <li>• Modeling Contract</li>
                <li>• Crown & Sash</li>
                <li>• Photoshoot Package</li>
                <li>• Brand Ambassadorships</li>
              </ul>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Important Dates</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Registration: Now Open</li>
                <li>• Deadline: Nov 30, 2025</li>
                <li>• Auditions: Dec 10-15</li>
                <li>• Finals: Dec 31, 2025</li>
                <li>• Crowning: New Year's Eve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Rounds */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Competition Rounds
            </h2>
            <p className="text-xl text-gray-600">
              Showcase your talents across multiple disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 9v6m6-6v6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Evening Gown</h3>
              <p className="text-gray-600 text-sm">Elegance and poise in formal wear</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Interview</h3>
              <p className="text-gray-600 text-sm">Intelligence and communication skills</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Talent</h3>
              <p className="text-gray-600 text-sm">Showcase your unique abilities</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Service</h3>
              <p className="text-gray-600 text-sm">Platform and social impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards becoming Miss Groovy December 2025. 
            Your crown awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pageant/register">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Start Your Application
              </Button>
            </Link>
            <a 
              href="mailto:info@groovydecember.com" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Have Questions? Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Registration Fee</h3>
              <p className="text-3xl font-bold text-pink-400 mb-2">$50</p>
              <p className="text-gray-400">One-time application fee</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 pageant@groovydecember.com</p>
                <p>📱 +1 (555) 123-4567</p>
                <p>🌐 www.groovydecember.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
