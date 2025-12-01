'use client';

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  slug: string;
  category?: string;
  registration_fee?: number;
  featured?: boolean;
  image_url?: string;
  start_date?: string;
  end_date?: string;
};

type ViewMode = 'grid' | 'compact';
type DateFilter = 'all' | 'today' | 'week' | 'month';
type PriceFilter = 'all' | 'free' | 'under50' | 'under100' | 'over100';

export function EventsClientPage() {
  // State Management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuickView, setShowQuickView] = useState<Event | null>(null);
  const eventsPerPage = 12;

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Define disabled events
      const disabledEvents = [
        // Automotive competitions
        'drag-race-competition',
        'groovy-go-karting-competition', 
        'groovy-drift-wars-competition',
        'auto-cross-competition',
        'motorbike-600cc-competition',
        'rally-cross-competition',
        // Scrabble competition
        'scrabble-competition',
        // Camping experience 2
        'camping-experience-2-kaspaland',
        // Raffle draw
        'raffle-draws'
      ];
      
      // Manual image mapping for uploaded images
      const eventsWithImages = (data || [])
        .filter(event => !disabledEvents.includes(event.slug)) // Filter out disabled events
        .map(event => {
          const imageMap: { [key: string]: string } = {
            'art-craft-village': '/events/art-craft-village.jpg',
            'chess-competition': '/events/chess.jpg',
            'culture-fest': '/events/culture-fest.jpg',
            'ea-market-place': '/events/ea-market-place.jpg',
            'eating-competition': '/events/eating-competition.jpg',
            'hiking-competition': '/events/hiking.jpg',
            'miss-groovy-december': '/events/miss-groovy-december.jpg',
            'snooker-competition': '/events/snooker.jpg',
            'suya-festival': '/events/suya-festival.jpg',
            'traditional-boxing-competition': '/events/traditional-boxing.jpg',
            'traditional-wrestling': '/events/traditional-wrestling.jpg'
          };
          
          // Update Traditional category to States Events
          // Also move traditional dance competition to States Events for now
          const updatedCategory = event.category === 'Traditional' ? 'States Events' : 
            (event.category === 'Cultural' && event.slug === 'traditional-dance-competition') ? 'States Events' : 
            event.category;
          
          return {
            ...event,
            category: updatedCategory,
            image_url: event.image_url || imageMap[event.slug] || null
          };
        });
      
      setEvents(eventsWithImages);
    } catch (err) {
      // Improve error reporting so the UI shows helpful details
      const message = err && typeof err === 'object' && 'message' in err ? (err as any).message : (typeof err === 'string' ? err : JSON.stringify(err));
      console.error('Events fetch error:', err);
      setError(message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Category configuration with colors
  const categories = [
    { name: 'All', color: 'bg-gray-100 text-gray-800' },
    { name: 'Technology', color: 'bg-blue-100 text-blue-800' },
    { name: 'Marketplace', color: 'bg-green-100 text-green-800' },
    { name: 'Food', color: 'bg-orange-100 text-orange-800' },
    { name: 'Entertainment', color: 'bg-purple-100 text-purple-800' },
    { name: 'Cultural', color: 'bg-pink-100 text-pink-800' },
    { name: 'Business', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'Sports', color: 'bg-red-100 text-red-800' },
    { name: 'States Events', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Special', color: 'bg-violet-100 text-violet-800' }
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  // Filtering and sorting logic
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Date filter
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (dateFilter !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        switch (dateFilter) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            return eventDate >= today && eventDate <= weekFromNow;
          case 'month':
            return eventDate >= today && eventDate <= monthFromNow;
          default:
            return true;
        }
      });
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(event => {
        const fee = event.registration_fee || 0;
        switch (priceFilter) {
          case 'free':
            return fee === 0;
          case 'under50':
            return fee > 0 && fee < 50000;
          case 'under100':
            return fee >= 50000 && fee < 100000;
          case 'over100':
            return fee >= 100000;
          default:
            return true;
        }
      });
    }

    // Sort: Paid events first, then featured, then by date
    return filtered.sort((a, b) => {
      const aHasFee = (a.registration_fee || 0) > 0;
      const bHasFee = (b.registration_fee || 0) > 0;
      
      // Paid events come first
      if (aHasFee && !bHasFee) return -1;
      if (!aHasFee && bHasFee) return 1;
      
      // Within same payment tier, featured comes first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Finally sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [events, searchQuery, selectedCategory, dateFilter, priceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);
  const currentEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Featured events (first 4 featured or first 4 events)
  const featuredEvents = useMemo(() => {
    const featured = events.filter(event => event.featured).slice(0, 4);
    if (featured.length === 0) {
      return events.slice(0, 4);
    }
    return featured;
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load events: {error}</p>
            <button 
              onClick={fetchEvents}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="relative bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 to-gray-900/90"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-green-600 to-red-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {events.length}+ Events Available
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Festival <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Discover amazing experiences at Africa's premier end-of-year celebration. Find the perfect events for you with our smart filtering system.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ⭐ Featured Events
              </h2>
              <p className="text-gray-600">Don't miss these highlighted experiences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <div key={event.id} className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(event.category || 'General')}`}>
                      {event.category || 'General'}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <Link
                      href={`/events/${event.slug}`}
                      className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events, venues, or keywords..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-green-600 to-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                  {category.name === 'All' && ` (${events.length})`}
                </button>
              ))}
            </div>

            {/* Right side filters */}
            <div className="flex items-center gap-4">
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="under50">Under ₦50k</option>
                <option value="under100">₦50k - ₦100k</option>
                <option value="over100">Over ₦100k</option>
              </select>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-2 text-sm ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentEvents.length} of {filteredAndSortedEvents.length} events
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {currentEvents.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentEvents.map((event) => (
                  <EventCard key={event.id} event={event} onQuickView={setShowQuickView} getCategoryColor={getCategoryColor} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentEvents.map((event) => (
                  <CompactEventCard key={event.id} event={event} getCategoryColor={getCategoryColor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedCategory !== 'All' || dateFilter !== 'all' || priceFilter !== 'all'
                ? 'Try adjusting your filters to find more events'
                : 'Events will be added soon. Check back later!'
              }
            </p>
            {(searchQuery || selectedCategory !== 'All' || dateFilter !== 'all' || priceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setDateFilter('all');
                  setPriceFilter('all');
                  setCurrentPage(1);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-green-600 to-red-600 px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-white">Can't Find What You're Looking For?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Contact us to learn about VIP packages, group discounts, and exclusive experiences.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              Contact Us
            </Link>
            <Link
              href="/sponsors"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
            >
              Become a Sponsor
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal event={showQuickView} onClose={() => setShowQuickView(null)} getCategoryColor={getCategoryColor} />
      )}
    </div>
  );
}

// Event Card Component
function EventCard({ event, onQuickView, getCategoryColor }: { 
  event: Event; 
  onQuickView: (event: Event) => void;
  getCategoryColor: (category: string) => string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Featured Badge */}
      {event.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Event Image */}
      <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Event Image</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(event.category || 'General')}`}>
            {event.category || 'General'}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.venue}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {event.registration_fee && event.registration_fee > 0 ? (
              <span>₦{event.registration_fee.toLocaleString()}</span>
            ) : (
              <span className="text-green-600 font-semibold">FREE</span>
            )}
          </div>
        </div>

        {/* Event Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-3">
          {event.description}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/events/${event.slug}`}
            className="flex-1 bg-gradient-to-r from-green-600 to-red-600 text-white text-center px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Register to Participate
          </Link>
          <button
            onClick={() => onQuickView(event)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Quick View
          </button>
        </div>
      </div>
    </article>
  );
}

// Compact Event Card Component
function CompactEventCard({ event, getCategoryColor }: { 
  event: Event;
  getCategoryColor: (category: string) => string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(event.category || 'General')}`}>
              {event.category || 'General'}
            </span>
            {event.featured && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                ⭐ Featured
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.venue}
            </div>
            <div className="flex items-center">
              <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {event.registration_fee && event.registration_fee > 0 ? (
                `₦${event.registration_fee.toLocaleString()}`
              ) : (
                <span className="text-green-600 font-semibold">FREE</span>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {event.description}
          </p>
        </div>
        
        <div className="ml-6 flex-shrink-0">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-red-700 transition-all duration-300"
          >
            View Details
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Quick View Modal Component
function QuickViewModal({ event, onClose, getCategoryColor }: { 
  event: Event; 
  onClose: () => void;
  getCategoryColor: (category: string) => string;
}) {
  // Handle escape key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Event Image */}
          {event.image_url && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(event.category || 'General')}`}>
                {event.category || 'General'}
              </span>
              {event.featured && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  ⭐ Featured
                </span>
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {event.title}
            </h2>
            
            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-semibold">{event.venue}</p>
                </div>
              </div>
              
              {event.registration_fee !== undefined && (
                <div className="flex items-center text-gray-600">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">
                      {event.registration_fee && event.registration_fee > 0 ? `₦${event.registration_fee.toLocaleString()}` : 'FREE'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link
                href={`/events/${event.slug}`}
                className="flex-1 bg-gradient-to-r from-green-600 to-red-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Register to Participate
              </Link>
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}