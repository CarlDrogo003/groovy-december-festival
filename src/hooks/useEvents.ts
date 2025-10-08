// src/hooks/useEvents.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  venue: string;
  description?: string;
  banner_image?: string;
  max_capacity?: number;
  current_registrations?: number;
  registration_fee?: number;
  requires_approval?: boolean;
  status?: 'draft' | 'published' | 'cancelled';
  created_at?: string;
}

export interface CreateEventData {
  title: string;
  slug: string;
  date: string;
  venue: string;
  description?: string;
  banner_image?: string;
  max_capacity?: number;
  registration_fee?: number;
  requires_approval?: boolean;
  status?: 'draft' | 'published' | 'cancelled';
}

export interface UpdateEventData extends CreateEventData {
  id: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setEvents(data.events || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (eventData: CreateEventData): Promise<Event | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh events list
      await fetchEvents();
      
      return data.event;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
      console.error("Error creating event:", err);
      return null;
    }
  };

  // Update existing event
  const updateEvent = async (eventData: UpdateEventData): Promise<Event | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/events/${eventData.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh events list
      await fetchEvents();
      
      return data.event;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update event";
      setError(errorMessage);
      console.error("Error updating event:", err);
      return null;
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh events list
      await fetchEvents();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete event";
      setError(errorMessage);
      console.error("Error deleting event:", err);
      return false;
    }
  };

  // Upload banner to Supabase Storage
  const uploadBanner = async (file: File): Promise<string | null> => {
    try {
      setError(null);
      
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("event-banners")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("event-banners")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload banner";
      setError(errorMessage);
      console.error("Error uploading banner:", err);
      return null;
    }
  };

  // Fetch event registrations
  const fetchEventRegistrations = async (eventId: string): Promise<EventRegistration[]> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/events/${eventId}/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.registrations || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch registrations";
      setError(errorMessage);
      console.error("Error fetching event registrations:", err);
      return [];
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadBanner,
    fetchEventRegistrations,
  };
}