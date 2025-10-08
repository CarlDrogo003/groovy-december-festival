import { supabaseAdmin } from './supabaseAdminServer';
import { supabase } from './supabaseClient';
import type { Database } from '../types/database';

// Client-side authentication utilities
export async function getClientUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, profile: null, error };
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { 
      user, 
      profile: profile || null, 
      error: profileError 
    };
  } catch (error) {
    console.error('Client auth error:', error);
    return { user: null, profile: null, error };
  }
}

// Check if user has required role
export async function hasRole(requiredRoles: string | string[]) {
  const { profile } = await getClientUser();
  
  if (!profile) return false;
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(profile.role);
}

// Admin-only operations using service role
export class AdminAPI {
  // User management
  static async getAllUsers(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    return { data, error, count, page, limit };
  }

  static async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  static async deactivateUser(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  // Event management
  static async createEvent(eventData: any) {
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert([eventData])
      .select()
      .single();

    return { data, error };
  }

  static async updateEvent(eventId: string, eventData: any) {
    const { data, error } = await supabaseAdmin
      .from('events')
      .update({ ...eventData, updated_at: new Date().toISOString() })
      .eq('id', eventId)
      .select()
      .single();

    return { data, error };
  }

  static async deleteEvent(eventId: string) {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', eventId);

    return { error };
  }

  // Registration management
  static async getEventRegistrations(eventId?: string) {
    let query = supabaseAdmin
      .from('event_registrations')
      .select(`
        *,
        events(title, date, location),
        profiles(full_name, email)
      `);

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query.order('registered_at', { ascending: false });
    return { data, error };
  }

  // Contestant management
  static async getPageantContestants(status?: string) {
    let query = supabaseAdmin
      .from('pageant_contestants')
      .select('*');

    if (status) {
      query = query.eq('application_status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  }

  static async updateContestantStatus(contestantId: string, status: string, contestantNumber?: number) {
    const updateData: any = { 
      application_status: status, 
      updated_at: new Date().toISOString() 
    };
    
    if (contestantNumber) {
      updateData.contestant_number = contestantNumber;
    }

    const { data, error } = await supabaseAdmin
      .from('pageant_contestants')
      .update(updateData)
      .eq('id', contestantId)
      .select()
      .single();

    return { data, error };
  }

  // Vendor management
  static async getVendors(status?: string) {
    let query = supabaseAdmin
      .from('vendors')
      .select('*');

    if (status) {
      query = query.eq('application_status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  }

  static async updateVendorStatus(vendorId: string, status: string, boothNumber?: string) {
    const updateData: any = { 
      application_status: status, 
      updated_at: new Date().toISOString() 
    };
    
    if (boothNumber) {
      updateData.booth_number = boothNumber;
    }

    const { data, error } = await supabaseAdmin
      .from('vendors')
      .update(updateData)
      .eq('id', vendorId)
      .select()
      .single();

    return { data, error };
  }

  // Analytics
  static async getDashboardStats() {
    try {
      // Get user counts by role
      const { data: userStats } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('is_active', true);

      // Get event registrations count
      const { count: registrationCount } = await supabaseAdmin
        .from('event_registrations')
        .select('*', { count: 'exact', head: true });

      // Get active events count
      const { count: eventCount } = await supabaseAdmin
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get pageant contestants count
      const { count: contestantCount } = await supabaseAdmin
        .from('pageant_contestants')
        .select('*', { count: 'exact', head: true });

      // Get approved vendors count
      const { count: vendorCount } = await supabaseAdmin
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'approved');

      // Process user stats
      const roleStats = userStats?.reduce((acc: any, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        data: {
          totalUsers: userStats?.length || 0,
          adminUsers: roleStats.admin || 0,
          regularUsers: roleStats.user || 0,
          totalRegistrations: registrationCount || 0,
          activeEvents: eventCount || 0,
          totalContestants: contestantCount || 0,
          approvedVendors: vendorCount || 0,
        },
        error: null
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return { data: null, error };
    }
  }

  // Raffle management
  static async drawRaffleWinner() {
    try {
      // Get all raffle entries that haven't won
      const { data: entries, error: fetchError } = await supabaseAdmin
        .from('raffle_entries')
        .select('*')
        .eq('is_winner', false);

      if (fetchError || !entries || entries.length === 0) {
        return { data: null, error: fetchError || 'No entries available' };
      }

      // Random selection
      const randomIndex = Math.floor(Math.random() * entries.length);
      const winner = entries[randomIndex];

      // Update winner status
      const { data, error } = await supabaseAdmin
        .from('raffle_entries')
        .update({ is_winner: true })
        .eq('id', winner.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Raffle draw error:', error);
      return { data: null, error };
    }
  }
}

// Input validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Rate limiting utility (in-memory store for demo - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export default AdminAPI;