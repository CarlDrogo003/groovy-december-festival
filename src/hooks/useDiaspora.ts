// src/hooks/useDiaspora.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Tour {
  id: string;
  name: string;
  price_usd: number;
  duration?: string;
  description?: string;
  benefits?: string[];
  created_at: string;
  status?: 'draft' | 'published' | 'sold_out' | 'cancelled';
  max_participants?: number;
  current_bookings?: number;
  start_date?: string;
  end_date?: string;
  booking_deadline?: string;
  featured_image?: string;
  is_featured?: boolean;
  created_by?: string;
}

export interface TourBooking {
  id: string;
  tour_id: string;
  full_name: string;
  email: string;
  phone?: string;
  referral?: string;
  travelers: number;
  special_requests?: string;
  created_at: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: 'pending' | 'partial' | 'paid' | 'refunded';
  total_amount?: number;
  amount_paid?: number;
  admin_notes?: string;
  confirmed_at?: string;
  confirmed_by?: string;
  tour?: Tour;
}

export interface CreateTourData {
  name: string;
  price_usd: number;
  duration: string;
  description: string;
  benefits: string[];
  active?: boolean;
}

export interface UpdateTourData extends CreateTourData {
  id: string;
}

export interface CreateBookingData {
  tour_id: string;
  full_name: string;
  email: string;
  phone?: string;
  travelers: number;
  special_requests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface UpdateBookingData extends CreateBookingData {
  id: string;
}

export function useDiaspora() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch all tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/diaspora/tours", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tours: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTours(data.tours || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tours";
      setError(errorMessage);
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/diaspora/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setBookings(data.bookings || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bookings";
      setError(errorMessage);
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new tour
  const createTour = async (tourData: CreateTourData): Promise<Tour | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/diaspora/tours", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create tour: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh tours list
      await fetchTours();
      
      return data.tour;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create tour";
      setError(errorMessage);
      console.error("Error creating tour:", err);
      return null;
    }
  };

  // Update existing tour
  const updateTour = async (tourData: UpdateTourData): Promise<Tour | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/diaspora/tours/${tourData.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update tour: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh tours list
      await fetchTours();
      
      return data.tour;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update tour";
      setError(errorMessage);
      console.error("Error updating tour:", err);
      return null;
    }
  };

  // Delete tour
  const deleteTour = async (tourId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/diaspora/tours/${tourId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete tour: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh tours list
      await fetchTours();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete tour";
      setError(errorMessage);
      console.error("Error deleting tour:", err);
      return false;
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/diaspora/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update booking status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh bookings list
      await fetchBookings();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update booking status";
      setError(errorMessage);
      console.error("Error updating booking status:", err);
      return false;
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/diaspora/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete booking: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh bookings list
      await fetchBookings();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete booking";
      setError(errorMessage);
      console.error("Error deleting booking:", err);
      return false;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchTours();
    fetchBookings();
  }, []);

  return {
    tours,
    bookings,
    loading,
    error,
    fetchTours,
    fetchBookings,
    createTour,
    updateTour,
    deleteTour,
    updateBookingStatus,
    deleteBooking,
  };
}