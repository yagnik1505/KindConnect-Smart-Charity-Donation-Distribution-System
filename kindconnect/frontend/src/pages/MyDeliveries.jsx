import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Truck, CheckCircle, Clock,
  MapPin, AlertCircle, Building2, ChevronDown, ChevronUp,
  Star, Timer, Award, TrendingUp, Loader2, PackageCheck, Route
} from 'lucide-react';
import { deliverDonation, getDriverDashboard, getInTransitDeliveries, getCompletedDeliveries } from '../services/driverService';
import Navbar from '../components/Navbar';

export default function MyDeliveries() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState({ 'in-transit': [], 'completed': [] });
  const [stats, setStats] = useState({ rating: 0, onTimeRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('in-transit');
  const [processingId, setProcessingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all data in parallel
      const [dashboardData, inTransitData, completedData] = await Promise.all([
        getDriverDashboard(),
        getInTransitDeliveries(),
        getCompletedDeliveries()
      ]);
      
      setStats({
        rating: dashboardData.rating || 0,
        onTimeRate: dashboardData.onTimeRate || 0
      });
      
      setDeliveries({ 
        'in-transit': inTransitData || [], 
        'completed': completedData || [] 
      });
    } catch (err) {
      setError('Failed to load deliveries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (donationId) => {
    try {
      setProcessingId(donationId);
      setError('');
      
      await deliverDonation(donationId);
      
      // Move from in-transit to completed
      const delivery = deliveries['in-transit'].find(d => d.donationId === donationId);
      if (delivery) {
        const updatedDelivery = { 
          ...delivery, 
          status: 'DELIVERED', 
          deliveryTime: new Date().toISOString() 
        };
        setDeliveries({
          'in-transit': deliveries['in-transit'].filter(d => d.donationId !== donationId),
          'completed': [updatedDelivery, ...deliveries['completed']]
        });
      }
      
      setSuccess('Delivery completed successfully! 🎉');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as delivered');
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

  const getTimeSince = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Just now';
    
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
              <Truck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-teal-600" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your deliveries...</p>
          </div>
        </div>
      </div>
    );
  }

  const inTransitCount = deliveries['in-transit']?.length || 0;
  const completedCount = deliveries['completed']?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Route className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Deliveries</h1>
                <p className="text-white/80 mt-1">Track your pickups and completed deliveries</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <div className="text-xs text-white/70">In Transit</div>
                <div className="text-2xl font-bold">{inTransitCount}</div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <div className="text-xs text-white/70">Completed</div>
                <div className="text-2xl font-bold">{completedCount}</div>
              </div>
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

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex">
          <button
            onClick={() => setActiveTab('in-transit')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'in-transit'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span>In Transit ({inTransitCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PackageCheck className="w-5 h-5" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

        {/* Delivery List */}
        <div className="space-y-4">
          {deliveries[activeTab]?.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'in-transit' ? (
                  <Truck className="w-12 h-12 text-gray-400" />
                ) : (
                  <PackageCheck className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {activeTab === 'in-transit' ? 'No Items In Transit' : 'No Completed Deliveries'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {activeTab === 'in-transit'
                  ? 'Pick up a donation to start a delivery. Items you pick up will appear here.'
                  : 'Your completed deliveries will appear here once you deliver items to NGOs.'}
              </p>
              {activeTab === 'in-transit' && (
                <button
                  onClick={() => navigate('/driver/available-pickups')}
                  className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-bold flex items-center space-x-2 mx-auto"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Find Available Pickups</span>
                </button>
              )}
            </div>
          ) : (
            deliveries[activeTab].map((delivery, index) => (
              <div
                key={delivery.donationId}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-emerald-200 transition-all"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === delivery.donationId ? null : delivery.donationId)}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedId(expandedId === delivery.donationId ? null : delivery.donationId)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getItemColor(delivery.itemType)} rounded-2xl flex items-center justify-center shadow-lg text-3xl`}>
                      {getItemEmoji(delivery.itemType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">{delivery.itemType}</h4>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          delivery.status === 'PICKED_UP' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {delivery.status === 'PICKED_UP' ? 'IN TRANSIT' : 'DELIVERED'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{delivery.ngoName || 'NGO'}</span>
                        </span>
                        {delivery.status === 'PICKED_UP' && delivery.pickedUpAt && (
                          <span className="flex items-center space-x-1 text-amber-600">
                            <Timer className="w-4 h-4" />
                            <span>{getTimeSince(delivery.pickedUpAt)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {delivery.status === 'PICKED_UP' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeliver(delivery.donationId);
                          }}
                          disabled={processingId === delivery.donationId}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all font-bold flex items-center space-x-2 shadow-md disabled:opacity-50"
                        >
                          {processingId === delivery.donationId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Delivered</span>
                            </>
                          )}
                        </button>
                      )}
                      {expandedId === delivery.donationId ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === delivery.donationId && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <span className="text-xs text-gray-500 flex items-center space-x-1 mb-1">
                          <Package className="w-3 h-3" />
                          <span>Donation ID</span>
                        </span>
                        <p className="font-bold text-gray-800">#{delivery.donationId}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <span className="text-xs text-gray-500 flex items-center space-x-1 mb-1">
                          <Building2 className="w-3 h-3" />
                          <span>Destination NGO</span>
                        </span>
                        <p className="font-bold text-gray-800">{delivery.ngoName || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <span className="text-xs text-gray-500 flex items-center space-x-1 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>Picked Up</span>
                        </span>
                        <p className="font-bold text-gray-800">{formatDate(delivery.pickedUpAt)}</p>
                      </div>
                      {delivery.status === 'DELIVERED' && (
                        <div className="bg-green-50 rounded-xl p-4">
                          <span className="text-xs text-green-600 flex items-center space-x-1 mb-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Delivered</span>
                          </span>
                          <p className="font-bold text-green-700">{formatDate(delivery.deliveredAt)}</p>
                        </div>
                      )}
                    </div>

                    {/* NGO Details */}
                    {delivery.ngoName && (
                      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h5 className="font-bold text-blue-800 mb-2 flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>Deliver To: {delivery.ngoName}</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
                          {delivery.ngoAddress && (
                            <p><strong>Address:</strong> {delivery.ngoAddress}, {delivery.ngoCity}</p>
                          )}
                          {delivery.ngoPhone && (
                            <p><strong>Phone:</strong> {delivery.ngoPhone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Donor Details */}
                    {delivery.donorName && (
                      <div className="mt-4 bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <h5 className="font-bold text-purple-800 mb-2 flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Picked Up From: {delivery.donorName}</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-purple-700">
                          {delivery.donorAddress && (
                            <p><strong>Address:</strong> {delivery.donorAddress}, {delivery.donorCity}</p>
                          )}
                          {delivery.donorPhone && (
                            <p><strong>Phone:</strong> {delivery.donorPhone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {delivery.status === 'PICKED_UP' && (
                      <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-sm text-amber-700 flex items-center space-x-2">
                          <Timer className="w-4 h-4" />
                          <span>This item has been in transit for <strong>{getTimeSince(delivery.pickedUpAt)}</strong>. Deliver it soon to maintain your on-time rate!</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Stats Card for Completed */}
        {activeTab === 'completed' && completedCount > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Delivery Summary</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Total Deliveries</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.onTimeRate || 0}%</div>
                <div className="text-sm text-gray-600">On-Time Rate</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{stats.rating || 0}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                  <span>Rating</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  <Award className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-sm text-gray-600">Top Performer</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
