import React from "react";

export default function ContactEventFooter() {
  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Get In Touch</h3>
            <div className="space-y-2 text-gray-300">
              <p>📱 +2348030596162</p>
              <p>📱 +2349168942222</p>
              <p>💬 WhatsApp: +2348033013624</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400">Online</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 hello@groovydecember.ng</p>
              <p>🌐 www.groovydecember.ng</p>
              <p>📱 @groovydecember</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Event Details</h3>
            <div className="space-y-2 text-gray-300">
              <p>📅 December 15-31, 2025</p>
              <p>📍 Abuja, Nigeria</p>
              <p>🎆 17 Days of Culture & Fun</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="mb-2">&copy; 2025 Groovy December Festival. explore, enjoy and experience...</p>
          <p className="text-sm text-gray-500">Organized by <span className="text-green-400 font-semibold">Kenneth Handsome Lifestyle Ltd</span></p>
        </div>
      </div>
    </section>
  );
}
