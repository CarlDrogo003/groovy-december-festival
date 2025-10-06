"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * VendorsPage
 * - Fixes event pooling issue by capturing the HTMLFormElement reference
 *   before any async/await calls.
 * - Shows loading state and user-friendly messages.
 */
export default function VendorsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // IMPORTANT: capture the form element synchronously.
    // If you try to use `e.currentTarget` after an `await`, it can be null.
    const form = e.currentTarget as HTMLFormElement;

    // Collect form values (we read from the captured form)
    const formData = new FormData(form);
    const vendor = {
      business_name: String(formData.get("business_name") || "").trim(),
      owner_name: String(formData.get("owner_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      package: String(formData.get("package") || "").trim(),
    };

    try {
      // Insert into Supabase
      const { error } = await supabase.from("vendors").insert([vendor]);

      if (error) {
        // Show error returned by Supabase
        setMessage("❌ Error: " + error.message);
      } else {
        // Success: reset the form using the captured 'form' reference
        form.reset();
        setMessage("✅ Registration successful! We’ll contact you soon.");
      }
    } catch (err: any) {
      // Unexpected runtime error
      setMessage("❌ Unexpected error: " + (err?.message ?? String(err)));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        Vendor Registration
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Register your business to showcase at Groovy December. Choose a package that suits you!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
        <input
          name="business_name"
          placeholder="Business Name"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          name="owner_name"
          placeholder="Owner’s Full Name"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-3 rounded-lg"
        />

        <select
          name="package"
          className="w-full border p-3 rounded-lg"
          required
        >
          <option value="">Select Package</option>
          <option value="Kiosk">Kiosk</option>
          <option value="Booth">Booth</option>
          <option value="Outdoor Space">Outdoor Space</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>

      {message && <p className="text-center mt-4">{message}</p>}
    </div>
  );
}
