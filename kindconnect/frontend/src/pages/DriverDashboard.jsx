import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, Package, CheckCircle, Clock, MapPin, Navigation,
  ArrowRight, Sparkles, TrendingUp, Star, Award, Zap,
  AlertCircle, RefreshCw, User, Phone
} from 'lucide-react';
import { getDriverProfile } from '../services/profileService';
import { getDriverDashboard, getAvailablePickups } from '../services/driverService';
import Navbar from '../components/Navbar';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState({ totalPickups: 0, totalDeliveries: 0, rating: 0, onTimeRate: 0 });
  const [availablePickups, setAvailablePickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [driverLogo, setDriverLogo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('driverLogo');
    if (savedLogo) {
      setDriverLogo(savedLogo);
    }

    // Try cache first
    const cachedProfile = localStorage.getItem('driverProfile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error('Failed to parse cached profile:', e);
      }
    }

    try {
      const [profileRes, dashboardRes, pickupsRes] = await Promise.all([
        getDriverProfile(),
        getDriverDashboard(),
        getAvailablePickups()
      ]);
      
      setProfile(profileRes.data);
      setDashboard(dashboardRes);
      setAvailablePickups(pickupsRes || []);
      setIsAvailable(profileRes.data?.available ?? true);
      localStorage.setItem('driverProfile', JSON.stringify(profileRes.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 404) {
        navigate('/profile/driver');
      }
    }
  };

  const getVehicleEmoji = (type) => {
    const emojis = {
      'BIKE': '🏍️',
      'AUTO': '🛺',
      'CAR': '🚗',
      'VAN': '🚐',
      'TRUCK': '🚚'
    };
    return emojis[type] || '🚗';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <Truck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-600" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-5">
              {driverLogo ? (
                <img 
                  src={driverLogo} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">Hello, {profile?.name}!</h1>
                  <span className="text-3xl">{getVehicleEmoji(profile?.vehicleType)}</span>
                </div>
                <p className="text-white/80 text-lg">Ready to make deliveries and spread kindness today?</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile?.phone}</span>
                  </span>
                  <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium uppercase">
                    {profile?.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center space-x-4">
              <div className={`px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 ${
                isAvailable 
                  ? 'bg-green-400/30 text-green-100 border-2 border-green-300/50' 
                  : 'bg-red-400/30 text-red-100 border-2 border-red-300/50'
              }`}>
                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></div>
                <span>{isAvailable ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Pickups</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard.totalPickups}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-teal-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-teal-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Deliveries Done</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard.totalDeliveries}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Your Rating</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard.rating || 0} <span className="text-lg text-yellow-500">★</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-cyan-100 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <Clock className="w-6 h-6 text-cyan-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">On-Time Rate</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard.onTimeRate || 0}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              <span>Quick Actions</span>
            </h2>
            <button 
              onClick={loadData}
              className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/driver/available-pickups')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-emerald-200 rounded-2xl hover:border-emerald-500 hover:shadow-xl transition-all bg-gradient-to-br from-emerald-50 to-teal-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-gray-900 text-lg">Available Pickups</p>
                  {availablePickups.length > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
                      {availablePickups.length} NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">View donations ready for pickup</p>
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-500 group-hover:translate-x-2 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/driver/my-deliveries')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-teal-200 rounded-2xl hover:border-teal-500 hover:shadow-xl transition-all bg-gradient-to-br from-teal-50 to-cyan-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg">My Deliveries</p>
                <p className="text-sm text-gray-600 mt-1">Track your pickup & delivery history</p>
              </div>
              <ArrowRight className="w-6 h-6 text-teal-500 group-hover:translate-x-2 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/profile/driver')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-cyan-200 rounded-2xl hover:border-cyan-500 hover:shadow-xl transition-all bg-gradient-to-br from-cyan-50 to-blue-50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg">Edit Profile</p>
                <p className="text-sm text-gray-600 mt-1">Update your details & vehicle info</p>
              </div>
              <ArrowRight className="w-6 h-6 text-cyan-500 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Available Pickups Preview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Package className="w-6 h-6 text-emerald-500" />
              <span>Ready for Pickup</span>
              {availablePickups.length > 0 && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                  {availablePickups.length} available
                </span>
              )}
            </h2>
            <button 
              onClick={() => navigate('/driver/available-pickups')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {availablePickups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Pickups Available</h3>
              <p className="text-gray-600">Check back soon for new donation pickups!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePickups.slice(0, 3).map((pickup, index) => (
                <div 
                  key={pickup.donationId || index}
                  className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate('/driver/available-pickups')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/driver/available-pickups')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md text-3xl">
                      {getItemEmoji(pickup.itemType)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{pickup.itemType || 'Donation'}</p>
                      <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Ready for pickup</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 text-lg mb-2">Driver Tips</h3>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Always verify the donation details before pickup</li>
                <li>• Handle items with care, especially fragile donations</li>
                <li>• Contact the NGO if there are any issues with delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
