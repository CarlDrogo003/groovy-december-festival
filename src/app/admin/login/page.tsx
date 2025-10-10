"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // regular client (anon key)
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithOtp({ email }); // magic link
    setLoading(false);
    alert("Check your email for a magic link.");
  };

  return (
    <form onSubmit={handleMagicLink} className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded mt-4" />
      <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded">{loading ? "Sending..." : "Send magic link"}</button>
    </form>
  );
}
