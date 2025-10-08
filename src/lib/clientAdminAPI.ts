// Client-side admin utilities that work through API routes
'use client';

export class ClientAdminAPI {
  // Get dashboard stats through API route
  static async getDashboardStats() {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data: data.counts, error: null };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error };
    }
  }

  // Get detailed stats through API route
  static async getDetailedStats() {
    try {
      const response = await fetch('/api/admin/stats/detailed');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data: data.stats, error: null };
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      return { data: null, error };
    }
  }

  // Mock recent activity for now (you can add an API route later)
  static async getRecentActivity() {
    // This would normally come from an API route
    // For now, return mock data
    return {
      data: [
        {
          type: 'registration',
          description: 'New event registration received',
          timestamp: new Date().toISOString(),
          user: 'System'
        },
        {
          type: 'vendor',
          description: 'Vendor application approved',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Admin'
        }
      ],
      error: null
    };
  }
}