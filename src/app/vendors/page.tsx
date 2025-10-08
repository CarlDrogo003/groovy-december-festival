"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import VendorRegistrationForm from "@/components/VendorRegistrationForm";

interface VendorSpace {
  id: string;
  name: string;
  image: string;
  description: string;
  size: string;
  capacity: string;
  features: string[];
  priceRange: string;
  popular?: boolean;
}

interface VendorPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  included: string[];
  popular?: boolean;
  cta: string;
}

export default function VendorsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  // Vendor Spaces Data (Grid with Large Images)
  const vendorSpaces: VendorSpace[] = [
    {
      id: "premium-booth",
      name: "Premium Booth",
      image: "/assets/booth-premium.jpg", // You'll need to add these images
      description: "Prime location booth with maximum visibility and foot traffic. Perfect for established businesses looking to make a big impact.",
      size: "10ft x 10ft",
      capacity: "Up to 4 staff",
      features: ["Corner location", "LED lighting", "Power outlets", "Storage space", "Premium signage"],
      priceRange: "₦150,000 - ₦250,000",
      popular: true
    },
    {
      id: "standard-booth",
      name: "Standard Booth",
      image: "/assets/booth-standard.jpg",
      description: "Well-positioned booth space ideal for small to medium businesses. Great value with essential amenities included.",
      size: "8ft x 8ft",
      capacity: "Up to 3 staff",
      features: ["Standard location", "Basic lighting", "Power outlet", "Display table", "Business signage"],
      priceRange: "₦80,000 - ₦120,000"
    },
    {
      id: "food-kiosk",
      name: "Food Kiosk",
      image: "/assets/kiosk-food.jpg",
      description: "Specialized food service kiosk in the food court area. Includes all necessary equipment for food preparation and service.",
      size: "6ft x 12ft",
      capacity: "Up to 3 staff",
      features: ["Food court location", "Sink & water", "Electrical setup", "Refrigeration space", "Food permit assistance"],
      priceRange: "₦100,000 - ₦180,000"
    },
    {
      id: "outdoor-space",
      name: "Outdoor Display",
      image: "/assets/space-outdoor.jpg",
      description: "Open-air display space perfect for large items, vehicles, or interactive demonstrations. Maximum flexibility for creative setups.",
      size: "12ft x 15ft",
      capacity: "Up to 5 staff",
      features: ["Open air location", "Vehicle access", "Large display area", "Flexible setup", "Weather protection"],
      priceRange: "₦60,000 - ₦100,000"
    },
    {
      id: "tech-hub",
      name: "Tech Hub Space",
      image: "/assets/booth-tech.jpg",
      description: "Modern tech-focused space with advanced power and internet connectivity. Ideal for startups and tech companies.",
      size: "10ft x 8ft", 
      capacity: "Up to 4 staff",
      features: ["High-speed internet", "Multiple power outlets", "Modern setup", "Demo screens", "Tech signage"],
      priceRange: "₦120,000 - ₦180,000"
    },
    {
      id: "artisan-corner",
      name: "Artisan Corner",
      image: "/assets/corner-artisan.jpg",
      description: "Cozy corner space designed for artisans and craftspeople. Perfect for live demonstrations and handmade products.",
      size: "6ft x 8ft",
      capacity: "Up to 2 staff",
      features: ["Corner positioning", "Craft-friendly setup", "Display shelving", "Workshop space", "Artisan signage"],
      priceRange: "₦50,000 - ₦80,000"
    }
  ];

  // Vendor Packages Data (Pricing with Feature List)
  const vendorPackages: VendorPackage[] = [
    {
      id: "starter",
      name: "Starter Package",
      price: "₦75,000",
      period: "3-day festival",
      description: "Perfect for first-time vendors or small businesses testing the waters",
      features: ["Standard booth space", "Basic setup assistance", "Festival marketing inclusion"],
      included: [
        "8ft x 8ft booth space",
        "1 display table",
        "2 chairs", 
        "Power outlet access",
        "Basic signage support",
        "Event marketing inclusion",
        "3-day festival access"
      ],
      cta: "Start Small"
    },
    {
      id: "professional",
      name: "Professional Package", 
      price: "₦150,000",
      period: "3-day festival",
      description: "Most popular choice for serious vendors looking to maximize their impact",
      features: ["Premium booth location", "Enhanced marketing", "Setup & breakdown assistance"],
      included: [
        "10ft x 10ft premium booth",
        "Corner or high-traffic location",
        "Display table + shelving",
        "4 chairs + storage space",
        "LED lighting package",
        "Multiple power outlets",
        "Professional signage",
        "Social media promotion",
        "Setup & breakdown help",
        "3-day festival access"
      ],
      popular: true,
      cta: "Most Popular"
    },
    {
      id: "premium",
      name: "Premium Package",
      price: "₦250,000", 
      period: "3-day festival",
      description: "VIP experience with maximum visibility and exclusive benefits",
      features: ["Prime location", "VIP marketing", "Full service support"],
      included: [
        "12ft x 12ft prime location",
        "Corner spot with maximum visibility",
        "Complete furniture package",
        "Premium LED lighting",
        "Multiple power & internet",
        "Professional backdrop",
        "VIP marketing package",
        "Dedicated support staff",
        "Setup, maintenance & breakdown",
        "VIP vendor networking events",
        "3-day festival access",
        "Post-event analytics report"
      ],
      cta: "Go Premium"
    }
  ];



  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-gray-900/90"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Join 100+ Vendors
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Showcase Your <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Business</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join Africa's premier end-of-year festival and connect with thousands of potential customers. Choose the perfect space for your business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#spaces"
                className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
              >
                View Spaces
              </a>
              <a href="#pricing" className="text-sm font-semibold leading-6 text-white hover:text-gray-300">
                See Pricing <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Spaces Grid Section */}
      <div id="spaces" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              🏪 Choose Your Perfect Space
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              From premium booths to specialized kiosks, we have the perfect space for every business type and budget.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {vendorSpaces.map((space) => (
              <article key={space.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
                {space.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      🔥 Popular Choice
                    </span>
                  </div>
                )}
                
                {/* Space Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">{space.name} Preview</p>
                    </div>
                  </div>
                </div>

                {/* Space Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {space.name}
                  </h3>
                  
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {space.description}
                  </p>

                  {/* Space Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Size: {space.size}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Capacity: {space.capacity}
                    </div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <svg className="mr-2 h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {space.priceRange}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {space.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <svg className="mr-1 h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                      {space.features.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{space.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      setSelectedPackage(space.name);
                      document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-6 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Select This Space
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Packages Section */}
      <div id="pricing" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              💰 Complete Vendor Packages
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Everything you need to succeed at the festival. Choose the package that fits your business goals and budget.
            </p>
          </div>
          
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
            {vendorPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 ring-1 ${
                  pkg.popular
                    ? 'bg-white ring-green-600 shadow-2xl scale-105'
                    : 'bg-white ring-gray-200 shadow-lg'
                }`}
              >
                {pkg.popular && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">{pkg.name}</h3>
                    <p className="rounded-full bg-green-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-green-600">
                      Most popular
                    </p>
                  </div>
                )}
                {!pkg.popular && (
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{pkg.name}</h3>
                )}
                
                <p className="mt-4 text-sm leading-6 text-gray-600">{pkg.description}</p>
                
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{pkg.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/{pkg.period}</span>
                </p>
                
                <button
                  onClick={() => {
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-green-600 text-white shadow-sm hover:bg-green-500 focus-visible:outline-green-600'
                      : 'bg-white text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300'
                  }`}
                >
                  {pkg.cta}
                </button>
                
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {pkg.included.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div id="registration" className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <VendorRegistrationForm />
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Have Questions? Let's Talk!
            </h2>
            <p className="mt-4 text-lg text-green-100">
              Our vendor success team is here to help you choose the perfect package and maximize your festival experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-green-600 shadow-lg hover:bg-gray-50 transition-all duration-300"
              >
                Contact Vendor Team
              </Link>
              <Link
                href="tel:+234-xxx-xxx-xxxx"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                Call: +234-xxx-xxx-xxxx
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}