import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, CheckCircle, Clock, Building2, ArrowRight, Sparkles, Eye } from 'lucide-react';
import { getNgoProfile } from '../services/profileService';
import { getNgoDashboard } from '../services/ngoService';
import Navbar from '../components/Navbar';

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Try to load from cache first
    const cachedProfile = localStorage.getItem('ngoProfile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        // Also get logo from separate storage
        const savedLogo = localStorage.getItem('ngoLogo');
        if (savedLogo && !parsed.logo) {
          parsed.logo = savedLogo;
        }
        setProfile(parsed);
      } catch (e) {}
    }

    try {
      const [profileRes, dashboardRes] = await Promise.all([
        getNgoProfile(),
        getNgoDashboard()
      ]);
      
      const profileData = profileRes.data;
      // Include logo from localStorage if not in response
      const savedLogo = localStorage.getItem('ngoLogo');
      if (savedLogo && !profileData.logo) {
        profileData.logo = savedLogo;
      }
      
      setProfile(profileData);
      setDashboard(dashboardRes);
      localStorage.setItem('ngoProfile', JSON.stringify(profileData));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 404) {
        navigate('/profile/ngo');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
              {profile?.logo || localStorage.getItem('ngoLogo') ? (
                <img 
                  src={profile?.logo || localStorage.getItem('ngoLogo')} 
                  alt={profile?.ngoName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {profile?.ngoName}! 🌟</h1>
              <p className="text-white/80 mt-1">Let's make a difference together. Review and accept donations from generous donors.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Accepted</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard?.totalAccepted || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Active Donations</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard?.activeDonations || 0}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Cancelled</p>
            <p className="text-4xl font-bold text-gray-900">{dashboard?.cancelledDonations || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/ngo/available-donations')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-blue-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">Browse Available Donations</p>
                <p className="text-sm text-gray-600">View and accept donations from donors</p>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/ngo/my-donations')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-green-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">My Accepted Donations</p>
                <p className="text-sm text-gray-600">Track donations you've accepted</p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* NGO Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Organization Info</h2>
            <button
              onClick={() => navigate('/profile/ngo')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Edit Profile
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">NGO Name</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.ngoName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Registration Number</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
