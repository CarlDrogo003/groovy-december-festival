import { Suspense } from 'react';
import { EventsClientPage } from './EventsClientPage';

function EventsPageContent() {
  return <EventsClientPage />;
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading events...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}

