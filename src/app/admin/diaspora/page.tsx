"use client";
import { useState } from "react";
import { useDiaspora } from "@/hooks/useDiaspora";

export default function AdminDiaspora() {
  const { 
    tours, 
    bookings, 
    loading, 
    error, 
    createTour, 
    updateTour, 
    deleteTour, 
    updateBookingStatus,
    deleteBooking 
  } = useDiaspora();
  
  const [activeTab, setActiveTab] = useState<'tours' | 'bookings'>('tours');
  const [tourForm, setTourForm] = useState({ 
    id: "", 
    name: "", 
    price_usd: 0, 
    duration: "", 
    description: "",
    benefits: [] as string[],
    active: true
  });
  const [benefitInput, setBenefitInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const resetTourForm = () => {
    setTourForm({ id: "", name: "", price_usd: 0, duration: "", description: "", benefits: [], active: true });
    setBenefitInput("");
    setIsEditing(false);
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !tourForm.benefits.includes(benefitInput.trim())) {
      setTourForm({ ...tourForm, benefits: [...tourForm.benefits, benefitInput.trim()] });
      setBenefitInput("");
    }
  };

  const removeBenefit = (index: number) => {
    setTourForm({ 
      ...tourForm, 
      benefits: tourForm.benefits.filter((_, i) => i !== index) 
    });
  };

  // Handle tour submission
  const handleTourSubmission = async () => {
    setSubmitting(true);
    
    try {
      const tourData = {
        name: tourForm.name,
        price_usd: tourForm.price_usd,
        duration: tourForm.duration,
        description: tourForm.description,
        benefits: tourForm.benefits,
        active: tourForm.active,
      };

      let success = false;
      if (isEditing) {
        success = !!(await updateTour({ ...tourData, id: tourForm.id }));
      } else {
        success = !!(await createTour(tourData));
      }

      if (success) {
        resetTourForm();
      }
    } catch (err) {
      console.error("Error submitting tour:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete tour with confirmation
  const handleDeleteTour = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete tour "${name}"?`)) {
      await deleteTour(id);
    }
  };

  // Handle delete booking with confirmation
  const handleDeleteBooking = async (id: string, fullName: string) => {
    if (window.confirm(`Are you sure you want to delete booking for "${fullName}"?`)) {
      await deleteBooking(id);
    }
  };

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTourSubmission();
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (bookingFilter === 'all') return true;
    return booking.status === bookingFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Diaspora Tours</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('tours')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'tours'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tours ({tours.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'bookings'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {activeTab === 'tours' && (
        <>
          {/* Create / Edit Tour form */}
          <form onSubmit={handleTourSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
            <h2 className="font-semibold">{isEditing ? "Edit Tour" : "Create Tour"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Tour Name"
                value={tourForm.name}
                onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price (USD)"
                value={tourForm.price_usd}
                onChange={(e) => setTourForm({ ...tourForm, price_usd: parseFloat(e.target.value) })}
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="Duration (e.g., '7 days', '2 weeks')"
                value={tourForm.duration}
                onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                required
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tourForm.active}
                  onChange={(e) => setTourForm({ ...tourForm, active: e.target.checked })}
                />
                <span>Active</span>
              </label>
            </div>

            <textarea
              className="border p-2 rounded w-full"
              placeholder="Tour Description"
              rows={3}
              value={tourForm.description}
              onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
              required
            />

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2">Tour Benefits</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="border p-2 rounded flex-1"
                  placeholder="Add a benefit"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tourForm.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded text-white ${
                  submitting ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                }`}
                type="submit"
                disabled={submitting}
              >
                {submitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Tour" : "Create Tour")
                }
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetTourForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Tours list */}
          {loading ? (
            <p>Loading tours...</p>
          ) : (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white p-4 rounded shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{tour.name}</h3>
                      <p className="text-green-600 font-medium">${tour.price_usd} - {tour.duration}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                        (tour as any).active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(tour as any).active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTourForm({
                            id: tour.id,
                            name: tour.name,
                            price_usd: tour.price_usd,
                            duration: tour.duration || '',
                            description: tour.description || '',
                            benefits: tour.benefits || [],
                            active: tour.active || true,
                          });
                          setIsEditing(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour.id, tour.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{tour.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {(tour.benefits || []).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {tours.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No tours created yet.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'bookings' && (
        <>
          {/* Booking Filter Tabs */}
          <div className="flex space-x-4 mb-6">
            {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setBookingFilter(status as 'all' | 'pending' | 'confirmed' | 'cancelled')}
                className={`px-4 py-2 rounded-lg capitalize ${
                  bookingFilter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
              </button>
            ))}
          </div>

          {/* Bookings list */}
          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-4 rounded shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.full_name}</h3>
                      <p className="text-gray-600">{booking.email}</p>
                      {booking.phone && <p className="text-gray-600">{booking.phone}</p>}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(booking.status || 'pending')}`}>
                      {booking.status || 'pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <p><strong>Tour:</strong> {booking.tour?.name || 'Unknown Tour'}</p>
                    <p><strong>Travelers:</strong> {booking.travelers}</p>
                    <p><strong>Booked:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                    {booking.tour && <p><strong>Price:</strong> ${booking.tour.price_usd * booking.travelers}</p>}
                  </div>
                  
                  {booking.special_requests && (
                    <div className="mb-3">
                      <strong>Special Requests:</strong>
                      <p className="text-gray-600 mt-1">{booking.special_requests}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      disabled={booking.status === 'confirmed'}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={booking.status === 'cancelled'}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id, booking.full_name)}
                      className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredBookings.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No bookings found for &quot;{bookingFilter}&quot; status.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
