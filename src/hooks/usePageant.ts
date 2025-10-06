// src/hooks/usePageant.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Contestant {
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
  medical_conditions?: string;
  headshot_url?: string;
  full_body_url?: string;
  proof_of_payment_url?: string;
  declaration_agreed?: boolean;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  admin_notes?: string;
  rejection_reason?: string;
  payment_status?: 'pending' | 'paid' | 'refunded';
  payment_amount?: number;
  approved_at?: string;
  approved_by?: string;
}

export interface CreateContestantData {
  full_name: string;
  email: string;
  phone: string;
  age: number;
  bio: string;
  headshot_url?: string;
  full_body_url?: string;
  proof_of_payment_url?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateContestantData extends CreateContestantData {
  id: string;
}

export function usePageant() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch all contestants
  const fetchContestants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/pageant", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contestants: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setContestants(data.contestants || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch contestants";
      setError(errorMessage);
      console.error("Error fetching contestants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new contestant
  const createContestant = async (contestantData: CreateContestantData): Promise<Contestant | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/pageant", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contestantData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create contestant: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh contestants list
      await fetchContestants();
      
      return data.contestant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create contestant";
      setError(errorMessage);
      console.error("Error creating contestant:", err);
      return null;
    }
  };

  // Update existing contestant
  const updateContestant = async (contestantData: UpdateContestantData): Promise<Contestant | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/pageant/${contestantData.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contestantData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contestant: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh contestants list
      await fetchContestants();
      
      return data.contestant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update contestant";
      setError(errorMessage);
      console.error("Error updating contestant:", err);
      return null;
    }
  };

  // Delete contestant
  const deleteContestant = async (contestantId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/pageant/${contestantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contestant: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh contestants list
      await fetchContestants();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete contestant";
      setError(errorMessage);
      console.error("Error deleting contestant:", err);
      return false;
    }
  };

  // Update contestant status
  const updateContestantStatus = async (contestantId: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/pageant/${contestantId}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contestant status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh contestants list
      await fetchContestants();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update contestant status";
      setError(errorMessage);
      console.error("Error updating contestant status:", err);
      return false;
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, folder: string, email: string): Promise<string | null> => {
    try {
      setError(null);
      
      const fileName = `${folder}_${Date.now()}_${file.name}`;
      const filePath = `contestants/${email}/${fileName}`;
      
      const { error } = await supabase.storage
        .from("pageant-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("pageant-files")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload file";
      setError(errorMessage);
      console.error("Error uploading file:", err);
      return null;
    }
  };

  // Upload multiple files for contestant
  const uploadContestantFiles = async (
    files: { headshot?: File; fullBody?: File; proof?: File }, 
    email: string
  ): Promise<{ headshot_url?: string; full_body_url?: string; proof_of_payment_url?: string }> => {
    const urls: { headshot_url?: string; full_body_url?: string; proof_of_payment_url?: string } = {};

    if (files.headshot) {
      const url = await uploadFile(files.headshot, "headshot", email);
      if (url) urls.headshot_url = url;
    }

    if (files.fullBody) {
      const url = await uploadFile(files.fullBody, "fullbody", email);
      if (url) urls.full_body_url = url;
    }

    if (files.proof) {
      const url = await uploadFile(files.proof, "proof", email);
      if (url) urls.proof_of_payment_url = url;
    }

    return urls;
  };

  // Initialize data on mount
  useEffect(() => {
    fetchContestants();
  }, []);

  return {
    contestants,
    loading,
    error,
    fetchContestants,
    createContestant,
    updateContestant,
    deleteContestant,
    updateContestantStatus,
    uploadFile,
    uploadContestantFiles,
  };
}