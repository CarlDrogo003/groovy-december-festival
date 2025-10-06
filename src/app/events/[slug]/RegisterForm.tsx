"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterForm({ eventId }: { eventId: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Insert registration into Supabase
    const { error } = await supabase.from("registrations").insert([
      { event_id: eventId, full_name: fullName, email, phone },
    ]);

    if (error) {
      console.error(error);
      setStatus("❌ Registration failed. Please try again.");
    } else {
      setStatus("✅ Successfully registered!");
      setFullName("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 bg-gray-100 rounded-lg shadow max-w-md"
    >
      <h2 className="text-xl font-bold mb-4">Register for this event</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>

      {status && <p className="mt-3 text-sm">{status}</p>}
    </form>
  );
}
