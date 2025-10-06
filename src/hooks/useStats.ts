// src/hooks/useStats.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Stats {
  events: number | null;
  registrations: number | null; // Changed from event_registrations to match your table
  vendors: number | null;
  pageant_contestants: number | null; // Changed from pageant_applications
  tour_bookings: number | null; // Changed from diaspora_bookings
  raffle_entries: number | null;
  sponsors: number | null;
}

export interface DetailedStats extends Stats {
  recent_registrations: number;
  pending_vendors: number;
  approved_vendors: number;
  pending_contestants: number;
  approved_contestants: number;
  confirmed_bookings: number;
  total_revenue: number;
  popular_events: Array<{
    event_name: string;
    registration_count: number;
  }>;
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    events: null,
    registrations: null,
    vendors: null,
    pageant_contestants: null,
    tour_bookings: null,
    raffle_entries: null,
    sponsors: null,
  });
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch basic stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setStats(data.counts || {});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats";
      setError(errorMessage);
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed stats
  const fetchDetailedStats = async () => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/stats/detailed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch detailed stats: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setDetailedStats(data.stats || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch detailed stats";
      setError(errorMessage);
      console.error("Error fetching detailed stats:", err);
    }
  };

  // Get stats by date range
  const fetchStatsByDateRange = async (startDate: string, endDate: string) => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/stats/range?start=${startDate}&end=${endDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats by date range: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stats by date range";
      setError(errorMessage);
      console.error("Error fetching stats by date range:", err);
      return null;
    }
  };

  // Get event-specific stats
  const fetchEventStats = async (eventId: string) => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/stats/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event stats: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch event stats";
      setError(errorMessage);
      console.error("Error fetching event stats:", err);
      return null;
    }
  };

  // Get revenue stats
  const fetchRevenueStats = async () => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/stats/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue stats: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.revenue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch revenue stats";
      setError(errorMessage);
      console.error("Error fetching revenue stats:", err);
      return null;
    }
  };

  // Export stats to CSV
  const exportStats = async (type: 'basic' | 'detailed' | 'events' | 'vendors' | 'pageant' | 'diaspora') => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/stats/export?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to export stats: ${response.statusText}`);
      }

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `groovy-december-${type}-stats-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export stats";
      setError(errorMessage);
      console.error("Error exporting stats:", err);
      return false;
    }
  };

  // Refresh all stats
  const refreshStats = async () => {
    await fetchStats();
    await fetchDetailedStats();
  };

  // Initialize data on mount
  useEffect(() => {
    fetchStats();
    fetchDetailedStats();
  }, []);

  return {
    stats,
    detailedStats,
    loading,
    error,
    fetchStats,
    fetchDetailedStats,
    fetchStatsByDateRange,
    fetchEventStats,
    fetchRevenueStats,
    exportStats,
    refreshStats,
  };
}