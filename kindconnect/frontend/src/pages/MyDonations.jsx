import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, RefreshCw, Eye, AlertCircle, MapPin, Plus } from 'lucide-react';
import { getMyDonations, cancelDonation } from '../services/donationService';
import Navbar from '../components/Navbar';

export default function MyDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getMyDonations();
      setDonations(data);
      setError('');
    } catch (err) {
      console.error('Failed to load donations:', err);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDonation = async (donationId) => {
    if (!globalThis.confirm('Are you sure you want to cancel this donation?')) {
      return;
    }

    try {
      setCancellingId(donationId);
      await cancelDonation(donationId);
      await fetchDonations();
    } catch (err) {
      console.error('Failed to cancel donation:', err);
      alert('Failed to cancel donation. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      CREATED: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        label: 'Pending',
        iconColor: 'text-yellow-600',
        step: 1
      },
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: Clock,
        label: 'Pending',
        iconColor: 'text-yellow-600',
        step: 1
      },
      ACCEPTED: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        label: 'Accepted by NGO',
        iconColor: 'text-blue-600',
        step: 2
      },
      PICKED_UP: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Truck,
        label: 'Picked Up',
        iconColor: 'text-purple-600',
        step: 3
      },
      IN_TRANSIT: {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Truck,
        label: 'In Transit',
        iconColor: 'text-purple-600',
        step: 3
      },
      DELIVERED: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Delivered',
        iconColor: 'text-green-600',
        step: 4
      },
      CANCELLED: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Cancelled',
        iconColor: 'text-red-600',
        step: 0
      }
    };
    return configs[status] || configs.CREATED;
  };

  // Status Progress Steps for visual timeline
  const statusSteps = [
    { key: 'CREATED', label: 'Created', icon: Clock, description: 'Waiting for NGO to accept' },
    { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle, description: 'NGO has accepted your donation' },
    { key: 'PICKED_UP', label: 'Picked Up', icon: Truck, description: 'Driver picked up your donation' },
    { key: 'DELIVERED', label: 'Delivered', icon: MapPin, description: 'Delivered to NGO successfully' }
  ];

  const getCurrentStepIndex = (status) => {
    if (status === 'CANCELLED') return -1;
    const mapping = { 'CREATED': 0, 'PENDING': 0, 'ACCEPTED': 1, 'PICKED_UP': 2, 'IN_TRANSIT': 2, 'DELIVERED': 3 };
    return mapping[status] ?? 0;
  };

  const getItemIcon = (itemType) => {
    const icons = {
      'Food': '🍽️',
      'Clothes': '👕',
      'Books': '📚',
      'Toys': '🧸',
      'Electronics': '💻',
      'Furniture': '🪑',
      'Medical': '⚕️',
      'Other': '📦'
    };
    return icons[itemType] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Donations</h1>
            <p className="text-lg text-gray-600">Track your generosity and its impact</p>
          </div>
          <button
            onClick={fetchDonations}
            className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-red-800 font-semibold">{error}</p>
              <button
                onClick={fetchDonations}
                className="text-sm text-red-600 underline hover:text-red-800 mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">{donations.length}</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-yellow-100">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {donations.filter(d => d.status === 'CREATED' || d.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {donations.filter(d => d.status === 'ACCEPTED').length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {donations.filter(d => d.status === 'PICKED_UP' || d.status === 'IN_TRANSIT').length}
            </div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {donations.filter(d => d.status === 'DELIVERED').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
        </div>

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Donations Yet</h2>
            <p className="text-gray-600 mb-6">Start making a difference by creating your first donation!</p>
            <button
              onClick={() => navigate('/donor/create-donation')}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Donation</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {donations.map((donation) => {
              const statusConfig = getStatusConfig(donation.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-5xl">{getItemIcon(donation.itemType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{donation.itemType}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${statusConfig.color} flex items-center space-x-1`}>
                            <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                            <span>{statusConfig.label}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{donation.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center space-x-1">
                            <Package className="w-4 h-4" />
                            <span>Qty: {donation.quantity}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                          </span>
                          {donation.id && (
                            <span className="text-gray-400">ID: #{donation.id}</span>
                          )}
                        </div>
                        
                        {/* Mini Progress Bar */}
                        {donation.status !== 'CANCELLED' && (
                          <div className="flex items-center space-x-1">
                            {statusSteps.map((step, idx) => {
                              const currentIdx = getCurrentStepIndex(donation.status);
                              const isComplete = idx <= currentIdx;
                              return (
                                <div key={step.key} className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isComplete 
                                      ? 'bg-pink-500 text-white' 
                                      : 'bg-gray-200 text-gray-400'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  {idx < statusSteps.length - 1 && (
                                    <div className={`w-6 h-1 ${idx < currentIdx ? 'bg-pink-500' : 'bg-gray-200'}`} />
                                  )}
                                </div>
                              );
                            })}
                            <span className="text-xs text-gray-500 ml-2">
                              Step {getCurrentStepIndex(donation.status) + 1} of 4
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                      {(donation.status === 'CREATED' || donation.status === 'PENDING') && (
                        <button
                          onClick={() => handleCancelDonation(donation.id)}
                          disabled={cancellingId === donation.id}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium disabled:opacity-50"
                        >
                          {cancellingId === donation.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Donation Details</h2>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <div className="text-6xl text-center mb-4">{getItemIcon(selectedDonation.itemType)}</div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{selectedDonation.itemType}</h3>
                <div className="flex justify-center">
                  {(() => {
                    const config = getStatusConfig(selectedDonation.status);
                    const Icon = config.icon;
                    return (
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${config.color} flex items-center space-x-2`}>
                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                        <span>{config.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Status Progress Tracker */}
              {selectedDonation.status !== 'CANCELLED' ? (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">🚀 Donation Journey</h4>
                  <div className="relative">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(selectedDonation.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={step.key} className="flex items-start mb-4 last:mb-0">
                          <div className="flex flex-col items-center mr-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-pink-200' : ''}`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div className={`w-0.5 h-8 mt-1 ${
                                index < currentIndex ? 'bg-pink-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                              {step.label}
                              {isCurrent && <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">Current</span>}
                            </p>
                            <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-2xl p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-800 font-semibold">This donation was cancelled</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Donation ID</p>
                  <p className="text-lg font-bold text-gray-800">#{selectedDonation.id}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Quantity</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDonation.quantity}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Created Date</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedDonation.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-800">{selectedDonation.description}</p>
              </div>

              {(selectedDonation.status === 'CREATED' || selectedDonation.status === 'PENDING') && (
                <button
                  onClick={() => {
                    setSelectedDonation(null);
                    handleCancelDonation(selectedDonation.id);
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold transition-all"
                >
                  Cancel This Donation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
