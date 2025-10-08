'use client';

import { useState, useEffect } from 'react';
import { setAnalyticsConsent } from '@/lib/analytics';

const CONSENT_KEY = 'groovy-december-analytics-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    
    if (consent === null) {
      // No previous choice, show banner
      setShowBanner(true);
    } else {
      // Apply previous choice
      const granted = consent === 'granted';
      setAnalyticsConsent(granted);
    }
    
    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setAnalyticsConsent(true);
    setShowBanner(false);

    // Track consent acceptance
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'consent_granted', {
        event_category: 'privacy',
        event_label: 'analytics_consent',
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setAnalyticsConsent(false);
    setShowBanner(false);

    // Track consent decline
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'consent_denied', {
        event_category: 'privacy',
        event_label: 'analytics_consent',
      });
    }
  };

  if (isLoading || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-600 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 Cookie & Privacy Notice
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies and analytics to improve your experience on our festival website. 
              This helps us understand how visitors interact with our site and improve our services. 
              Your data is handled according to our privacy policy and GDPR compliance standards.
            </p>
            <div className="mt-2">
              <a 
                href="/privacy-policy" 
                className="text-green-600 hover:text-green-700 text-sm underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Privacy Policy
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              Accept Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing consent preferences
export function useAnalyticsConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent) {
      setConsent(storedConsent === 'granted');
    }
  }, []);

  const updateConsent = (granted: boolean) => {
    localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
    setAnalyticsConsent(granted);
    setConsent(granted);
  };

  const clearConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
  };

  return {
    consent,
    updateConsent,
    clearConsent,
    hasConsent: consent !== null,
  };
}