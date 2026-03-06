import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  Shield,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Users,
  Car,
  CreditCard,
  Activity,
  UserCheck,
  UserX,
  RefreshCw,
  Hash,
  ArrowLeft,
  Star,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8765';

export default function AdminDriverDashboard() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [ratingModal, setRatingModal] = useState({ open: false, driver: null });
  const [selectedRating, setSelectedRating] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);

  // Fetch all drivers
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter drivers
  useEffect(() => {
    let filtered = drivers;

    if (availabilityFilter !== 'ALL') {
      const isAvailable = availabilityFilter === 'AVAILABLE';
      filtered = filtered.filter((d) => d.available === isAvailable);
    }

    if (vehicleFilter !== 'ALL') {
      filtered = filtered.filter(
        (d) => d.vehicleType?.toLowerCase() === vehicleFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(query) ||
          d.phone?.toLowerCase().includes(query) ||
          d.vehicleNumber?.toLowerCase().includes(query) ||
          d.licenseNumber?.toLowerCase().includes(query) ||
          d.vehicleType?.toLowerCase().includes(query)
      );
    }

    setFilteredDrivers(filtered);
  }, [searchQuery, availabilityFilter, vehicleFilter, drivers]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/profiles/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const driverList = Array.isArray(response.data) ? response.data : [];
      setDrivers(driverList);
      setFilteredDrivers(driverList);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
      setFilteredDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle driver availability
  const toggleAvailability = async (driverId, currentAvailability) => {
    try {
      setActionLoading(driverId);
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/profiles/driver/${driverId}/availability`,
        { available: !currentAvailability },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId ? { ...d, available: !currentAvailability } : d
        )
      );
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Open rating modal
  const openRatingModal = (driver) => {
    setSelectedRating(driver.rating || 0);
    setRatingModal({ open: true, driver });
  };

  // Submit driver rating
  const submitRating = async () => {
    if (!ratingModal.driver || selectedRating < 1) return;
    try {
      setActionLoading(ratingModal.driver.id);
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/profiles/driver/${ratingModal.driver.id}/rating`,
        { rating: selectedRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === ratingModal.driver.id ? { ...d, rating: selectedRating } : d
        )
      );
      setRatingModal({ open: false, driver: null });
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Unique vehicle types for filter
  const vehicleTypes = [...new Set(drivers.map((d) => d.vehicleType).filter(Boolean))];

  // Statistics
  const stats = {
    total: drivers.length,
    available: drivers.filter((d) => d.available === true).length,
    unavailable: drivers.filter((d) => d.available === false).length,
  };

  // Vehicle type icons
  const getVehicleIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('bike') || t.includes('two')) return '🏍️';
    if (t.includes('auto') || t.includes('three')) return '🛺';
    if (t.includes('car') || t.includes('sedan')) return '🚗';
    if (t.includes('van') || t.includes('mini')) return '🚐';
    if (t.includes('truck') || t.includes('lorry')) return '🚛';
    if (t.includes('tempo')) return '🚚';
    return '🚗';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <Truck className="absolute inset-0 m-auto text-indigo-500" size={32} />
            </div>
            <p className="text-gray-600 text-lg font-medium animate-pulse">Loading driver data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to NGO Management
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
                <p className="text-gray-500 mt-0.5">Monitor and manage all registered drivers</p>
              </div>
            </div>
            <button
              onClick={fetchDrivers}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-xl shadow-md hover:shadow-lg ring-1 ring-indigo-100 transition-all hover:scale-[1.02] font-medium text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200/50 p-6 text-white">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Users size={22} />
                </div>
                <span className="text-4xl font-extrabold">{stats.total}</span>
              </div>
              <p className="text-sm font-medium text-white/80">Total Drivers</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg shadow-emerald-200/50 p-6 text-white">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <UserCheck size={22} />
                </div>
                <span className="text-4xl font-extrabold">{stats.available}</span>
              </div>
              <p className="text-sm font-medium text-white/80">Available Now</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-200/50 p-6 text-white">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <UserX size={22} />
                </div>
                <span className="text-4xl font-extrabold">{stats.unavailable}</span>
              </div>
              <p className="text-sm font-medium text-white/80">Unavailable</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/[0.04] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white outline-none transition-all text-sm"
              />
            </div>

            {/* Availability Filter */}
            <div className="relative">
              <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white outline-none appearance-none cursor-pointer transition-all text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="relative">
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white outline-none appearance-none cursor-pointer transition-all text-sm"
              >
                <option value="ALL">All Vehicles</option>
                {vehicleTypes.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-800">{filteredDrivers.length}</span> of{' '}
              {drivers.length} drivers
            </p>
            {(searchQuery || availabilityFilter !== 'ALL' || vehicleFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setAvailabilityFilter('ALL');
                  setVehicleFilter('ALL');
                }}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Driver List */}
        <div className="space-y-4">
          {filteredDrivers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Truck className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Drivers Found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {searchQuery || availabilityFilter !== 'ALL' || vehicleFilter !== 'ALL'
                  ? 'Try adjusting your search or filters to find drivers.'
                  : 'No drivers have registered on the platform yet.'}
              </p>
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                isExpanded={expandedDriver === driver.id}
                onToggleExpand={() =>
                  setExpandedDriver(expandedDriver === driver.id ? null : driver.id)
                }
                getVehicleIcon={getVehicleIcon}
                onToggleAvailability={toggleAvailability}
                onOpenRating={openRatingModal}
                actionLoading={actionLoading}
              />
            ))
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in">
            <button
              onClick={() => setRatingModal({ open: false, driver: null })}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200/50">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Rate Driver</h3>
              <p className="text-sm text-gray-500 mt-1">{ratingModal.driver?.name}</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="group transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= selectedRating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 group-hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mb-6">
              {selectedRating === 0
                ? 'Click a star to rate'
                : `Rating: ${selectedRating} / 5`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setRatingModal({ open: false, driver: null })}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={selectedRating === 0 || actionLoading}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {actionLoading ? 'Saving...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mt-12" />
    </div>
  );
}

