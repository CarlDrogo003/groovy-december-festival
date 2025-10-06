// src/hooks/useVendors.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Vendor {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone?: string;
  package: string;
  created_at: string;
  business_type?: 'food' | 'merchandise' | 'services' | 'other';
  description?: string;
  website?: string;
  status?: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  rejection_reason?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface CreateVendorData {
  business_name: string;
  owner_name: string;
  email: string;
  phone?: string;
  package: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateVendorData extends CreateVendorData {
  id: string;
}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token helper
  const getAuthToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch vendors: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setVendors(data.vendors || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch vendors";
      setError(errorMessage);
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new vendor
  const createVendor = async (vendorData: CreateVendorData): Promise<Vendor | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch("/api/admin/vendors", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create vendor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh vendors list
      await fetchVendors();
      
      return data.vendor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create vendor";
      setError(errorMessage);
      console.error("Error creating vendor:", err);
      return null;
    }
  };

  // Update existing vendor
  const updateVendor = async (vendorData: UpdateVendorData): Promise<Vendor | null> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/vendors/${vendorData.id}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update vendor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh vendors list
      await fetchVendors();
      
      return data.vendor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update vendor";
      setError(errorMessage);
      console.error("Error updating vendor:", err);
      return null;
    }
  };

  // Delete vendor
  const deleteVendor = async (vendorId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete vendor: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh vendors list
      await fetchVendors();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete vendor";
      setError(errorMessage);
      console.error("Error deleting vendor:", err);
      return false;
    }
  };

  // Update vendor status
  const updateVendorStatus = async (vendorId: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/vendors/${vendorId}/status`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update vendor status: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Refresh vendors list
      await fetchVendors();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update vendor status";
      setError(errorMessage);
      console.error("Error updating vendor status:", err);
      return false;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    updateVendorStatus,
  };
}