'use client';

import { useState, useEffect } from 'react';
import { AdminAPI } from '@/lib/api';

interface AnalyticsData {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalRegistrations: number;
  activeEvents: number;
  totalContestants: number;
  approvedVendors: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

interface WebVitalsData {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [webVitals, setWebVitals] = useState<WebVitalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
    loadWebVitals();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      const { data, error } = await AdminAPI.getDashboardStats();
      if (error) throw error;
      
      setAnalyticsData({
        totalUsers: data?.totalUsers || 0,
        adminUsers: data?.adminUsers || 0,
        regularUsers: data?.regularUsers || 0,
        totalRegistrations: data?.totalRegistrations || 0,
        activeEvents: data?.activeEvents || 0,
        totalContestants: data?.totalContestants || 0,
        approvedVendors: data?.approvedVendors || 0,
        recentActivity: [
          {
            type: 'registration',
            description: 'New event registration for Cultural Night',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'John Doe'
          },
          {
            type: 'application',
            description: 'New pageant contestant application',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: 'Jane Smith'
          },
          {
            type: 'vendor',
            description: 'Vendor application approved',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            user: 'Admin User'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadWebVitals = () => {
    // Simulate Web Vitals data (in production, this would come from GA4 API)
    setWebVitals({
      pageLoadTime: 2.3,
      firstContentfulPaint: 1.2,
      largestContentfulPaint: 2.8,
      cumulativeLayoutShift: 0.05,
      firstInputDelay: 12,
    });
    
    setLoading(false);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    color = 'green' 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: string; 
    color?: 'green' | 'blue' | 'purple' | 'orange' | 'red' 
  }) => {
    const colorClasses = {
      green: 'bg-green-50 text-green-600 border-green-200',
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      red: 'bg-red-50 text-red-600 border-red-200',
    };

    return (
      <div className={`p-6 rounded-xl border-2 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p className="text-xs mt-1 opacity-60">
                {change} from last period
              </p>
            )}
          </div>
          <div className="text-3xl opacity-50">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const WebVitalCard = ({ 
    metric, 
    value, 
    unit, 
    threshold, 
    description 
  }: { 
    metric: string; 
    value: number; 
    unit: string; 
    threshold: number; 
    description: string; 
  }) => {
    const isGood = value <= threshold;
    const colorClass = isGood ? 'text-green-600' : 'text-orange-600';
    const bgClass = isGood ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200';

    return (
      <div className={`p-4 rounded-lg border ${bgClass}`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{metric}</h4>
          <span className={`text-sm font-medium ${colorClass}`}>
            {isGood ? '✓ Good' : '⚠ Needs Improvement'}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${colorClass}`}>
            {value}
          </span>
          <span className="text-sm text-gray-600">{unit}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your festival website performance and user engagement
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analyticsData.totalUsers}
            change="+12% ↗"
            icon="👥"
            color="blue"
          />
          <StatCard
            title="Event Registrations"
            value={analyticsData.totalRegistrations}
            change="+18% ↗"
            icon="🎫"
            color="green"
          />
          <StatCard
            title="Active Events"
            value={analyticsData.activeEvents}
            change="+5% ↗"
            icon="🎉"
            color="purple"
          />
          <StatCard
            title="Approved Vendors"
            value={analyticsData.approvedVendors}
            change="+8% ↗"
            icon="🏪"
            color="orange"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Breakdown */}
        {analyticsData && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Regular Users</span>
                <span className="font-medium">{analyticsData.regularUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Contestants</span>
                <span className="font-medium">{analyticsData.totalContestants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vendors</span>
                <span className="font-medium">{analyticsData.approvedVendors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admins</span>
                <span className="font-medium">{analyticsData.adminUsers}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {analyticsData && (
          <div className="lg:col-span-2 bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-medium flex-shrink-0">
                    {activity.type === 'registration' ? '🎫' : 
                     activity.type === 'application' ? '👑' : '🏪'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Web Vitals Performance */}
      {webVitals && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Core Web Vitals</h3>
              <p className="text-sm text-gray-600">
                Performance metrics that affect user experience and SEO rankings
              </p>
            </div>
            <a
              href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_ID}/reports/reportinghub`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View in GA4 →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <WebVitalCard
              metric="Page Load"
              value={webVitals.pageLoadTime}
              unit="s"
              threshold={3.0}
              description="Time until page is fully loaded"
            />
            <WebVitalCard
              metric="FCP"
              value={webVitals.firstContentfulPaint}
              unit="s"
              threshold={1.8}
              description="First Contentful Paint"
            />
            <WebVitalCard
              metric="LCP"
              value={webVitals.largestContentfulPaint}
              unit="s"
              threshold={2.5}
              description="Largest Contentful Paint"
            />
            <WebVitalCard
              metric="CLS"
              value={webVitals.cumulativeLayoutShift}
              unit=""
              threshold={0.1}
              description="Cumulative Layout Shift"
            />
            <WebVitalCard
              metric="FID"
              value={webVitals.firstInputDelay}
              unit="ms"
              threshold={100}
              description="First Input Delay"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_ID}/reports/reportinghub`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              📊
            </div>
            <div>
              <h4 className="font-medium text-gray-900 group-hover:text-blue-700">Google Analytics</h4>
              <p className="text-sm text-gray-600">Detailed reports and insights</p>
            </div>
          </a>
          
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              🔍
            </div>
            <div>
              <h4 className="font-medium text-gray-900 group-hover:text-green-700">Search Console</h4>
              <p className="text-sm text-gray-600">SEO performance and indexing</p>
            </div>
          </a>
          
          <a
            href="https://developers.google.com/speed/pagespeed/insights/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              ⚡
            </div>
            <div>
              <h4 className="font-medium text-gray-900 group-hover:text-orange-700">PageSpeed Insights</h4>
              <p className="text-sm text-gray-600">Performance optimization</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}