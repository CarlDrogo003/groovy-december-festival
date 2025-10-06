"use client";
import { useState } from "react";
import { useEvents, Event, CreateEventData, UpdateEventData } from "@/hooks/useEvents";
import EventModal from "@/components/admin/EventModal";
import { Button } from "@/components/ui/Button";

export default function AdminEvents() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent, uploadBanner, fetchEventRegistrations } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [showRegistrations, setShowRegistrations] = useState(false);

  // Handle creating new event
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  // Handle editing existing event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Handle modal form submission
  const handleModalSubmit = async (data: CreateEventData | UpdateEventData) => {
    try {
      let success = false;
      if ('id' in data) {
        // Update existing event
        success = await updateEvent(data);
      } else {
        // Create new event
        success = await createEvent(data);
      }
      return success;
    } catch (err) {
      console.error("Error submitting event:", err);
      return false;
    }
  };

  // Delete event with confirmation
  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteEvent(id);
    }
  };

  // View event registrations
  const handleViewRegistrations = async (event: Event) => {
    setSelectedEvent(event);
    const eventRegistrations = await fetchEventRegistrations(event.id);
    setRegistrations(eventRegistrations);
    setShowRegistrations(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = status || 'published';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusText as keyof typeof statusColors] || statusColors.published}`}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Button onClick={handleCreateEvent}>
          Create New Event
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            {/* Event Banner */}
            {event.banner_image && (
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={event.banner_image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              {/* Event Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate flex-1">{event.title}</h3>
                {getStatusBadge(event.status)}
              </div>

              {/* Event Details */}
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.venue}
                </div>
                {event.max_capacity && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {event.current_registrations || 0} / {event.max_capacity}
                  </div>
                )}
                {event.registration_fee && event.registration_fee > 0 && (
                  <div className="flex items-center text-green-600 font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    ${event.registration_fee}
                  </div>
                )}
              </div>

              {/* Event Description */}
              {event.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2 border-t">
                <button
                  onClick={() => handleViewRegistrations(event)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Registrations ({event.current_registrations || 0})
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete Event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
          <div className="mt-6">
            <Button onClick={handleCreateEvent}>
              Create New Event
            </Button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        event={editingEvent}
        isLoading={submitting}
        onFileUpload={uploadBanner}
      />

      {/* Registration Modal */}
      {showRegistrations && selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowRegistrations(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl transform rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-xl font-semibold">
                  Registrations for "{selectedEvent.title}"
                </h3>
                <button
                  onClick={() => setShowRegistrations(false)}
                  className="rounded-md p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {registrations.length > 0 ? (
                  <div className="space-y-3">
                    {registrations.map((reg, index) => (
                      <div key={reg.id || index} className="border rounded p-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Name:</span>
                            <p>{reg.full_name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p>{reg.email}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <p>{reg.phone || 'N/A'}</p>
                          </div>
                          <div className="md:col-span-3">
                            <span className="font-medium text-gray-700">Registered:</span>
                            <p>{new Date(reg.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No registrations yet for this event.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}