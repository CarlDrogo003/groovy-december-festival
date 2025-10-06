"use client";
import { useState } from "react";
import { usePageant, Contestant } from "@/hooks/usePageant";

export default function AdminPageant() {
  const { 
    contestants, 
    loading, 
    error, 
    createContestant, 
    updateContestant, 
    deleteContestant, 
    updateContestantStatus,
    uploadContestantFiles 
  } = usePageant();
  
  const [form, setForm] = useState({ 
    id: "", 
    full_name: "", 
    email: "", 
    phone: "", 
    age: 18,
    bio: "",
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });
  const [files, setFiles] = useState<{ headshot?: File; fullBody?: File; proof?: File }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);

  const resetForm = () => {
    setForm({ id: "", full_name: "", email: "", phone: "", age: 18, bio: "", status: 'pending' });
    setFiles({});
    setIsEditing(false);
  };

  // Handle form submission
  const handleContestantSubmission = async () => {
    setSubmitting(true);
    
    try {
      let uploadedUrls = {};
      
      // Upload files if provided
      if (Object.keys(files).length > 0) {
        uploadedUrls = await uploadContestantFiles(files, form.email);
      }

      const contestantData = {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        age: form.age,
        bio: form.bio,
        status: form.status,
        ...uploadedUrls,
      };

      let success = false;
      if (isEditing) {
        success = !!(await updateContestant({ ...contestantData, id: form.id }));
      } else {
        success = !!(await createContestant(contestantData));
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
  const handleDelete = async (id: string, fullName: string) => {
    if (window.confirm(`Are you sure you want to delete "${fullName}"?`)) {
      await deleteContestant(id);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    await updateContestantStatus(id, status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleContestantSubmission();
  };

  // Filter contestants
  const filteredContestants = contestants.filter(contestant => {
    if (filter === 'all') return true;
    return contestant.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Pageant Contestants</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status} ({status === 'all' ? contestants.length : contestants.filter(c => c.status === status).length})
          </button>
        ))}
      </div>

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <h2 className="font-semibold">{isEditing ? "Edit Contestant" : "Add Contestant"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            type="number"
            min="18"
            max="30"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })}
            required
          />
          <select
            className="border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Bio"
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          required
        />

        {/* File uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headshot Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles({ ...files, headshot: e.target.files?.[0] })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Body Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles({ ...files, fullBody: e.target.files?.[0] })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Proof of Payment</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFiles({ ...files, proof: e.target.files?.[0] })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded text-white ${
              submitting ? 'bg-gray-400' : 'bg-pink-600 hover:bg-pink-700'
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting 
              ? (isEditing ? "Updating..." : "Adding...") 
              : (isEditing ? "Update Contestant" : "Add Contestant")
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

      {/* Contestants list */}
      {loading ? (
        <p>Loading contestants...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContestants.map((contestant) => (
            <div
              key={contestant.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{contestant.full_name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(contestant.status || 'pending')}`}>
                  {contestant.status || 'pending'}
                </span>
              </div>
              
              {contestant.headshot_url && (
                <img 
                  src={contestant.headshot_url} 
                  alt={contestant.full_name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>Age: {contestant.age}</p>
                <p>Email: {contestant.email}</p>
                <p>Phone: {contestant.phone}</p>
                <p className="line-clamp-2">{contestant.bio}</p>
                <p className="text-xs">
                  Registered: {new Date(contestant.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleStatusUpdate(contestant.id, 'approved')}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex-1"
                    disabled={contestant.status === 'approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(contestant.id, 'rejected')}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex-1"
                    disabled={contestant.status === 'rejected'}
                  >
                    Reject
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedContestant(contestant)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setForm({
                        id: contestant.id,
                        full_name: contestant.full_name,
                        email: contestant.email,
                        phone: contestant.phone,
                        age: contestant.age,
                        bio: contestant.bio,
                        status: contestant.status || 'pending',
                      });
                      setIsEditing(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contestant.id, contestant.full_name)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredContestants.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No contestants found for "{filter}" status.
            </div>
          )}
        </div>
      )}

      {/* Contestant Details Modal */}
      {selectedContestant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedContestant.full_name}</h2>
              <button
                onClick={() => setSelectedContestant(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedContestant.headshot_url && (
                <div>
                  <h3 className="font-semibold mb-2">Headshot</h3>
                  <img 
                    src={selectedContestant.headshot_url} 
                    alt="Headshot"
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
              )}
              
              {selectedContestant.full_body_url && (
                <div>
                  <h3 className="font-semibold mb-2">Full Body</h3>
                  <img 
                    src={selectedContestant.full_body_url} 
                    alt="Full Body"
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <strong>Bio:</strong>
                <p className="mt-1">{selectedContestant.bio}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Age:</strong> {selectedContestant.age}</p>
                <p><strong>Email:</strong> {selectedContestant.email}</p>
                <p><strong>Phone:</strong> {selectedContestant.phone}</p>
                <p><strong>Status:</strong> {selectedContestant.status}</p>
              </div>
              
              {selectedContestant.proof_of_payment_url && (
                <div>
                  <strong>Proof of Payment:</strong>
                  <a 
                    href={selectedContestant.proof_of_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
