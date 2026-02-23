import { useState, useEffect } from 'react';
import { Package, CheckCircle, RefreshCw, AlertCircle, Gift, XCircle, Eye, Clock } from 'lucide-react';
import { getAvailableDonations, acceptDonation } from '../services/ngoService';
import Navbar from '../components/Navbar';

export default function AvailableDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAvailableDonations();
      setDonations(data);
    } catch (err) {
      console.error('Failed to load donations:', err);
      setError('Failed to load available donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      setAcceptingId(donationId);
      await acceptDonation(donationId);
      // Remove from list after accepting
      setDonations(donations.filter(d => d.id !== donationId));
      setSelectedDonation(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || '';
      // If donation was already accepted by another NGO, just remove it silently
      if (errorMessage.toLowerCase().includes('already accepted')) {
        setDonations(donations.filter(d => d.id !== donationId));
        setSelectedDonation(null);
      } else {
        alert(errorMessage || 'Failed to accept donation. Please try again.');
      }
    } finally {
      setAcceptingId(null);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading available donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title with Refresh */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Available Donations</h1>
              <p className="text-lg text-gray-600">Accept donations from generous donors</p>
            </div>
          </div>
          <button
            onClick={fetchDonations}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">Refresh</span>
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

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
                <p className="text-gray-600">Donations waiting for you</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-500">Help donors make a difference</p>
              <p className="text-sm text-blue-600 font-medium">Accept donations to help those in need</p>
            </div>
          </div>
        </div>

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Available Donations</h2>
            <p className="text-gray-600 mb-6">Check back later for new donations from donors!</p>
            <button
              onClick={fetchDonations}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh List</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {donations.map((donation) => (
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
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border-2 bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span>Waiting</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{donation.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>Qty: {donation.quantity}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="text-gray-400">ID: #{donation.id}</span>
                      </div>
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
                    <button
                      onClick={() => handleAcceptDonation(donation.id)}
                      disabled={acceptingId === donation.id}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {acceptingId === donation.id ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="text-6xl text-center mb-4">{getItemIcon(selectedDonation.itemType)}</div>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{selectedDonation.itemType}</h3>
              </div>

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

              <button
                onClick={() => handleAcceptDonation(selectedDonation.id)}
                disabled={acceptingId === selectedDonation.id}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {acceptingId === selectedDonation.id ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Accept This Donation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
