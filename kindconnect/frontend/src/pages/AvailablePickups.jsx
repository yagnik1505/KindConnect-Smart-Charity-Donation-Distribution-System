import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, MapPin, RefreshCw, 
  Truck, CheckCircle, AlertCircle,
  Info, ChevronRight, Loader2,
  Building2, MapPinned, Route, Zap
} from 'lucide-react';
import { getAvailablePickups, pickupDonation } from '../services/driverService';
import Navbar from '../components/Navbar';

export default function AvailablePickups() {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAvailablePickups();
      setPickups(data || []);
    } catch (err) {
      setError('Failed to load available pickups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (donationId) => {
    try {
      setProcessingId(donationId);
      setError('');
      await pickupDonation(donationId);
      setSuccess('Pickup confirmed! Item is now in transit. Redirecting...');
      
      // Remove from list
      setPickups(pickups.filter(p => p.donationId !== donationId));
      setSelectedPickup(null);
      
      // Redirect to My Deliveries after 2 seconds
      setTimeout(() => {
        navigate('/driver/my-deliveries');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm pickup');
    } finally {
      setProcessingId(null);
    }
  };

  const getItemEmoji = (itemType) => {
    const emojis = {
      'FOOD': '🍽️',
      'CLOTHES': '👕',
      'BOOKS': '📚',
      'TOYS': '🧸',
      'ELECTRONICS': '💻',
      'FURNITURE': '🪑',
      'MEDICAL': '⚕️',
      'OTHER': '📦'
    };
    return emojis[itemType] || '📦';
  };

  const getItemColor = (itemType) => {
    const colors = {
      'FOOD': 'from-orange-500 to-red-500',
      'CLOTHES': 'from-blue-500 to-indigo-500',
      'BOOKS': 'from-purple-500 to-pink-500',
      'TOYS': 'from-yellow-500 to-orange-500',
      'ELECTRONICS': 'from-gray-600 to-gray-800',
      'FURNITURE': 'from-amber-600 to-yellow-600',
      'MEDICAL': 'from-red-500 to-pink-500',
      'OTHER': 'from-teal-500 to-emerald-500'
    };
    return colors[itemType] || 'from-emerald-500 to-teal-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
              <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-600" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Finding available pickups...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Available Pickups</h1>
                <p className="text-white/80 mt-1">Donations accepted by NGOs, ready for you to pick up</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="px-4 py-2 bg-white/20 rounded-xl font-bold text-lg">
                {pickups.length} Available
              </span>
              <button
                onClick={fetchPickups}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-r-xl flex items-center space-x-3 shadow-lg animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-medium">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-xl flex items-center space-x-3 shadow-lg">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Main Content */}
        {pickups.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-16 h-16 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Pickups Available</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              All donations are either being picked up or have been delivered. Check back soon for new opportunities!
            </p>
            <button
              onClick={fetchPickups}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-bold flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pickup List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                    <Route className="w-5 h-5 text-emerald-600" />
                    <span>Donations Ready for Pickup</span>
                  </h3>
                  <span className="text-sm text-gray-500">{pickups.length} items</span>
                </div>

                <div className="space-y-3">
                  {pickups.map((pickup, index) => (
                    <div
                      key={pickup.donationId || index}
                      onClick={() => setSelectedPickup(pickup)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedPickup(pickup)}
                      role="button"
                      tabIndex={0}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedPickup?.donationId === pickup.donationId
                          ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                          : 'border-gray-100 hover:border-emerald-300 bg-gray-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${getItemColor(pickup.itemType)} rounded-2xl flex items-center justify-center shadow-lg text-3xl`}>
                          {getItemEmoji(pickup.itemType)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-800 text-lg">{pickup.itemType || 'Donation Item'}</h4>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                              READY
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center space-x-2">
                            <span className="flex items-center space-x-1">
                              <Package className="w-3 h-3" />
                              <span>ID: #{pickup.donationId}</span>
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePickup(pickup.donationId);
                            }}
                            disabled={processingId === pickup.donationId}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-bold flex items-center space-x-2 disabled:opacity-50"
                          >
                            {processingId === pickup.donationId ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>...</span>
                              </>
                            ) : (
                              <>
                                <Truck className="w-4 h-4" />
                                <span>Pickup</span>
                              </>
                            )}
                          </button>
                          <ChevronRight className={`w-5 h-5 transition-transform ${
                            selectedPickup?.donationId === pickup.donationId ? 'text-emerald-600 rotate-90' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pickup Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100 sticky top-24">
                {selectedPickup ? (
                  <>
                    <div className="text-center mb-6">
                      <div className={`w-24 h-24 bg-gradient-to-br ${getItemColor(selectedPickup.itemType)} rounded-3xl flex items-center justify-center mx-auto shadow-xl text-5xl mb-4`}>
                        {getItemEmoji(selectedPickup.itemType)}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedPickup.itemType}</h3>
                      <p className="text-gray-500">Donation #{selectedPickup.donationId}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <span className="text-sm text-gray-500 flex items-center space-x-2 mb-1">
                          <Info className="w-4 h-4" />
                          <span>Status</span>
                        </span>
                        <p className="font-bold text-emerald-600 flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Ready for Pickup</span>
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <span className="text-sm text-gray-500 flex items-center space-x-2 mb-1">
                          <Building2 className="w-4 h-4" />
                          <span>Accepted By</span>
                        </span>
                        <p className="font-bold text-gray-800">{selectedPickup.ngoName || 'NGO'}</p>
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <span className="text-sm text-amber-700 flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4" />
                          <span className="font-bold">Quick Tip</span>
                        </span>
                        <p className="text-sm text-amber-600">
                          Contact the donor if you need specific pickup instructions or directions.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePickup(selectedPickup.donationId)}
                      disabled={processingId === selectedPickup.donationId}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {processingId === selectedPickup.donationId ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Confirming...</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-6 h-6" />
                          <span>Confirm Pickup</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPinned className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-gray-600 mb-2">Select a Pickup</h4>
                    <p className="text-sm text-gray-500">
                      Click on a donation to view details and confirm pickup
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
