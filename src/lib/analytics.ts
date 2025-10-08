// Google Analytics 4 (GA4) implementation for Groovy December Festival
// Comprehensive tracking for user behavior, events, and performance

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') {
    console.warn('Google Analytics ID not found or running on server');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced e-commerce tracking
    allow_enhanced_conversions: true,
    // Performance monitoring
    custom_map: {
      'custom_parameter_1': 'user_role',
      'custom_parameter_2': 'festival_section',
    }
  });

  console.log('Google Analytics initialized:', GA_TRACKING_ID);
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Event tracking for festival-specific actions
export const trackEvent = (
  eventName: string,
  parameters: {
    event_category?: string;
    event_label?: string;
    value?: number;
    user_role?: string;
    festival_section?: string;
    [key: string]: any;
  } = {}
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: parameters.event_category || 'general',
      event_label: parameters.event_label,
      value: parameters.value,
      custom_parameter_1: parameters.user_role,
      custom_parameter_2: parameters.festival_section,
      ...parameters,
    });
  }
};

// Festival-specific event trackers
export const analyticsEvents = {
  // User Authentication Events
  userSignUp: (method: string, userRole?: string) => {
    trackEvent('sign_up', {
      method,
      event_category: 'authentication',
      user_role: userRole,
      event_label: 'user_registration',
    });
  },

  userLogin: (method: string, userRole?: string) => {
    trackEvent('login', {
      method,
      event_category: 'authentication',
      user_role: userRole,
      event_label: 'user_login',
    });
  },

  userLogout: (userRole?: string) => {
    trackEvent('logout', {
      event_category: 'authentication',
      user_role: userRole,
      event_label: 'user_logout',
    });
  },

  // Event Registration Tracking
  eventRegistration: (eventName: string, eventId: string, fee?: number) => {
    trackEvent('event_registration', {
      event_category: 'registrations',
      event_label: eventName,
      festival_section: 'events',
      event_id: eventId,
      value: fee || 0,
      currency: 'NGN',
    });
  },

  eventRegistrationStarted: (eventName: string) => {
    trackEvent('begin_checkout', {
      event_category: 'registrations',
      event_label: eventName,
      festival_section: 'events',
    });
  },

  eventRegistrationCompleted: (eventName: string, paymentMethod?: string) => {
    trackEvent('purchase', {
      event_category: 'registrations',
      event_label: eventName,
      festival_section: 'events',
      payment_method: paymentMethod,
    });
  },

  // Pageant Application Tracking
  pageantApplicationStarted: () => {
    trackEvent('pageant_application_started', {
      event_category: 'applications',
      festival_section: 'pageant',
      event_label: 'application_form_opened',
    });
  },

  pageantApplicationSubmitted: (contestantAge: number) => {
    trackEvent('pageant_application_submitted', {
      event_category: 'applications',
      festival_section: 'pageant',
      event_label: 'application_completed',
      contestant_age: contestantAge,
    });
  },

  // Vendor Application Tracking
  vendorApplicationStarted: (businessType?: string) => {
    trackEvent('vendor_application_started', {
      event_category: 'applications',
      festival_section: 'vendors',
      event_label: 'vendor_form_opened',
      business_type: businessType,
    });
  },

  vendorApplicationSubmitted: (businessType?: string, boothFee?: number) => {
    trackEvent('vendor_application_submitted', {
      event_category: 'applications',
      festival_section: 'vendors',
      event_label: 'vendor_application_completed',
      business_type: businessType,
      value: boothFee || 0,
      currency: 'NGN',
    });
  },

  // Sponsor Interaction Tracking
  sponsorClick: (sponsorName: string, sponsorLevel: string) => {
    trackEvent('sponsor_click', {
      event_category: 'engagement',
      festival_section: 'sponsors',
      event_label: sponsorName,
      sponsor_level: sponsorLevel,
    });
  },

  // Content Engagement
  videoPlay: (videoTitle: string, section: string) => {
    trackEvent('video_play', {
      event_category: 'engagement',
      festival_section: section,
      event_label: videoTitle,
    });
  },

  downloadBrochure: (brochureType: string) => {
    trackEvent('file_download', {
      event_category: 'engagement',
      festival_section: 'resources',
      event_label: brochureType,
      file_type: 'pdf',
    });
  },

  socialShare: (platform: string, content: string) => {
    trackEvent('share', {
      method: platform,
      event_category: 'engagement',
      event_label: content,
      content_type: 'festival_content',
    });
  },

  // Search and Navigation
  siteSearch: (searchTerm: string, section: string) => {
    trackEvent('search', {
      search_term: searchTerm,
      event_category: 'navigation',
      festival_section: section,
    });
  },

  navigationClick: (linkText: string, destination: string) => {
    trackEvent('navigation_click', {
      event_category: 'navigation',
      event_label: linkText,
      link_destination: destination,
    });
  },

  // Admin Dashboard Events
  adminAction: (action: string, target: string, userRole: string) => {
    trackEvent('admin_action', {
      event_category: 'admin',
      event_label: action,
      admin_target: target,
      user_role: userRole,
    });
  },

  // Error Tracking
  error: (errorType: string, errorMessage: string, page: string) => {
    trackEvent('exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      event_category: 'errors',
      page_location: page,
    });
  },

  // Performance Events
  performanceMetric: (metricName: string, value: number, page: string) => {
    trackEvent('performance_metric', {
      event_category: 'performance',
      metric_name: metricName,
      metric_value: value,
      page_location: page,
      value: Math.round(value),
    });
  },

  // Payment tracking events
  paymentStarted: (paymentType: string, amount: number, paymentMethod?: string) => {
    trackEvent('begin_checkout', {
      event_category: 'payments',
      currency: 'NGN',
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
    });
  },

  paymentCompleted: (paymentType: string, amount: number, transactionId: string, paymentMethod?: string) => {
    trackEvent('purchase', {
      event_category: 'payments',
      transaction_id: transactionId,
      currency: 'NGN', 
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
    });
  },

  paymentFailed: (paymentType: string, amount: number, errorMessage: string, paymentMethod?: string) => {
    trackEvent('payment_failed', {
      event_category: 'payments',
      currency: 'NGN',
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
      error_message: errorMessage,
    });
  },

  paymentCancelled: (paymentType: string, amount: number, paymentMethod?: string) => {
    trackEvent('payment_cancelled', {
      event_category: 'payments',
      currency: 'NGN',
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
    });
  },
};

