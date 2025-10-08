// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { 
    name: "Overview", 
    path: "/admin", 
    icon: "🏠",
    description: "Dashboard stats & analytics"
  },
  { 
    name: "Events", 
    path: "/admin/events", 
    icon: "🎉",
    description: "Manage festival events"
  },
  { 
    name: "Vendors", 
    path: "/admin/vendors", 
    icon: "🛒",
    description: "Vendor applications & booths"
  },
  { 
    name: "Diaspora", 
    path: "/admin/diaspora", 
    icon: "✈️",
    description: "Homecoming packages"
  },
  { 
    name: "Pageant", 
    path: "/admin/pageant", 
    icon: "👑",
    description: "Miss Groovy December"
  },
  { 
    name: "Raffle", 
    path: "/admin/raffle", 
    icon: "🎲",
    description: "Mega raffle draws"
  },
  { 
    name: "Analytics", 
    path: "/admin/analytics", 
    icon: "📊",
    description: "Performance & user insights"
  },
  { 
    name: "Sponsors", 
    path: "/admin/sponsors", 
    icon: "🤝",
    description: "Partnership management"
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-72 
        bg-gradient-to-b from-green-900 via-green-800 to-red-900 text-white 
        flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-6 border-b border-green-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-800 font-bold text-lg">GD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Groovy Admin</h1>
              <p className="text-green-200 text-sm">Festival Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-white text-green-800 shadow-lg transform scale-105" 
                    : "text-green-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                <div className="flex-1">
                  <div className={`font-semibold ${isActive ? 'text-green-800' : 'text-white'}`}>
                    {item.name}
                  </div>
                  <div className={`text-sm ${isActive ? 'text-green-600' : 'text-green-200'}`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-green-700/50">
          <div className="bg-white/10 rounded-lg p-4 mb-4 text-center">
            <div className="text-2xl mb-2">🎄</div>
            <div className="text-sm text-green-200">December 15-31, 2025</div>
            <div className="text-xs text-green-300">17 Days Festival</div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-green-800"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 bg-gray-50 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:ml-0 ml-14">
              <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-red-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {navItems.find(item => item.path === pathname)?.description || 'Manage your festival'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Festival Admin
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-800 text-xs font-semibold">
                    {profile?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span>{profile?.full_name || profile?.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
