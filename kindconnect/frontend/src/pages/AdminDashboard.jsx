import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Users,
  Award,
  Filter,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8765';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedNgo, setExpandedNgo] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedNgoForRating, setSelectedNgoForRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);

  // Check if user is admin
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);

  // Fetch all NGOs
  useEffect(() => {
    fetchNgos();
  }, []);

  // Filter NGOs based on search and status
  useEffect(() => {
    let filtered = ngos;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((ngo) => ngo.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ngo) =>
          ngo.ngoName?.toLowerCase().includes(query) ||
          ngo.email?.toLowerCase().includes(query) ||
          ngo.fieldType?.toLowerCase().includes(query) ||
          ngo.description?.toLowerCase().includes(query)
      );
    }

    setFilteredNgos(filtered);
  }, [searchQuery, statusFilter, ngos]);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/profiles/ngos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNgos(response.data);
      setFilteredNgos(response.data);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      alert('Failed to fetch NGOs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateNgoStatus = async (ngoId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/profiles/ngo/${ngoId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNgos((prev) =>
        prev.map((ngo) => (ngo.id === ngoId ? { ...ngo, status: newStatus } : ngo))
      );
      alert(`NGO ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating NGO status:', error);
      alert('Failed to update NGO status. Please try again.');
    }
  };

  const openRatingModal = (ngo) => {
    setSelectedNgoForRating(ngo);
    setRatingValue(ngo.rating || 0);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!selectedNgoForRating) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${API_BASE_URL}/profiles/ngo/${selectedNgoForRating.id}/rating`,
        { rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNgos((prev) =>
        prev.map((ngo) =>
          ngo.id === selectedNgoForRating.id ? { ...ngo, rating: ratingValue } : ngo
        )
      );

      alert('Rating updated successfully!');
      setShowRatingModal(false);
      setSelectedNgoForRating(null);
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating. Please try again.');
    }
  };

  // Calculate statistics
  const stats = {
    total: ngos.length,
    approved: ngos.filter((ngo) => ngo.status === 'APPROVED').length,
    pending: ngos.filter((ngo) => ngo.status === 'PENDING').length,
    rejected: ngos.filter((ngo) => ngo.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NGO Management</h1>
              <p className="text-gray-600">Manage NGO applications and ratings</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Building2}
            label="Total NGOs"
            value={stats.total}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={stats.approved}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            color="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or field type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredNgos.length} of {ngos.length} NGOs
          </div>
        </div>

        {/* NGO List */}
        <div className="space-y-4">
          {filteredNgos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No NGOs Found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'No NGOs have registered yet'}
              </p>
            </div>
          ) : (
            filteredNgos.map((ngo) => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                isExpanded={expandedNgo === ngo.id}
                onToggleExpand={() =>
                  setExpandedNgo(expandedNgo === ngo.id ? null : ngo.id)
                }
                onUpdateStatus={updateNgoStatus}
                onRate={() => openRatingModal(ngo)}
              />
            ))
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rate {selectedNgoForRating?.ngoName}
            </h3>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= ratingValue
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedNgoForRating(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={ratingValue === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// StatCard Component
/* eslint-disable react/prop-types */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`${color} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8" />
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-sm font-medium opacity-90">{label}</div>
    </div>
  );
}

// NGOCard Component
/* eslint-disable react/prop-types */
function NGOCard({ ngo, isExpanded, onToggleExpand, onUpdateStatus, onRate }) {
  const statusConfig = {
    PENDING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: Clock,
    },
    APPROVED: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle,
    },
    REJECTED: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
    },
  };

  const config = statusConfig[ngo.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Logo */}
            {ngo.logo ? (
              <img
                src={ngo.logo}
                alt={ngo.ngoName}
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {ngo.ngoName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} flex items-center space-x-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{ngo.status}</span>
                    </span>
                    {ngo.fieldType && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                        {ngo.fieldType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {ngo.rating > 0 && (
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-yellow-700">{ngo.rating}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{ngo.email}</span>
                </div>
                {ngo.contactNumber && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{ngo.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={onToggleExpand}
            className="ml-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {ngo.status !== 'APPROVED' && (
            <button
              onClick={() => onUpdateStatus(ngo.id, 'APPROVED')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
          )}

          {ngo.status !== 'REJECTED' && (
            <button
              onClick={() => onUpdateStatus(ngo.id, 'REJECTED')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
          )}

          {ngo.status !== 'PENDING' && (
            <button
              onClick={() => onUpdateStatus(ngo.id, 'PENDING')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Clock className="w-4 h-4" />
              <span>Set Pending</span>
            </button>
          )}

          <button
            onClick={onRate}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            <Star className="w-4 h-4" />
            <span>Rate NGO</span>
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {ngo.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600">{ngo.description}</p>
                </div>
              )}

              {ngo.address && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Address</span>
                  </h4>
                  <p className="text-sm text-gray-600">{ngo.address}</p>
                </div>
              )}

              {ngo.registrationNumber && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Registration Number
                  </h4>
                  <p className="text-sm text-gray-600">{ngo.registrationNumber}</p>
                </div>
              )}
            </div>

            {/* Right Column - Statistics */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-center space-x-2 text-blue-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Total Donations</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {ngo.donationsCount || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-center space-x-2 text-green-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs font-medium">Beneficiaries</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {ngo.beneficiaries || 0}
                  </p>
                </div>
              </div>

              {ngo.totalDonationsReceived && (
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="flex items-center space-x-2 text-purple-600 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-medium">Total Received</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{ngo.totalDonationsReceived?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
