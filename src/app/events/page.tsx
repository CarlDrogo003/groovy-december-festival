export const dynamic = "force-dynamic"; // Ensure the page is always rendered on the server

import { Suspense } from 'react';
import { EventsClientPage } from './EventsClientPage';
import ContactEventFooter from '@/components/ContactEventFooter';

function EventsPageContent() {
  return <EventsClientPage />;
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading events...</div>}>
      <EventsPageContent />
        <ContactEventFooter />
    </Suspense>
  );
}

