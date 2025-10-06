"use client";
import { useState } from "react";
import { useVendors, Vendor } from "@/hooks/useVendors";

export default function AdminVendors() {
  const { vendors, loading, error, createVendor, updateVendor, deleteVendor, updateVendorStatus } = useVendors();
  const [form, setForm] = useState({ 
    id: "", 
    business_name: "", 
    owner_name: "", 
    email: "", 
    phone: "", 
    package: "",
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const resetForm = () => {
    setForm({ id: "", business_name: "", owner_name: "", email: "", phone: "", package: "", status: 'pending' });
    setIsEditing(false);
  };

  // Handle form submission
  const handleVendorSubmission = async () => {
    setSubmitting(true);
    
    try {
      const vendorData = {
        business_name: form.business_name,
        owner_name: form.owner_name,
        email: form.email,
        phone: form.phone || undefined,
        package: form.package,
        status: form.status,
      };

      let success = false;
      if (isEditing) {
        success = !!(await updateVendor({ ...vendorData, id: form.id }));
      } else {
        success = !!(await createVendor(vendorData));
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
  const handleDelete = async (id: string, businessName: string) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"?`)) {
      await deleteVendor(id);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    await updateVendorStatus(id, status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVendorSubmission();
  };

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'all') return true;
    return vendor.status === filter;
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
      <h1 className="text-2xl font-bold mb-4">Manage Vendors</h1>

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
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status} ({status === 'all' ? vendors.length : vendors.filter(v => v.status === status).length})
          </button>
        ))}
      </div>

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-2">
        <h2 className="font-semibold">{isEditing ? "Edit Vendor" : "Add Vendor"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Business Name"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Owner Name"
            value={form.owner_name}
            onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
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
          />
          <select
            className="border p-2 rounded"
            value={form.package}
            onChange={(e) => setForm({ ...form, package: e.target.value })}
            required
          >
            <option value="">Select Package</option>
            <option value="Kiosk">Kiosk</option>
            <option value="Booth">Booth</option>
            <option value="Outdoor Space">Outdoor Space</option>
          </select>
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

        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded text-white ${
              submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting 
              ? (isEditing ? "Updating..." : "Adding...") 
              : (isEditing ? "Update Vendor" : "Add Vendor")
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

      {/* Vendors list */}
      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{vendor.business_name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(vendor.status || 'pending')}`}>
                    {vendor.status || 'pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Owner: {vendor.owner_name}</p>
                <p className="text-sm text-gray-600">Email: {vendor.email}</p>
                <p className="text-sm text-gray-600">Package: {vendor.package}</p>
                {vendor.phone && <p className="text-sm text-gray-600">Phone: {vendor.phone}</p>}
                <p className="text-xs text-gray-500">
                  Registered: {new Date(vendor.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleStatusUpdate(vendor.id, 'approved')}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    disabled={vendor.status === 'approved'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(vendor.id, 'rejected')}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    disabled={vendor.status === 'rejected'}
                  >
                    Reject
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        id: vendor.id,
                        business_name: vendor.business_name,
                        owner_name: vendor.owner_name,
                        email: vendor.email,
                        phone: vendor.phone || "",
                        package: vendor.package,
                        status: vendor.status || 'pending',
                      });
                      setIsEditing(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id, vendor.business_name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredVendors.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No vendors found for "{filter}" status.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
