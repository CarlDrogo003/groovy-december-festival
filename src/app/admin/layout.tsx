// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", path: "/admin" },
  { name: "Events", path: "/admin/events" },
  { name: "Vendors", path: "/admin/vendors" },
  { name: "Diaspora", path: "/admin/diaspora" },
  { name: "Pageant", path: "/admin/pageant" },
  { name: "Raffle", path: "/admin/raffle" },
  { name: "Sponsors", path: "/admin/sponsors" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Groovy Admin
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-md mb-1 ${
                pathname === item.path
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
