"use client";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function AdminSetupPage() {
  const { user, profile, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setMessage("❌ No user logged in");
      return;
    }

    setUpdating(true);
    try {
      // First try to update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (updateError) {
        // If update fails, try to insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.email || '',
            role: 'admin'
          });

        if (insertError) {
          throw insertError;
        }
      }

      setMessage("✅ Successfully made current user an admin! Refresh the page and try accessing /admin");
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const createTestAdmin = async () => {
    setUpdating(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@groovydecember.ng',
        password: 'admin123456',
        options: {
          data: {
            full_name: 'Test Admin'
          }
        }
      });

      if (error) throw error;

      setMessage("✅ Test admin account created! Email: admin@groovydecember.ng, Password: admin123456. Check email for verification.");
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Setup Helper</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
            <p><strong>User Logged In:</strong> {user ? "✅ Yes" : "❌ No"}</p>
            <p><strong>User Email:</strong> {user?.email || "None"}</p>
            <p><strong>Profile Loaded:</strong> {profile ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Current Role:</strong> {profile?.role || "None"}</p>
            <p><strong>Is Admin:</strong> {profile?.role === 'admin' ? "✅ Yes" : "❌ No"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            
            {user ? (
              <div>
                <button
                  onClick={makeCurrentUserAdmin}
                  disabled={updating}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
                >
                  {updating ? "Processing..." : "Make Current User Admin"}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  This will give admin role to: {user.email}
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800">
                  ⚠️ You need to be logged in first. Go to <a href="/admin/login" className="text-blue-600 underline">/admin/login</a> to sign in or create an account.
                </p>
              </div>
            )}

            <button
              onClick={createTestAdmin}
              disabled={updating}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {updating ? "Processing..." : "Create Test Admin Account"}
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              {message}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>If you're not logged in, go to <a href="/admin/login" className="text-blue-600 underline">/admin/login</a></li>
            <li>Create an account or sign in with existing credentials</li>
            <li>Come back to this page and click "Make Current User Admin"</li>
            <li>Go to <a href="/admin" className="text-blue-600 underline">/admin</a> to access the admin panel</li>
            <li>Or use the test admin account: admin@groovydecember.ng / admin123456</li>
          </ol>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Why is the admin page empty?</h3>
          <p className="text-sm text-gray-700">
            The admin page is protected and only shows content to users with the "admin" role. 
            If you see an empty page, it means either:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
            <li>You're not logged in</li>
            <li>Your account doesn't have the "admin" role</li>
            <li>The profiles table doesn't exist (run the SQL setup script)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}