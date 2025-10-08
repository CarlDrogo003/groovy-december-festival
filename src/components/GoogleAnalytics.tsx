'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { initGA, trackWebVitals } from '@/lib/analytics';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export default function GoogleAnalytics() {
  useEffect(() => {
    // Initialize GA4 when component mounts
    initGA();
    
    // Start tracking Core Web Vitals
    trackWebVitals();
  }, []);

  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics ID not found');
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 (GA4) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure GA4 with enhanced features
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              // Enhanced conversions for better data quality
              allow_enhanced_conversions: true,
              // Custom parameters for festival tracking
              custom_map: {
                'custom_parameter_1': 'user_role',
                'custom_parameter_2': 'festival_section',
              },
              // Cookie settings for compliance
              cookie_flags: 'SameSite=None;Secure',
              // Privacy settings
              anonymize_ip: true,
              // Performance monitoring
              enable_web_vitals_collection: true,
            });

            // Set default consent state (can be updated based on user choice)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'wait_for_update': 500,
            });
          `,
        }}
      />

      {/* Google Tag Manager (Optional - for advanced tracking) */}
      {GTM_ID && (
        <>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Additional performance monitoring script */}
      <Script
        id="performance-monitoring"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track page load performance
            window.addEventListener('load', function() {
              // Check if Performance API is supported
              if ('performance' in window) {
                var loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                gtag('event', 'page_load_time', {
                  event_category: 'performance',
                  value: Math.round(loadTime),
                  non_interaction: true
                });
              }
            });

            // Track errors
            window.addEventListener('error', function(e) {
              gtag('event', 'exception', {
                description: e.error ? e.error.stack : e.message,
                fatal: false,
                event_category: 'javascript_errors'
              });
            });

            // Track unhandled promise rejections
            window.addEventListener('unhandledrejection', function(e) {
              gtag('event', 'exception', {
                description: 'Unhandled Promise Rejection: ' + e.reason,
                fatal: false,
                event_category: 'javascript_errors'
              });
            });
          `,
        }}
      />
    </>
  );
}