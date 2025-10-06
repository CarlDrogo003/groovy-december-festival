"use client";
import { useStats } from "@/hooks/useStats";

export default function AdminOverview() {
  const { stats, detailedStats, loading, error, exportStats, refreshStats } = useStats();

  const handleExportStats = async (type: 'basic' | 'detailed' | 'events' | 'vendors' | 'pageant' | 'diaspora') => {
    await exportStats(type);
  };

  const formatStatName = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatIcon = (key: string) => {
    const icons: { [key: string]: string } = {
      events: '🎉',
      event_registrations: '📋',
      vendors: '🛒',
      pageant_applications: '👑',
      diaspora_bookings: '✈️',
      raffle_entries: '🎲',
      sponsors: '🤝',
    };
    return icons[key] || '📊';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <div className="flex gap-2">
          <button
            onClick={refreshStats}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => handleExportStats('basic')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export Stats
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading dashboard stats...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{formatStatName(key)}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {val !== null ? val.toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="text-2xl opacity-60">
                    {getStatIcon(key)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Stats */}
          {detailedStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent Registrations (7d)</span>
                    <span className="font-medium">{detailedStats.recent_registrations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Vendors</span>
                    <span className="font-medium text-yellow-600">{detailedStats.pending_vendors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Vendors</span>
                    <span className="font-medium text-green-600">{detailedStats.approved_vendors}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Pageant Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Contestants</span>
                    <span className="font-medium text-yellow-600">{detailedStats.pending_contestants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Contestants</span>
                    <span className="font-medium text-green-600">{detailedStats.approved_contestants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmed Bookings</span>
                    <span className="font-medium text-blue-600">{detailedStats.confirmed_bookings}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Revenue</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-medium text-green-600">
                      ${detailedStats.total_revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Includes pageant fees and tour bookings
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Events */}
          {detailedStats?.popular_events && detailedStats.popular_events.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Popular Events</h3>
              <div className="space-y-2">
                {detailedStats.popular_events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="font-medium">{event.event_name}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {event.registration_count} registrations
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleExportStats('events')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Export Events
              </button>
              <button
                onClick={() => handleExportStats('vendors')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Export Vendors
              </button>
              <button
                onClick={() => handleExportStats('pageant')}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
              >
                Export Pageant
              </button>
              <button
                onClick={() => handleExportStats('diaspora')}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                Export Diaspora
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
