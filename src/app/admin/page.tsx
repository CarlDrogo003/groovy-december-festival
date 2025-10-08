"use client";
import { useStats } from "@/hooks/useStats";
import { useState } from "react";

export default function AdminOverview() {
  const { stats, detailedStats, loading, error, exportStats, refreshStats } = useStats();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');

  const handleExportStats = async (type: 'basic' | 'detailed' | 'events' | 'vendors' | 'pageant' | 'diaspora') => {
    setIsExporting(true);
    try {
      await exportStats(type);
      setExportSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`);
      setTimeout(() => setExportSuccess(''), 3000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
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

  const getStatColor = (key: string) => {
    const colors: { [key: string]: string } = {
      events: 'from-blue-500 to-blue-600',
      event_registrations: 'from-green-500 to-green-600',
      vendors: 'from-orange-500 to-orange-600',
      pageant_applications: 'from-pink-500 to-pink-600',
      diaspora_bookings: 'from-purple-500 to-purple-600',
      raffle_entries: 'from-yellow-500 to-yellow-600',
      sponsors: 'from-indigo-500 to-indigo-600',
    };
    return colors[key] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {exportSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Festival Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time overview of Groovy December Festival</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={refreshStats}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
            <button
              onClick={() => handleExportStats('basic')}
              disabled={isExporting}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isExporting ? 'Exporting...' : 'Export Stats'}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading festival dashboard...</p>
            <p className="text-gray-400 text-sm mt-1">Fetching real-time data</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(stats).map(([key, val]) => (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {formatStatName(key)}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {val !== null ? val.toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStatColor(key)} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {getStatIcon(key)}
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden`}>
                    <div className={`h-full bg-gradient-to-r ${getStatColor(key)} transition-all duration-1000 ease-out`} 
                         style={{width: val ? Math.min((val / 100) * 100, 100) + '%' : '0%'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Stats */}
          {detailedStats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Recent Registrations (7d)</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.recent_registrations}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Pending Vendors</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.pending_vendors}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Approved Vendors</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.approved_vendors}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">👑</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Pageant Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Pending Contestants</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.pending_contestants}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Approved Contestants</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.approved_contestants}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Confirmed Bookings</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {detailedStats.confirmed_bookings}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Revenue</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ₦{detailedStats.total_revenue.toLocaleString()}
                  </div>
                  <p className="text-gray-600 text-sm bg-gray-50 rounded-lg px-4 py-2">
                    Includes pageant fees and tour bookings
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Popular Events */}
          {detailedStats?.popular_events && detailedStats.popular_events.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Popular Events</h3>
              </div>
              <div className="space-y-3">
                {detailedStats.popular_events.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{event.event_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {event.registration_count} registrations
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Export Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleExportStats('events')}
                disabled={isExporting}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <span>🎉</span>
                <span>Export Events</span>
              </button>
              <button
                onClick={() => handleExportStats('vendors')}
                disabled={isExporting}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <span>🛒</span>
                <span>Export Vendors</span>
              </button>
              <button
                onClick={() => handleExportStats('pageant')}
                disabled={isExporting}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <span>👑</span>
                <span>Export Pageant</span>
              </button>
              <button
                onClick={() => handleExportStats('diaspora')}
                disabled={isExporting}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <span>✈️</span>
                <span>Export Diaspora</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
