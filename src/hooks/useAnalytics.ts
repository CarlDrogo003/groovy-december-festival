'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// import { useSearchParams } from 'next/navigation'; // Commented out for deployment
import { trackPageView, trackEvent, analyticsEvents } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';

// Hook for automatic page tracking
export function usePageTracking() {
  const pathname = usePathname();
  // const searchParams = useSearchParams(); // Commented out for deployment
  const searchParams = null; // Neutralized with default value
  const { user, profile } = useAuth();

  useEffect(() => {
    // Track page views automatically
    const url = pathname; //+ (searchParams ? `?${searchParams.toString()}` : '');
    trackPageView(url);

    // Track section visits for festival analytics
    const section = pathname.split('/')[1] || 'home';
    analyticsEvents.navigationClick(section, pathname);

    // Set user properties if authenticated
    if (user && profile) {
      import('@/lib/analytics').then(({ setUserProperties }) => {
        setUserProperties({
          user_role: profile.role,
          festival_year: '2025',
          registration_status: 'registered',
        });
      });
    }
  }, [pathname, user, profile]); // Removed searchParams dependency
}

// Hook for event tracking with user context
export function useEventTracking() {
  const { user, profile } = useAuth();

  const trackWithUserContext = (eventName: string, parameters: any = {}) => {
    const enrichedParams = {
      ...parameters,
      user_role: profile?.role || 'anonymous',
      user_id: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
    };

    trackEvent(eventName, enrichedParams);
  };

  return {
    // Authentication events
    trackSignUp: (method: string) => {
      analyticsEvents.userSignUp(method, profile?.role);
    },
    
    trackLogin: (method: string) => {
      analyticsEvents.userLogin(method, profile?.role);
    },
    
    trackLogout: () => {
      analyticsEvents.userLogout(profile?.role);
    },

    // Event registration tracking
    trackEventRegistrationStart: (eventName: string) => {
      analyticsEvents.eventRegistrationStarted(eventName);
    },
    
    trackEventRegistration: (eventName: string, eventId: string, fee?: number) => {
      analyticsEvents.eventRegistration(eventName, eventId, fee);
    },
    
    trackEventRegistrationComplete: (eventName: string, paymentMethod?: string) => {
      analyticsEvents.eventRegistrationCompleted(eventName, paymentMethod);
    },

    // Pageant application tracking
    trackPageantApplicationStart: () => {
      analyticsEvents.pageantApplicationStarted();
    },
    
    trackPageantApplicationSubmit: (age: number) => {
      analyticsEvents.pageantApplicationSubmitted(age);
    },

    // Vendor application tracking
    trackVendorApplicationStart: (businessType?: string) => {
      analyticsEvents.vendorApplicationStarted(businessType);
    },
    
    trackVendorApplicationSubmit: (businessType?: string, fee?: number) => {
      analyticsEvents.vendorApplicationSubmitted(businessType, fee);
    },

    // Content engagement
    trackSponsorClick: (sponsorName: string, level: string) => {
      analyticsEvents.sponsorClick(sponsorName, level);
    },
    
    trackVideoPlay: (videoTitle: string, section: string) => {
      analyticsEvents.videoPlay(videoTitle, section);
    },
    
    trackDownload: (fileName: string) => {
      analyticsEvents.downloadBrochure(fileName);
    },
    
    trackSocialShare: (platform: string, content: string) => {
      analyticsEvents.socialShare(platform, content);
    },

    // Search and navigation
    trackSearch: (searchTerm: string, section: string) => {
      analyticsEvents.siteSearch(searchTerm, section);
    },
    
    trackNavigation: (linkText: string, destination: string) => {
      analyticsEvents.navigationClick(linkText, destination);
    },

    // Custom events with user context
    trackCustomEvent: trackWithUserContext,

    // Error tracking
    trackError: (errorType: string, errorMessage: string) => {
      analyticsEvents.error(errorType, errorMessage, window.location.pathname);
    },

    // Admin actions (for admin users)
    trackAdminAction: (action: string, target: string) => {
      if (profile?.role === 'admin') {
        analyticsEvents.adminAction(action, target, profile.role);
      }
    },

    // Payment tracking
    trackEventPaymentStart: (paymentType: string, amount: number, paymentMethod?: string) => {
      analyticsEvents.paymentStarted(paymentType, amount, paymentMethod);
    },

    trackEventPaymentSuccess: (paymentType: string, amount: number, transactionId: string, paymentMethod?: string) => {
      analyticsEvents.paymentCompleted(paymentType, amount, transactionId, paymentMethod);
    },

    trackEventPaymentFailed: (paymentType: string, amount: number, errorMessage: string, paymentMethod?: string) => {
      analyticsEvents.paymentFailed(paymentType, amount, errorMessage, paymentMethod);
    },

    trackEventPaymentCancelled: (paymentType: string, amount: number, paymentMethod?: string) => {
      analyticsEvents.paymentCancelled(paymentType, amount, paymentMethod);
    },
  };
}

// Hook for performance monitoring
export function usePerformanceTracking() {
  useEffect(() => {
    // Track page load performance
    const trackPerformance = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      // Track various performance metrics
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // DNS lookup time
        const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
        if (dnsTime > 0) {
          analyticsEvents.performanceMetric('dns_lookup_time', dnsTime, window.location.pathname);
        }

        // Server response time
        const responseTime = navigation.responseEnd - navigation.requestStart;
        if (responseTime > 0) {
          analyticsEvents.performanceMetric('server_response_time', responseTime, window.location.pathname);
        }

        // DOM processing time
        const domTime = navigation.domComplete - navigation.domContentLoadedEventStart;
        if (domTime > 0) {
          analyticsEvents.performanceMetric('dom_processing_time', domTime, window.location.pathname);
        }

        // Page load time
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        if (pageLoadTime > 0) {
          analyticsEvents.performanceMetric('page_load_time', pageLoadTime, window.location.pathname);
        }
      }

      // Track First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        analyticsEvents.performanceMetric('first_contentful_paint', fcp.startTime, window.location.pathname);
      }

      // Track Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              analyticsEvents.performanceMetric('largest_contentful_paint', lastEntry.startTime, window.location.pathname);
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation not supported:', e);
        }
      }
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
    }

    return () => {
      window.removeEventListener('load', trackPerformance);
    };
  }, []);
}

// Hook for tracking user engagement
export function useEngagementTracking() {
  const { profile } = useAuth();

  useEffect(() => {
    let startTime = Date.now();
    let isActive = true;

    // Track time spent on page
    const trackTimeSpent = () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime;
        if (timeSpent > 10000) { // Only track if user spent more than 10 seconds
          trackEvent('page_engagement', {
            event_category: 'engagement',
            time_spent: Math.round(timeSpent / 1000),
            user_role: profile?.role || 'anonymous',
            page_path: window.location.pathname,
          });
        }
      }
    };

    // Track user activity
    const handleActivity = () => {
      isActive = true;
      startTime = Date.now();
    };

    const handleInactivity = () => {
      isActive = false;
      trackTimeSpent();
    };

    // Event listeners for activity tracking
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Track when user becomes inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleInactivity();
      } else {
        handleActivity();
      }
    });

    // Track when user leaves page
    window.addEventListener('beforeunload', trackTimeSpent);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleInactivity);
      window.removeEventListener('beforeunload', trackTimeSpent);
      trackTimeSpent();
    };
  }, [profile]);
}

// Combined hook for comprehensive tracking
export function useAnalytics() {
  usePageTracking();
  usePerformanceTracking();
  useEngagementTracking();
  
  const eventTracking = useEventTracking();
  
  return eventTracking;
}