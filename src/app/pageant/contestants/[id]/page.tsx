"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Contestant {
  id: string;
  full_name: string;
  stage_name?: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  nationality?: string;
  current_address?: string;
  social_media_handles?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  height?: string;
  bust_chest?: string;
  waist?: string;
  hips?: string;
  dress_size?: string;
  languages?: string;
  biography?: string;
  why?: string;
  platform?: string;
  achievements?: string;
  hobbies_skills?: string;
  headshot_url?: string;
  full_body_url?: string;
  created_at: string;
}

export default function ContestantProfile() {
  const params = useParams();
  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContestant = async () => {
      if (!params.id) return;

      const { data, error: fetchError } = await supabase
        .from("pageant_contestants")
        .select("*")
        .eq("id", params.id)
        .eq("status", "approved") // Only show approved contestants
        .single();

      if (fetchError) {
        console.error("Error fetching contestant:", fetchError);
        setError("Contestant not found or not yet approved.");
      } else {
        setContestant(data);
      }
      setLoading(false);
    };

    fetchContestant();
  }, [params.id]);

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contestant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !contestant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contestant Not Found</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link href="/pageant/contestants">
          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors">
            Back to Contestants
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/pageant/contestants">
            <button className="flex items-center text-pink-600 hover:text-pink-700 font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Contestants
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Photo */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-white/10 rounded-lg overflow-hidden mx-auto max-w-sm">
                <img
                  src={contestant.headshot_url || contestant.full_body_url || "/api/placeholder/300/400"}
                  alt={contestant.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {contestant.stage_name || contestant.full_name}
              </h1>
              {contestant.stage_name && (
                <p className="text-xl opacity-90 mb-4">({contestant.full_name})</p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-lg">
                {contestant.date_of_birth && (
                  <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Age {calculateAge(contestant.date_of_birth)}
                  </div>
                )}
                
                {contestant.nationality && (
                  <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {contestant.nationality}
                  </div>
                )}

                {contestant.height && (
                  <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 9v6m6-6v6" />
                    </svg>
                    {contestant.height}
                  </div>
                )}
              </div>

              {contestant.place_of_birth && (
                <p className="text-lg opacity-90">
                  Born in {contestant.place_of_birth}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            {contestant.biography && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {contestant.biography}
                </p>
              </section>
            )}

            {/* Why Competing */}
            {contestant.why && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Why I'm Competing
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {contestant.why}
                </p>
              </section>
            )}

            {/* Platform */}
            {contestant.platform && (
              <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  My Platform & Cause
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {contestant.platform}
                </p>
              </section>
            )}

            {/* Achievements */}
            {contestant.achievements && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Achievements & Awards
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {contestant.achievements}
                </p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {contestant.languages && (
                  <div>
                    <span className="font-medium text-gray-700">Languages:</span>
                    <p className="text-gray-600">{contestant.languages}</p>
                  </div>
                )}
                
                {contestant.hobbies_skills && (
                  <div>
                    <span className="font-medium text-gray-700">Hobbies & Skills:</span>
                    <p className="text-gray-600">{contestant.hobbies_skills}</p>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-700">Competing Since:</span>
                  <p className="text-gray-600">
                    {new Date(contestant.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Stats (if provided) */}
            {(contestant.height || contestant.dress_size) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Measurements</h3>
                <div className="space-y-2">
                  {contestant.height && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Height:</span>
                      <span className="font-medium">{contestant.height}</span>
                    </div>
                  )}
                  {contestant.dress_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Dress Size:</span>
                      <span className="font-medium">{contestant.dress_size}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Body Photo */}
            {contestant.full_body_url && contestant.full_body_url !== contestant.headshot_url && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Full Body Photo</h3>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={contestant.full_body_url}
                    alt={`${contestant.full_name} full body`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Social Media */}
            {contestant.social_media_handles && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Me</h3>
                <p className="text-gray-600 text-sm">
                  {contestant.social_media_handles}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Support {contestant.stage_name || contestant.full_name}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Show your support for this amazing contestant! Follow her journey to the crown.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pageant/contestants">
              <button className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                View All Contestants
              </button>
            </Link>
            <Link href="/pageant">
              <button className="bg-white/20 border-2 border-white text-white hover:bg-white/30 px-8 py-3 rounded-lg font-semibold transition-colors">
                Learn About the Pageant
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}