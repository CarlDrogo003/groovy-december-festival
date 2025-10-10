"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Contestant {
  id: string;
  full_name: string;
  stage_name?: string;
  nationality?: string;
  platform?: string;
  biography?: string;
  headshot_url: string | null;
  full_body_url: string | null;
  date_of_birth?: string;
  status?: string;
}

export default function ContestantsClient() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [filteredContestants, setFilteredContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNationality, setSelectedNationality] = useState("all");

  useEffect(() => {
    const fetchContestants = async () => {
      const { data, error } = await supabase
        .from("pageant_contestants")
        .select(`
          id, 
          full_name, 
          stage_name, 
          nationality, 
          platform, 
          biography, 
          headshot_url, 
          full_body_url,
          date_of_birth,
          status
        `)
        .eq("status", "approved") // Only show approved contestants
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching contestants:", error.message);
      } else {
        setContestants(data || []);
        setFilteredContestants(data || []);
      }
      setLoading(false);
    };

    fetchContestants();
  }, []);

  // Filter contestants based on search and nationality
  useEffect(() => {
    let filtered = contestants;

    if (searchTerm) {
      filtered = filtered.filter(contestant =>
        contestant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contestant.stage_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contestant.platform?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedNationality !== "all") {
      filtered = filtered.filter(contestant => 
        contestant.nationality?.toLowerCase() === selectedNationality.toLowerCase()
      );
    }

    setFilteredContestants(filtered);
  }, [searchTerm, selectedNationality, contestants]);

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

  const uniqueNationalities = Array.from(
    new Set(contestants.map(c => c.nationality).filter(Boolean))
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our amazing contestants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Our Contestants
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Celebrating beauty, intelligence, and grace from across the African diaspora
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-lg">
              <span className="font-bold text-pink-200">{contestants.length}</span> amazing women competing for the crown
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search contestants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Nationality Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by nationality:</label>
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Countries</option>
                {uniqueNationalities.map(nationality => (
                  <option key={nationality} value={nationality}>
                    {nationality}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredContestants.length} of {contestants.length} contestants
            </div>
          </div>
        </div>
      </section>

      {/* Contestants Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredContestants.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No contestants found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || selectedNationality !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No contestants have been approved yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredContestants.map((contestant) => (
                <div key={contestant.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={contestant.headshot_url || contestant.full_body_url || "/api/placeholder/300/400"}
                      alt={contestant.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="text-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {contestant.stage_name || contestant.full_name}
                      </h3>
                      {contestant.stage_name && (
                        <p className="text-sm text-gray-600">({contestant.full_name})</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      {contestant.date_of_birth && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Age {calculateAge(contestant.date_of_birth)}
                        </div>
                      )}
                      
                      {contestant.nationality && (
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {contestant.nationality}
                        </div>
                      )}
                    </div>

                    {/* Platform/Cause */}
                    {contestant.platform && (
                      <div className="mt-3 p-3 bg-pink-50 rounded-lg">
                        <p className="text-xs font-medium text-pink-800 mb-1">Platform:</p>
                        <p className="text-sm text-pink-700 line-clamp-2">
                          {contestant.platform}
                        </p>
                      </div>
                    )}

                    {/* Bio Preview */}
                    {contestant.biography && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {contestant.biography}
                        </p>
                      </div>
                    )}

                    {/* View Profile Button */}
                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/pageant/contestants/${contestant.id}`}>
                        <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-medium">
                          View Full Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join These Amazing Women?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Applications are still open! Take the first step towards your crown.
          </p>
          <Link href="/pageant/register">
            <button className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
              Apply Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
