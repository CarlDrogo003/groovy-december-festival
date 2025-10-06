// src/hooks/useSponsors.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  category: 'government' | 'corporate' | 'ngo' | 'individual';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  description: string | null;
  created_at: string;
  active: boolean;
}

export interface CreateSponsorData {
  name: string;
  logo_url?: string;
  website_url?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  category: 'government' | 'corporate' | 'ngo' | 'individual';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
  description?: string;
  active?: boolean;
}

export interface UpdateSponsorData extends CreateSponsorData {
  id: string;
}

export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch all sponsors
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setSponsors(data.sponsors || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch sponsors";
      setError(errorMessage);
      console.error("Error fetching sponsors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new sponsor
  const createSponsor = async (sponsorData: CreateSponsorData): Promise<Sponsor | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sponsorData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create sponsor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh sponsors list
      await fetchSponsors();
      
      return data.sponsor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create sponsor";
      setError(errorMessage);
      console.error("Error creating sponsor:", err);
      return null;
    }
  };

  // Update existing sponsor
  const updateSponsor = async (sponsorData: UpdateSponsorData): Promise<Sponsor | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/sponsors/${sponsorData.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sponsorData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sponsor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh sponsors list
      await fetchSponsors();
      
      return data.sponsor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update sponsor";
      setError(errorMessage);
      console.error("Error updating sponsor:", err);
      return null;
    }
  };

  // Delete sponsor
  const deleteSponsor = async (sponsorId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/sponsors/${sponsorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete sponsor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh sponsors list
      await fetchSponsors();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete sponsor";
      setError(errorMessage);
      console.error("Error deleting sponsor:", err);
      return false;
    }
  };

  // Upload logo to Supabase Storage
  const uploadLogo = async (file: File, sponsorName: string): Promise<string | null> => {
    try {
      setError(null);
      
      const fileName = `${Date.now()}-${sponsorName.replace(/\s+/g, '_')}-${file.name}`;
      const { error } = await supabase.storage
        .from("sponsor-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("sponsor-logos")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload logo";
      setError(errorMessage);
      console.error("Error uploading logo:", err);
      return null;
    }
  };

  // Toggle sponsor active status
  const toggleSponsorStatus = async (sponsorId: string, active: boolean): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/sponsors/${sponsorId}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sponsor status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh sponsors list
      await fetchSponsors();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update sponsor status";
      setError(errorMessage);
      console.error("Error updating sponsor status:", err);
      return false;
    }
  };

  // Get sponsors by category
  const getSponsorsByCategory = (category: string) => {
    return sponsors.filter(sponsor => sponsor.category === category && sponsor.active);
  };

  // Get sponsors by tier
  const getSponsorsByTier = (tier: string) => {
    return sponsors.filter(sponsor => sponsor.tier === tier && sponsor.active);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchSponsors();
  }, []);

  return {
    sponsors,
    loading,
    error,
    fetchSponsors,
    createSponsor,
    updateSponsor,
    deleteSponsor,
    uploadLogo,
    toggleSponsorStatus,
    getSponsorsByCategory,
    getSponsorsByTier,
  };
}