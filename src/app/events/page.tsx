import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  slug: string;
};

// Server Component (async)
export default async function EventsPage() {
  // Fetch events from Supabase
  const { data: events, error } = await supabase.from("events").select("*");

  if (error) {
    console.error("Error fetching events:", error.message);
    return <p>Failed to load events. Please try again later.</p>;
  }

  return (
    <section>
      <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
        Festival Events
      </h1>
      <p className="mb-8 text-gray-700 max-w-2xl">
        Discover the full line-up of concerts, parades, comedy shows, and more at{" "}
        <span className="font-bold text-green-600">Groovy December</span>.
      </p>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event: Event) => (
          <div
            key={event.id}
            className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold text-black">{event.title}</h2>
            <p className="text-orange-600">
              {new Date(event.date).toDateString()}
            </p>
            <p className="text-gray-500">{event.venue}</p>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
            <Link
              href={`/events/${event.slug}`}
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
