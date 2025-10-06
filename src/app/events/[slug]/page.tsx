import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import RegisterForm from "./RegisterForm";

export default async function EventDetails({ params }: { params: { slug: string } }) {
  // Fetch event by slug
  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, date, venue, description")
    .eq("slug", params.slug)
    .single();

  if (!event || error) return notFound();

  return (
    <section className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">
        {event.title}
      </h1>
      <p className="text-gray-700 mb-2">
        {new Date(event.date).toDateString()} • {event.venue}
      </p>
      <p className="text-lg text-gray-800">{event.description}</p>

      {/* Registration Form */}
      <RegisterForm eventId={event.id} />
    </section>
  );
}
