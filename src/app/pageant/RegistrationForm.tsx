"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const full_name = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const age = Number(formData.get("age") || 0);
    const bio = String(formData.get("bio") || "").trim();

    const headshot = formData.get("headshot") as File | null;
    const fullBody = formData.get("full_body") as File | null;
    const proof = formData.get("proof") as File | null;

    // Helper function to upload and return public URL
    const uploadFile = async (file: File | null, label: string) => {
      if (!file) return null;

      const filePath = `contestants/${email}/${label}_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("pageant-files")
        .upload(filePath, file);

      if (error) {
        console.error(`❌ Upload error (${label}):`, error.message);
        return null;
      }

      const { data: publicUrl } = supabase.storage
        .from("pageant-files")
        .getPublicUrl(data.path);

      return publicUrl.publicUrl;
    };

    try {
      // Upload files
      const headshotUrl = await uploadFile(headshot, "headshot");
      const fullBodyUrl = await uploadFile(fullBody, "fullbody");
      const proofUrl = await uploadFile(proof, "proof");

      // Insert contestant into DB
      const { error } = await supabase.from("pageant_contestants").insert([
        {
          full_name,
          email,
          phone,
          age,
          bio,
          headshot_url: headshotUrl,
          full_body_url: fullBodyUrl,
          proof_of_payment_url: proofUrl,
        },
      ]);

      if (error) {
        alert("❌ Error saving contestant: " + error.message);
      } else {
        alert("✅ Registration submitted successfully!");
        form.reset();
      }
    } catch (err: any) {
      alert("❌ Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Miss Groovy December Registration</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input name="full_name" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input type="email" name="email" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input name="phone" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">Age</label>
          <input type="number" name="age" required className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">Short Bio</label>
          <textarea name="bio" required className="w-full border rounded p-2" rows={4}></textarea>
        </div>

        <div>
          <label className="block font-medium">Upload Headshot Photo</label>
          <input type="file" name="headshot" accept="image/*" required />
        </div>

        <div>
          <label className="block font-medium">Upload Full Body Photo</label>
          <input type="file" name="full_body" accept="image/*" required />
        </div>

        <div>
          <label className="block font-medium">Upload Proof of Payment</label>
          <input type="file" name="proof" accept="image/*,application/pdf" required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
