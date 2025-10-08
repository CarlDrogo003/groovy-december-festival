'use client';

import Link from "next/link";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import { useAnalytics } from '@/hooks/useAnalytics';
import "./globals.css";

function Navigation() {
  const { user, profile, signOut } = useAuth();
  const analytics = useAnalytics();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/assets/groovy_logo_horizontal.png" 
              alt="Groovy December - explore, enjoy and experience" 
              className="h-10 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Events
            </Link>
            <Link href="/vendors" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Vendors
            </Link>
            <Link href="/diaspora" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Diaspora
            </Link>
            <Link href="/pageant" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Pageant
            </Link>
            <Link href="/sponsors" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Sponsors
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-lg font-bold hover:from-green-700 hover:to-red-700 transition-all duration-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-800 text-sm font-semibold">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/events" className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-lg font-bold hover:from-green-700 hover:to-red-700 transition-all duration-300">
                  GET TICKETS
                </Link>
                <Link href="/auth" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          <main>
            {children}
          </main>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
