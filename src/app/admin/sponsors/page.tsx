"use client";
import { useState } from "react";
import { useSponsors, Sponsor } from "@/hooks/useSponsors";

export default function AdminSponsors() {
  const { 
    sponsors, 
    loading, 
    error, 
    createSponsor, 
    updateSponsor, 
    deleteSponsor, 
    uploadLogo,
    toggleSponsorStatus,
    getSponsorsByCategory,
    getSponsorsByTier 
  } = useSponsors();
  
  const [form, setForm] = useState({ 
    id: "", 
    name: "", 
    logo_url: "",
    website_url: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    category: 'corporate' as 'government' | 'corporate' | 'ngo' | 'individual',
    tier: 'bronze' as 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner',
    description: "",
    active: true
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'government' | 'corporate' | 'ngo' | 'individual'>('all');

  const resetForm = () => {
    setForm({ 
      id: "", 
      name: "", 
      logo_url: "",
      website_url: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      category: 'corporate',
      tier: 'bronze',
      description: "",
      active: true
    });
    setLogoFile(null);
    setIsEditing(false);
  };

  // Handle form submission
  const handleSponsorSubmission = async () => {
    setSubmitting(true);
    
    try {
      let logoUrl = form.logo_url;
      
      // Upload logo if file is selected
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile, form.name);
        if (!uploadedUrl) {
          return; // Upload failed, error is handled in hook
        }
        logoUrl = uploadedUrl;
      }

      const sponsorData = {
        name: form.name,
        logo_url: logoUrl || undefined,
        website_url: form.website_url || undefined,
        contact_person: form.contact_person || undefined,
        contact_email: form.contact_email || undefined,
        contact_phone: form.contact_phone || undefined,
        category: form.category,
        tier: form.tier,
        description: form.description || undefined,
        active: form.active,
      };

      let success = false;
      if (isEditing) {
        success = !!(await updateSponsor({ ...sponsorData, id: form.id }));
      } else {
        success = !!(await createSponsor(sponsorData));
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
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete sponsor "${name}"?`)) {
      await deleteSponsor(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSponsorSubmission();
  };

  // Filter sponsors
  const filteredSponsors = sponsors.filter(sponsor => {
    if (categoryFilter === 'all') return true;
    return sponsor.category === categoryFilter;
  });

  const getTierColor = (tier: string) => {
    const colors = {
      platinum: 'bg-gray-800 text-white',
      gold: 'bg-yellow-500 text-white',
      silver: 'bg-gray-400 text-white',
      bronze: 'bg-orange-600 text-white',
      partner: 'bg-blue-500 text-white',
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      government: 'bg-red-100 text-red-800',
      corporate: 'bg-blue-100 text-blue-800',
      ngo: 'bg-green-100 text-green-800',
      individual: 'bg-purple-100 text-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Sponsors & Partners</h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['all', 'government', 'corporate', 'ngo', 'individual'].map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category as any)}
            className={`px-4 py-2 rounded-lg capitalize ${
              categoryFilter === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.replace('_', ' ')} ({category === 'all' ? sponsors.length : getSponsorsByCategory(category).length})
          </button>
        ))}
      </div>

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <h2 className="font-semibold">{isEditing ? "Edit Sponsor" : "Add Sponsor"}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Sponsor Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Website URL"
            value={form.website_url}
            onChange={(e) => setForm({ ...form, website_url: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Contact Person"
            value={form.contact_person}
            onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="border p-2 rounded flex-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              required
            >
              <option value="government">Government</option>
              <option value="corporate">Corporate</option>
              <option value="ngo">NGO</option>
              <option value="individual">Individual</option>
            </select>
            <select
              className="border p-2 rounded flex-1"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value as any })}
              required
            >
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Logo upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Logo Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />
          {logoFile && <p className="text-xs text-gray-500 mt-1">Selected: {logoFile.name}</p>}
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>Active</span>
        </label>

        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded text-white ${
              submitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting 
              ? (isEditing ? "Updating..." : "Adding...") 
              : (isEditing ? "Update Sponsor" : "Add Sponsor")
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

      {/* Sponsors list */}
      {loading ? (
        <p>Loading sponsors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{sponsor.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTierColor(sponsor.tier)}`}>
                    {sponsor.tier.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(sponsor.category)}`}>
                    {sponsor.category}
                  </span>
                </div>
              </div>
              
              {sponsor.logo_url && (
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name}
                  className="w-full h-32 object-contain bg-gray-50 rounded mb-3"
                />
              )}
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                {sponsor.website_url && (
                  <p>
                    <a 
                      href={sponsor.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Visit Website
                    </a>
                  </p>
                )}
                {sponsor.contact_person && <p>Contact: {sponsor.contact_person}</p>}
                {sponsor.contact_email && <p>Email: {sponsor.contact_email}</p>}
                {sponsor.contact_phone && <p>Phone: {sponsor.contact_phone}</p>}
                {sponsor.description && (
                  <p className="line-clamp-3 mt-2">{sponsor.description}</p>
                )}
                <p className="text-xs">
                  Added: {new Date(sponsor.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleSponsorStatus(sponsor.id, !sponsor.active)}
                    className={`text-xs px-2 py-1 rounded flex-1 ${
                      sponsor.active 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {sponsor.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <span className={`text-xs px-2 py-1 rounded ${
                    sponsor.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sponsor.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        id: sponsor.id,
                        name: sponsor.name,
                        logo_url: sponsor.logo_url || "",
                        website_url: sponsor.website_url || "",
                        contact_person: sponsor.contact_person || "",
                        contact_email: sponsor.contact_email || "",
                        contact_phone: sponsor.contact_phone || "",
                        category: sponsor.category,
                        tier: sponsor.tier,
                        description: sponsor.description || "",
                        active: sponsor.active,
                      });
                      setIsEditing(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sponsor.id, sponsor.name)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredSponsors.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No sponsors found for "{categoryFilter}" category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