// ─── Driver Card Component ──────────────────────────────────────────
/* eslint-disable react/prop-types */
function DriverCard({ driver, isExpanded, onToggleExpand, getVehicleIcon, onToggleAvailability, onOpenRating, actionLoading }) {
  const isAvailable = driver.available === true;
  const isLoading = actionLoading === driver.id;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ring-1 ring-black/[0.04]">
      {/* Accent bar */}
      <div className={`h-1 ${isAvailable ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />

      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md text-white font-extrabold text-xl
              ${isAvailable
                ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}
            >
              {driver.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="text-lg font-bold text-gray-900">
                  {driver.name || 'Unknown Driver'}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ring-1
                    ${isAvailable
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-amber-50 text-amber-700 ring-amber-200'
                    }`}
                >
                  {isAvailable ? (
                    <><CheckCircle size={12} /> Available</>
                  ) : (
                    <><XCircle size={12} /> Unavailable</>
                  )}
                </span>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {driver.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-gray-400" />
                    {driver.phone}
                  </span>
                )}
                {driver.vehicleType && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{getVehicleIcon(driver.vehicleType)}</span>
                    {driver.vehicleType}
                  </span>
                )}
                {driver.vehicleNumber && (
                  <span className="flex items-center gap-1">
                    <Hash size={13} className="text-gray-400" />
                    <span className="font-mono font-semibold text-gray-700">{driver.vehicleNumber}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <div className="flex items-center gap-3 ml-4">
            {/* Rating badge */}
            {driver.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold ring-1 ring-amber-200">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {driver.rating}
              </span>
            )}
            <button
              onClick={onToggleExpand}
              className="w-9 h-9 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <DetailCard
              icon={<Users size={16} className="text-indigo-500" />}
              label="Full Name"
              value={driver.name || 'N/A'}
            />

            {/* Phone */}
            <DetailCard
              icon={<Phone size={16} className="text-emerald-500" />}
              label="Phone Number"
              value={driver.phone || 'N/A'}
            />

            {/* Vehicle Type */}
            <DetailCard
              icon={<Car size={16} className="text-blue-500" />}
              label="Vehicle Type"
              value={driver.vehicleType || 'N/A'}
              extra={
                <span className="text-xl mt-1 block">
                  {getVehicleIcon(driver.vehicleType)}
                </span>
              }
            />

            {/* Vehicle Number */}
            <DetailCard
              icon={<Hash size={16} className="text-purple-500" />}
              label="Vehicle Number"
              value={driver.vehicleNumber || 'N/A'}
              mono
            />

            {/* License Number */}
            <DetailCard
              icon={<CreditCard size={16} className="text-amber-500" />}
              label="License Number"
              value={driver.licenseNumber || 'N/A'}
              mono
            />

            {/* Availability */}
            <DetailCard
              icon={<Activity size={16} className={isAvailable ? 'text-emerald-500' : 'text-amber-500'} />}
              label="Status"
              value={isAvailable ? 'Available for pickups' : 'Currently unavailable'}
              highlight={isAvailable ? 'green' : 'amber'}
            />

            {/* Rating */}
            <DetailCard
              icon={<Star size={16} className="text-amber-500" />}
              label="Rating"
              value={driver.rating ? `${driver.rating} / 5` : 'Not rated'}
              extra={
                driver.rating ? (
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= driver.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                ) : null
              }
            />

            {/* User ID */}
            <DetailCard
              icon={<Shield size={16} className="text-gray-400" />}
              label="User ID"
              value={`#${driver.userId || driver.id}`}
              mono
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            {/* Toggle Availability */}
            <button
              onClick={() => onToggleAvailability(driver.id, driver.available)}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50
                ${isAvailable
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                }`}
            >
              {isAvailable ? (
                <><ToggleRight size={18} /> Set Unavailable</>
              ) : (
                <><ToggleLeft size={18} /> Set Available</>
              )}
            </button>

            {/* Rate Driver */}
            <button
              onClick={() => onOpenRating(driver)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <Star size={18} />
              {driver.rating ? 'Update Rating' : 'Rate Driver'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Card Sub-component ──────────────────────────────────────
/* eslint-disable react/prop-types */
function DetailCard({ icon, label, value, mono, extra, highlight }) {
  const highlightClasses = {
    green: 'bg-emerald-50 ring-emerald-100',
    amber: 'bg-amber-50 ring-amber-100',
  };

  return (
    <div
      className={`rounded-xl p-3.5 ring-1 transition-colors ${
        highlight
          ? highlightClasses[highlight]
          : 'bg-white ring-gray-100 hover:ring-indigo-100'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-bold text-gray-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
      {extra}
    </div>
  );
}
