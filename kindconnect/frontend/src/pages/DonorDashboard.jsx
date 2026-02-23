import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Gift, TrendingUp, Target, Package, ArrowRight, Sparkles, Flame, Trophy, Star } from 'lucide-react';
import { getDonorProfile } from '../services/profileService';
import { getImpactStats } from '../services/fundraiserService';
import Navbar from '../components/Navbar';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorLogo, setDonorLogo] = useState(null);

  useEffect(() => {
    loadProfile();
    loadImpactStats();
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

  const loadImpactStats = async () => {
    try {
      const data = await getImpactStats();
      setStats(data);
    } catch (error) {
      // Silently fail - stats are optional
      console.log('Could not load impact stats');
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
              <h1 className="text-3xl font-bold">Welcome back{profile?.name ? `, ${profile.name}` : ''}!</h1>
              <p className="text-pink-100 mt-1">Continue making a difference today</p>
            </div>
          </div>
        </div>

        {/* Impact Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">All Time</span>
            </div>
            <p className="text-purple-100 text-sm mb-1">Total Donations</p>
            <p className="text-4xl font-bold">{stats?.totalDonations || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              {stats?.overallRank && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  Rank #{stats.overallRank}
                </span>
              )}
            </div>
            <p className="text-pink-100 text-sm mb-1">Amount Donated</p>
            <p className="text-4xl font-bold">₹{stats?.totalAmountDonated?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <p className="text-blue-100 text-sm mb-1">Campaigns Supported</p>
            <p className="text-4xl font-bold">{stats?.fundraisersSupported || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <p className="text-orange-100 text-sm mb-1">Month Streak</p>
            <p className="text-4xl font-bold">{stats?.consecutiveDonationStreak || 0}</p>
          </div>

        </div>

        {/* Achievement Badges - Top Unlocked */}
        {stats?.badges && stats.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Your Achievements</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {stats.badges.slice(0, 4).map((badge, index) => (
                <div 
                  key={badge.id}
                  className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' }}>
                      {badge.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                    <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((badge.progress / badge.target) * 100, 100)}%`,
                          background: badge.color
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{badge.progress}/{badge.target}</p>
                  </div>
                  {badge.progress >= badge.target && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/fundraisers')}
              className="group bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="text-left flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Browse Fundraisers</p>
                  <p className="text-sm text-gray-600">Discover causes to support</p>
                </div>
                <ArrowRight className="w-6 h-6 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate('/donor/create-donation')}
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="text-left flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-bold text-gray-900 text-lg mb-1">Donate Items</p>
                  <p className="text-sm text-gray-600">Give items to those in need</p>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Recent Impact (if available) */}
        {stats?.recentImpacts && stats.recentImpacts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Impact</h2>
              <button
                onClick={() => navigate('/fundraisers')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                View More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {stats.recentImpacts.slice(0, 3).map((impact) => (
                <button
                  key={impact.fundraiserId}
                  onClick={() => navigate(`/donor/fundraiser/${impact.fundraiserId}`)}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    ₹
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{impact.fundraiserTitle}</h3>
                    <p className="text-sm text-green-600 font-medium">{impact.impactMessage}</p>
                    <p className="text-xs text-gray-500">{impact.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">₹{impact.amount.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
            <button 
              onClick={() => navigate('/profile/donor')}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-medium"
            >
              Edit Profile
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-transparent p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-transparent p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-transparent p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">City</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.city || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-transparent p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-lg font-semibold text-gray-900">{profile?.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
