// Database types generated from Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'vendor' | 'contestant' | 'user';
          phone: string | null;
          company: string | null;
          bio: string | null;
          profile_image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin' | 'vendor' | 'contestant' | 'user';
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'admin' | 'vendor' | 'contestant' | 'user';
          phone?: string | null;
          company?: string | null;
          bio?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          slug: string;
          date: string;
          time: string | null;
          location: string | null;
          image_url: string | null;
          capacity: number | null;
          registration_fee: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          slug: string;
          date: string;
          time?: string | null;
          location?: string | null;
          image_url?: string | null;
          capacity?: number | null;
          registration_fee?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          slug?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          image_url?: string | null;
          capacity?: number | null;
          registration_fee?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          additional_info: any | null;
          payment_status: 'pending' | 'paid' | 'failed';
          payment_reference: string | null;
          registered_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          additional_info?: any | null;
          payment_status?: 'pending' | 'paid' | 'failed';
          payment_reference?: string | null;
          registered_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          additional_info?: any | null;
          payment_status?: 'pending' | 'paid' | 'failed';
          payment_reference?: string | null;
          registered_at?: string;
        };
      };
      pageant_contestants: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          age: number;
          height: string | null;
          occupation: string | null;
          education: string | null;
          bio: string | null;
          photo_url: string | null;
          application_status: 'pending' | 'approved' | 'rejected';
          contestant_number: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          age: number;
          height?: string | null;
          occupation?: string | null;
          education?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          application_status?: 'pending' | 'approved' | 'rejected';
          contestant_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          age?: number;
          height?: string | null;
          occupation?: string | null;
          education?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          application_status?: 'pending' | 'approved' | 'rejected';
          contestant_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          description: string | null;
          sponsorship_level: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
          amount: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          sponsorship_level?: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
          amount?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          sponsorship_level?: 'platinum' | 'gold' | 'silver' | 'bronze' | null;
          amount?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_type: string | null;
          description: string | null;
          contact_email: string;
          contact_phone: string | null;
          website: string | null;
          logo_url: string | null;
          application_status: 'pending' | 'approved' | 'rejected';
          booth_number: string | null;
          booth_fee: number | null;
          payment_status: 'pending' | 'paid' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          business_type?: string | null;
          description?: string | null;
          contact_email: string;
          contact_phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          application_status?: 'pending' | 'approved' | 'rejected';
          booth_number?: string | null;
          booth_fee?: number | null;
          payment_status?: 'pending' | 'paid' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          business_type?: string | null;
          description?: string | null;
          contact_email?: string;
          contact_phone?: string | null;
          website?: string | null;
          logo_url?: string | null;
          application_status?: 'pending' | 'approved' | 'rejected';
          booth_number?: string | null;
          booth_fee?: number | null;
          payment_status?: 'pending' | 'paid' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
      };
      raffle_entries: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          ticket_number: string;
          entry_date: string;
          is_winner: boolean;
          prize_claimed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          ticket_number: string;
          entry_date?: string;
          is_winner?: boolean;
          prize_claimed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          ticket_number?: string;
          entry_date?: string;
          is_winner?: boolean;
          prize_claimed?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
export type PageantContestant = Database['public']['Tables']['pageant_contestants']['Row'];
export type Sponsor = Database['public']['Tables']['sponsors']['Row'];
export type Vendor = Database['public']['Tables']['vendors']['Row'];
export type RaffleEntry = Database['public']['Tables']['raffle_entries']['Row'];

export type UserRole = 'admin' | 'vendor' | 'contestant' | 'user';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type SponsorshipLevel = 'platinum' | 'gold' | 'silver' | 'bronze';

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Form data types
export interface UserRegistrationData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface EventRegistrationData {
  event_id: string;
  full_name: string;
  email: string;
  phone?: string;
  additional_info?: Record<string, any>;
}

export interface PageantApplicationData {
  full_name: string;
  email: string;
  phone: string;
  age: number;
  height?: string;
  occupation?: string;
  education?: string;
  bio?: string;
}

export interface VendorApplicationData {
  business_name: string;
  business_type?: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
}