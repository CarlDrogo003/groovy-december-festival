import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* HEADER */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                🎪 GROOVY DECEMBER
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/events" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Events
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/vendors" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Vendors
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/diaspora" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Diaspora
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/pageant" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Pageant
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/sponsors" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 relative group">
                  Sponsors
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/contact" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Contact
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
