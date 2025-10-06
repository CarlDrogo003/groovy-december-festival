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

  // Handle form submission
  const handleEventSubmission = async () => {
    setSubmitting(true);
    
    try {
      let bannerUrl = form.banner_url;
      
      // Upload banner if file is selected
      if (bannerFile) {
        const uploadedUrl = await uploadBanner(bannerFile);
        if (!uploadedUrl) {
          return; // Upload failed, error is handled in hook
        }
        bannerUrl = uploadedUrl;
      }

      const eventData = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        date: form.date,
        venue: form.venue,
        banner_image: bannerUrl,
        max_capacity: form.max_capacity ? parseInt(form.max_capacity) : undefined,
        registration_fee: form.registration_fee ? parseFloat(form.registration_fee) : undefined,
        status: form.status,
      };

      let success = false;
      if (isEditing) {
        success = !!(await updateEvent({ ...eventData, id: form.id }));
      } else {
        success = !!(await createEvent(eventData));
      }

      if (success) {
        resetForm();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (id: string, eventName: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      await deleteEvent(id);
    }
  };

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", date: "", location: "", banner_url: "" });
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEventSubmission();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-2">
        <h2 className="font-semibold">{isEditing ? "Edit Event" : "Create Event"}</h2>
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        {/* Banner upload */}
        <input
          type="file"
          onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
          className="border p-2 w-full"
        />
        {bannerFile && <p className="text-xs text-gray-500">Uploading: {bannerFile.name}</p>}

        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded text-white ${
              submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting 
              ? (isEditing ? "Updating..." : "Saving...") 
              : (isEditing ? "Update Event" : "Save Event")
            }
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Events list */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                {ev.banner_url && (
                  <img src={ev.banner_url} alt="banner" className="w-32 h-20 object-cover mb-2 rounded" />
                )}
                <h3 className="font-semibold">{ev.name}</h3>
                <p className="text-sm">{ev.description}</p>
                <p className="text-xs text-gray-500">
                  {ev.date} @ {ev.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm({
                      id: ev.id,
                      name: ev.name,
                      description: ev.description,
                      date: ev.date,
                      location: ev.location,
                      banner_url: ev.banner_url || "",
                    });
                    setIsEditing(true);
                  }}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ev.id, ev.name)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
