"use client";
import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import ContactEventFooter from '@/components/ContactEventFooter';
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
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [referralFilter, setReferralFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Coordinator stats from diaspora_referrals
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [loadingCoordinators, setLoadingCoordinators] = useState(false);
  useEffect(() => {
    setLoadingCoordinators(true);
    fetch('/api/admin/diaspora/coordinators')
      .then(res => res.json())
      .then(data => setCoordinators(data.coordinators || []))
      .finally(() => setLoadingCoordinators(false));
  }, []);
  const revenueByPackage = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    const map: Record<string, { name: string, revenueNGN: number, revenueUSD: number, bookings: number }> = {};
    bookings.forEach(b => {
      const pkg = b.tour?.name || 'Unknown';
      if (!map[pkg]) map[pkg] = { name: pkg, revenueNGN: 0, revenueUSD: 0, bookings: 0 };
      let usd = 0;
      // payment_amount_ngn does not exist on TourBooking, so skip NGN calculation
      if (b.tour?.price_usd && b.travelers) {
        usd = b.tour.price_usd * b.travelers;
      }
      // Only update USD revenue and bookings
      map[pkg].revenueUSD += usd;
      map[pkg].bookings += 1;
    });
    return Object.values(map).sort((a, b) => b.revenueNGN - a.revenueNGN);
  }, [bookings]);

  const totalRevenueNGN = revenueByPackage.reduce((sum, p) => sum + p.revenueNGN, 0);
  const totalRevenueUSD = revenueByPackage.reduce((sum, p) => sum + p.revenueUSD, 0);

  // Aggregate bookings and revenue for chart
  const chartData = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    const groupBy = (date: Date) => {
      if (chartPeriod === 'daily') return date.toISOString().slice(0, 10);
      if (chartPeriod === 'weekly') {
        const d = new Date(date);
        const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${week}`;
      }
      // monthly
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    };
    const map: Record<string, { date: string, bookings: number, revenue: number }> = {};
    bookings.forEach(b => {
      const d = new Date(b.created_at);
      const key = groupBy(d);
      if (!map[key]) map[key] = { date: key, bookings: 0, revenue: 0 };
      map[key].bookings += 1;
      // Use paid amount if available, else price_usd * travelers
      let amount = 0;
      // payment_amount_ngn does not exist on TourBooking, so skip NGN calculation
      if (b.tour?.price_usd && b.travelers) {
        amount = b.tour.price_usd * b.travelers;
      }
      map[key].revenue += amount;
    });
    // Sort by date
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [bookings, chartPeriod]);

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
    // Status
    if (bookingFilter !== 'all' && booking.status !== bookingFilter) return false;
    // Package
    if (packageFilter !== 'all' && booking.tour?.name !== packageFilter) return false;
    // Referral
    if (referralFilter && (!booking.referral || !booking.referral.toLowerCase().includes(referralFilter.toLowerCase()))) return false;
    // Payment status
    if (paymentStatusFilter !== 'all' && booking.payment_status !== paymentStatusFilter) return false;
    // Date range
    if (dateFrom && new Date(booking.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(booking.created_at) > new Date(dateTo)) return false;
    // Search
    if (search) {
      const s = search.toLowerCase();
      if (!(
        booking.full_name?.toLowerCase().includes(s) ||
        booking.email?.toLowerCase().includes(s) ||
        booking.phone?.toLowerCase().includes(s)
      )) return false;
    }
    return true;
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

      {/* Coordinator Leaderboard & Export */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Coordinator Leaderboard</h2>
          {coordinators.length > 0 && (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              onClick={() => {
                // Export leaderboard to CSV
                const header = ['Referral Code','Coordinator Name','Email','Total Referrals','Earnings (USD)'];
                const rows = coordinators.map(c => [
                  c.referral_code,
                  c.referrer_name,
                  c.referrer_email,
                  c.total_referrals,
                  c.earnings_usd
                ]);
                const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `coordinator-leaderboard-${new Date().toISOString().slice(0,10)}.csv`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
              }}
            >
              Export CSV
            </button>
          )}
        </div>
        <ContactEventFooter />
        {loadingCoordinators ? (
          <p className="text-gray-500">Loading coordinators...</p>
        ) : coordinators.length === 0 ? (
          <p className="text-gray-500">No coordinator bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border">Referral Code</th>
                  <th className="px-3 py-2 border">Coordinator Name</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Total Referrals</th>
                  <th className="px-3 py-2 border">Earnings (USD)</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c, i) => (
                  <tr key={c.referral_code} className={`font-medium ${i < 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="px-3 py-2 border">{c.referral_code}</td>
                    <td className="px-3 py-2 border">{c.referrer_name}</td>
                    <td className="px-3 py-2 border">{c.referrer_email}</td>
                    <td className="px-3 py-2 border text-center">{c.total_referrals}</td>
                    <td className="px-3 py-2 border text-right">${Number(c.earnings_usd).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2">Top 3 coordinators highlighted. Export for full details.</div>
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Revenue Breakdown by Package</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">Package</th>
                <th className="px-3 py-2 border">Bookings</th>
                <th className="px-3 py-2 border">Revenue (NGN)</th>
                <th className="px-3 py-2 border">Revenue (USD est.)</th>
              </tr>
            </thead>
            <tbody>
              {revenueByPackage.map(pkg => (
                <tr key={pkg.name}>
                  <td className="px-3 py-2 border font-medium">{pkg.name}</td>
                  <td className="px-3 py-2 border text-center">{pkg.bookings}</td>
                  <td className="px-3 py-2 border text-right">₦{pkg.revenueNGN.toLocaleString()}</td>
                  <td className="px-3 py-2 border text-right">${pkg.revenueUSD.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td className="px-3 py-2 border">Total</td>
                <td className="px-3 py-2 border text-center">{revenueByPackage.reduce((sum, p) => sum + p.bookings, 0)}</td>
                <td className="px-3 py-2 border text-right">₦{totalRevenueNGN.toLocaleString()}</td>
                <td className="px-3 py-2 border text-right">${totalRevenueUSD.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings & Revenue Charts */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Diaspora Bookings & Revenue Trends</h2>
          <select
            value={chartPeriod}
            onChange={e => setChartPeriod(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: 'Bookings', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue (NGN)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
            <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (NGN)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
          {/* Advanced Filters & Search */}
          <div className="flex flex-wrap gap-4 mb-6 items-end">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium mb-1">Status</label>
              <select value={bookingFilter} onChange={e => setBookingFilter(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {/* Package */}
            <div>
              <label className="block text-xs font-medium mb-1">Package</label>
              <select value={packageFilter} onChange={e => setPackageFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="all">All</option>
                {Array.from(new Set(bookings.map(b => b.tour?.name).filter(Boolean))).map(pkg => (
                  <option key={pkg} value={pkg as string}>{pkg}</option>
                ))}
              </select>
            </div>
            {/* Referral */}
            <div>
              <label className="block text-xs font-medium mb-1">Referral Code</label>
              <input value={referralFilter} onChange={e => setReferralFilter(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="Search code" />
            </div>
            {/* Payment Status */}
            <div>
              <label className="block text-xs font-medium mb-1">Payment</label>
              <select value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium mb-1">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
            </div>
            {/* Search */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium mb-1">Search</label>
              <input value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1 text-sm w-full" placeholder="Name, email, phone..." />
            </div>
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
                    <p><strong>Payment Status:</strong> {booking.payment_status ? booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1) : 'N/A'}</p>
                    <p><strong>Booking ID:</strong> {booking.id}</p>
                  </div>
                  {/* Show package add-ons if present */}
                  {/* No add-ons property in TourBooking, so skip this section */}
                  {/* Fallback: show add-ons if mentioned in special_requests */}
                  {booking.special_requests && (
                    <div className="mb-3">
                      <strong>Special Requests:</strong>
                      <p className="text-gray-600 mt-1">{booking.special_requests}</p>
                      {/* Try to highlight add-ons if mentioned */}
                      {/(breakfast|dinner|add[- ]?on|extra)/i.test(booking.special_requests) && (
                        <div className="text-xs text-blue-700 mt-1">Possible add-ons mentioned above.</div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      disabled={booking.status === 'confirmed'}
                      title="Mark as Confirmed"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={booking.status === 'cancelled'}
                      title="Mark as Cancelled"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id, booking.full_name)}
                      className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      title="Delete Booking"
                    >
                      Delete
                    </button>
                    <button
                      onClick={async () => {
                        // Simulate resend confirmation email (replace with real API call if available)
                        alert(`Confirmation email resent to ${booking.email}`);
                      }}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      title="Resend Confirmation Email"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              ))}
              {filteredBookings.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No bookings found for current filters.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
