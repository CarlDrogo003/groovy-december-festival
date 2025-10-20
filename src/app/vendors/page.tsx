"use client";

import VendorRegistrationForm from "@/components/VendorRegistrationForm";
import ContactEventFooter from '@/components/ContactEventFooter';

export default function VendorsPage() {





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
              Join Africa's premier end-of-year festival and connect with thousands of potential customers. Choose your space and register today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#registration"
                className="rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>





      {/* Registration Form Section */}
      <div id="registration" className="py-24 sm:py-32 bg-white">
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
              Our vendor relations team is here to help you succeed
            </p>
            <div className="mt-8 flex justify-center gap-x-6">
              <a
                href="mailto:vendors@groovydecember.ng"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-600 shadow-lg hover:bg-green-50 transition-all duration-300"
              >
                📧 vendors@groovydecember.ng
              </a>
              <a
                href="tel:+234-xxx-xxx-xxxx"
                className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                📞 +234-xxx-xxx-xxxx
              </a>
            </div>
          </div>
        </div>
      </div>
      <ContactEventFooter />
    </div>
  );
}