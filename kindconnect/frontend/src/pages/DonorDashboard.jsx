import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Gift, TrendingUp, Users, Target, Plus, Package, ArrowRight, Sparkles } from 'lucide-react';
import { getDonorProfile } from '../services/profileService';
import Navbar from '../components/Navbar';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorLogo, setDonorLogo] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('donorLogo');
    if (savedLogo) {
      setDonorLogo(savedLogo);
    }
    
    // Try to load from cache first for instant display
    const cachedProfile = localStorage.getItem('donorProfile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
        setLoading(false);
      } catch (e) {
        // Ignore cache parse errors silently
      }
    }

    try {
      // Set a shorter timeout for the API call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 3000)
      );
      
      const profilePromise = getDonorProfile();
      const response = await Promise.race([profilePromise, timeoutPromise]);
      
      // Cache the profile data
      localStorage.setItem('donorProfile', JSON.stringify(response.data));
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      
      // If we have cached data, use it and don't redirect
      if (cachedProfile) {
        return;
      }
      
      // If profile doesn't exist or server error, redirect to create profile
      if (error.response?.status === 404 || error.response?.status === 500) {
        navigate('/profile/donor');
      } else {
        navigate('/');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center space-x-4">
            {donorLogo ? (
              <img 
                src={donorLogo} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back, {profile?.name}! 🎉</h1>
              <p className="text-lg text-white/90">Thank you for being a part of KindConnect. Your generosity makes a difference!</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Amount Donated</p>
            <p className="text-3xl font-bold text-gray-900">₹0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">NGOs Supported</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Impact Score</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/donor/browse-ngos')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-pink-200 rounded-2xl hover:border-pink-500 hover:shadow-lg transition-all bg-gradient-to-br from-pink-50 to-purple-50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">Donate Now</p>
                <p className="text-sm text-gray-600">Browse NGOs and donate items</p>
              </div>
              <ArrowRight className="w-6 h-6 text-pink-500 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/donor/donations')}
              className="group relative overflow-hidden flex items-center space-x-4 p-6 border-2 border-blue-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-cyan-50"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-lg mb-1">My Donations</p>
                <p className="text-sm text-gray-600">Track all your donations</p>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.address}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/profile/donor')}
            className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
