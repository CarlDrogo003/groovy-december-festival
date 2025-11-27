import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RegisterForm from "./RegisterForm";
import Image from "next/image";

export default async function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  // Await params in Next.js 15
  const { slug } = await params;
  
  // Fetch event by slug with all fields
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event || error) return notFound();

  // Format dates
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const startDate = event.start_date ? new Date(event.start_date) : eventDate;
  const endDate = event.end_date ? new Date(event.end_date) : null;
  
  const formattedStartDate = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedEndDate = endDate ? endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }) : null;

  // Image mapping
  const imageMap: { [key: string]: string } = {
    'art-craft-village': '/events/art-craft-village.jpg',
    'chess-competition': '/events/chess.jpg',
    'culture-fest': '/events/culture-fest.jpg',
    'ea-market-place': '/events/ea-market-place.jpg',
    'eating-competition': '/events/eating-competition.jpg',
    'hiking-competition': '/events/hiking.jpg',
    'miss-groovy-december': '/events/miss-groovy-december.jpg',
    'snooker-competition': '/events/snooker.jpg',
    'suya-festival': '/events/suya-festival.jpg',
    'traditional-boxing-competition': '/events/traditional-boxing.jpg',
    'traditional-wrestling': '/events/traditional-wrestling.jpg'
  };
  
  const eventImage = event.image_url || imageMap[slug] || '/events/default-event.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Event Image */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        {eventImage && (
          <div className="absolute inset-0 opacity-40">
            <img 
              src={eventImage} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/60"></div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="inline-block bg-gradient-to-r from-green-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              {event.category || 'Festival Event'}
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg">
              {event.title}
            </h1>
            {formattedEndDate && (
              <p className="text-xl text-gray-200">
                {formattedStartDate} — {formattedEndDate}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📅</div>
                  <div>
                    <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">When</h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">{formattedDate}</p>
                    {event.time && (
                      <p className="text-gray-600 text-sm mt-1">
                        ⏰ {event.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Venue Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">Where</h3>
                    <p className="text-lg font-bold text-gray-900 mt-1">{event.venue}</p>
                    {event.location && (
                      <p className="text-gray-600 text-sm mt-1">{event.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Capacity Card */}
              {event.capacity && (
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">👥</div>
                    <div>
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">Capacity</h3>
                      <p className="text-lg font-bold text-gray-900 mt-1">{event.capacity} People</p>
                      {event.current_registrations && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{width: `${(event.current_registrations / event.capacity) * 100}%`}}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {event.current_registrations} of {event.capacity} registered
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Fee Card */}
              {event.registration_fee && event.registration_fee > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">💰</div>
                    <div>
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">Entry Fee</h3>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₦{event.registration_fee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            {event.description && (
              <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {event.description.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {event.max_capacity && (
              <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-blue-900 mb-2">📋 Event Information</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Maximum capacity: {event.max_capacity} attendees</li>
                  {event.requires_approval && <li>• Registration requires approval</li>}
                  <li>• Status: <span className="font-semibold capitalize">{event.status}</span></li>
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Registration */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Brochure button (shows when `brochure_url` exists for the event) */}
              {event.brochure_url && (
                <div className="mb-4">
                  <a
                    href={event.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-gray-50"
                  >
                    View Brochure
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              )}

              <RegisterForm 
                eventId={event.id} 
                eventName={event.title} 
                event={event}
                eventFee={event.registration_fee || 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-400 mb-2">📞 Call Us</p>
              <p className="text-xl font-semibold">+234 803 059 6162</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">📧 Email Us</p>
              <p className="text-xl font-semibold">hello@groovydecember.ng</p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">💬 WhatsApp</p>
              <p className="text-xl font-semibold">+234 803 301 5624</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
