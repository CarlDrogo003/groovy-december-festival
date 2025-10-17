'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Navigation() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-green-50 to-red-50 border-b-2 border-gradient-to-r from-green-300 to-red-300 sticky top-0 z-50 shadow-lg">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
              <img 
                src="/assets/groovy_logo_horizontal.png" 
                alt="Groovy December - explore, enjoy and experience" 
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Home
              </Link>
              <Link href="/tickets" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 relative border-b-2 border-transparent hover:border-green-500 pb-1">
                Tickets
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">HOT!</span>
              </Link>
              <Link href="/events" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Events
              </Link>
              <Link href="/vendors" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Vendors
              </Link>
              <Link href="/diaspora" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Diaspora
              </Link>
              <Link href="/pageant" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Pageant
              </Link>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/#raffle" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 relative border-b-2 border-transparent hover:border-green-500 pb-1">
                Raffle
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">KEKE!</span>
              </a>
              <Link href="/sponsors" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-b-2 border-transparent hover:border-green-500 pb-1">
                Sponsors
              </Link>
              
              {/* Desktop Auth Section */}
              {user ? (
                <div className="flex items-center space-x-4">
                  {profile?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={signOut}
                      className="text-gray-700 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/tickets" className="bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-3 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    GET TICKETS
                  </Link>
                  <Link href="/auth" className="text-gray-800 hover:text-green-600 font-semibold transition-colors duration-200 border-2 border-green-600 px-4 py-2 rounded-full hover:bg-green-50">
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-red-100 hover:from-green-200 hover:to-red-200 transition-all duration-200 shadow-md"
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-green-50 to-red-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">🎉 Festival Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-4">
            <Link 
              href="/" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Home</span>
            </Link>
            
            <Link 
              href="/tickets" 
              className="block p-4 rounded-lg bg-gradient-to-r from-green-100 to-red-100 shadow-md hover:shadow-lg transition-all duration-200 relative"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Get Tickets</span>
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">HOT!</span>
            </Link>

            <Link 
              href="/events" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Events</span>
            </Link>

            <Link 
              href="/vendors" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Vendors</span>
            </Link>

            <Link 
              href="/diaspora" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Diaspora</span>
            </Link>

            <Link 
              href="/pageant" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Pageant</span>
            </Link>

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a 
              href="/#raffle" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-yellow-50 relative"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">🛺 Raffle - Win KEKE!</span>
              <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
            </a>

            <Link 
              href="/sponsors" 
              className="block p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:bg-green-50"
              onClick={closeMobileMenu}
            >
              <span className="font-semibold text-gray-800">Sponsors</span>
            </Link>
          </div>

          {/* Mobile Auth Section */}
          <div className="mt-8 pt-6 border-t border-gray-300">
            {user ? (
              <div className="space-y-4">
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="block text-center p-3 rounded-lg bg-gradient-to-r from-green-600 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <span className="font-bold">Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">Welcome!</div>
                    <button
                      onClick={() => {
                        signOut();
                        closeMobileMenu();
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/tickets" 
                  className="block w-full text-center bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-4 rounded-full font-bold hover:from-green-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={closeMobileMenu}
                >
                  GET TICKETS NOW!
                </Link>
                <Link 
                  href="/auth" 
                  className="block text-center p-3 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <span className="font-semibold">Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Festival Info */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-200 to-red-200 rounded-lg text-center">
            <div className="text-2xl mb-2">🎊</div>
            <div className="text-sm font-medium text-gray-800">Groovy December Festival</div>
            <div className="text-xs text-gray-600 mt-1">400K+ Expected Attendees</div>
          </div>
        </div>
      </div>
    </>
  );
}