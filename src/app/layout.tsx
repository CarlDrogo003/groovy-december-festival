import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import Navigation from '@/components/Navigation';
import "./globals.css";



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