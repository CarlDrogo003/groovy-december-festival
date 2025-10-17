import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import Navigation from '@/components/Navigation';
import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groovy December 2025 - Africa\'s Premier End-of-Year Festival',
  description: 'Join us for 17 days of culture, entertainment, and celebration in Abuja, Nigeria. December 15-31, 2025.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' }
  },
  openGraph: {
    title: 'Groovy December 2025 - Africa\'s Premier Festival',
    description: 'Experience 17 days of African culture, music, and celebration',
    url: 'https://groovydecember.ng',
    siteName: 'Groovy December Festival',
    type: 'website'
  }
};

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