// Core Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const metricName = entry.name;
      const metricValue = Math.round(entry.startTime);
      
      analyticsEvents.performanceMetric(
        metricName,
        metricValue,
        window.location.pathname
      );
    }
  });

  // Observe various performance metrics
  try {
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  } catch (e) {
    // Browser might not support all entry types
    console.warn('Some performance metrics not supported:', e);
  }

  // Track custom performance metrics
  window.addEventListener('load', () => {
    // Page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      analyticsEvents.performanceMetric('page_load_time', pageLoadTime, window.location.pathname);
    }

    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      analyticsEvents.performanceMetric('first_contentful_paint', fcp.startTime, window.location.pathname);
    }
  });
};

// Enhanced e-commerce tracking for festival
export const ecommerceEvents = {
  viewItem: (itemId: string, itemName: string, category: string, value: number) => {
    trackEvent('view_item', {
      currency: 'NGN',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: value,
        quantity: 1,
      }]
    });
  },

  addToCart: (itemId: string, itemName: string, category: string, value: number) => {
    trackEvent('add_to_cart', {
      currency: 'NGN',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: value,
        quantity: 1,
      }]
    });
  },

  purchase: (transactionId: string, items: any[], totalValue: number) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: 'NGN',
      value: totalValue,
      items: items,
    });
  },

  // Payment tracking events
  paymentStarted: (paymentType: string, amount: number, paymentMethod?: string) => {
    trackEvent('begin_checkout', {
      event_category: 'payments',
      currency: 'NGN',
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
    });
  },

  paymentCompleted: (paymentType: string, amount: number, transactionId: string, paymentMethod?: string) => {
    trackEvent('purchase', {
      event_category: 'payments',
      transaction_id: transactionId,
      currency: 'NGN', 
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
    });
  },

  paymentFailed: (paymentType: string, amount: number, errorMessage: string, paymentMethod?: string) => {
    trackEvent('payment_failed', {
      event_category: 'payments',
      currency: 'NGN',
      value: amount,
      payment_type: paymentType,
      payment_method: paymentMethod || 'monnify',
      error_message: errorMessage,
    });
  },

};

// User properties for better segmentation
export const setUserProperties = (properties: {
  user_role?: string;
  festival_year?: string;
  registration_status?: string;
  preferred_events?: string;
  location?: string;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      user_properties: properties,
    });
  }
};

// Consent management for GDPR compliance
export const setAnalyticsConsent = (granted: boolean) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: granted ? 'granted' : 'denied',
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  analyticsEvents,
  trackWebVitals,
  ecommerceEvents,
  setUserProperties,
  setAnalyticsConsent,
};