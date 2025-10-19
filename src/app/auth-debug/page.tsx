"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AuthDebugPage() {
  const { user, profile, session, loading, isAdmin } = useAuth();
  const [testResult, setTestResult] = useState<string>("");

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .single();
      
      if (error) {
        setTestResult(`❌ Database Error: ${error.message}`);
      } else {
        setTestResult(`✅ Database connected successfully!`);
      }
    } catch (err: any) {
      setTestResult(`❌ Connection Error: ${err.message}`);
    }
  };

  const testAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setTestResult(`Auth session: ${session ? '✅ Active' : '❌ No session'}`);
    } catch (err: any) {
      setTestResult(`❌ Auth Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? "✅ Logged in" : "❌ Not logged in"}</p>
              <p><strong>Profile:</strong> {profile ? "✅ Loaded" : "❌ No profile"}</p>
              <p><strong>Session:</strong> {session ? "✅ Active" : "❌ No session"}</p>
              <p><strong>Is Admin:</strong> {isAdmin ? "✅ Yes" : "❌ No"}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Confirmed:</strong> {user.email_confirmed_at ? "Yes" : "No"}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p>No user logged in</p>
            )}\n          </div>

          {/* Profile Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><strong>Full Name:</strong> {profile.full_name || "Not set"}</p>
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(profile.updated_at).toLocaleString()}</p>
              </div>
            ) : (
              <p>No profile loaded</p>
            )}
          </div>

          {/* Test Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>
            <div className="space-y-4">
              <button
                onClick={testConnection}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Test Database Connection
              </button>
              <button
                onClick={testAuth}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Test Auth Connection
              </button>
              {testResult && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                  {testResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Environment Check */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Make sure your <code>.env.local</code> file has the correct Supabase credentials</li>
            <li>Run the SQL script from <code>database/auth-setup.sql</code> in your Supabase dashboard</li>
            <li>Try signing up at <code>/admin/login</code></li>
            <li>Check this page to see if auth is working</li>
            <li>If you have issues, check the browser console for errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}