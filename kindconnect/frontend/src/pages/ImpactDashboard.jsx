import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Heart, Target, Award, Flame, TrendingDown,
  Calendar, DollarSign, Gift, Sparkles, Trophy, Star,
  ChevronRight, Activity, BarChart3, PieChart, ArrowUp
} from 'lucide-react';
import { getImpactStats } from '../services/fundraiserService';

const ImpactDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animateCards, setAnimateCards] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImpactStats();
  }, []);

  useEffect(() => {
    if (stats) {
      setTimeout(() => setAnimateCards(true), 100);
    }
  }, [stats]);

  const fetchImpactStats = async () => {
    try {
      const data = await getImpactStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch impact stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your impact...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Your Impact Journey</h3>
          <p className="text-gray-600 mb-6">Make your first donation to see your impact statistics!</p>
          <button
            onClick={() => navigate('/donor/browse-fundraisers')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Browse Fundraisers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Impact Dashboard
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            You're Making a Difference! 🎉
          </h1>
          <p className="text-gray-600 text-lg">Track your giving journey and see the lives you've touched</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Donations Card */}
          <div className={`bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-6 h-6" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                All Time
              </div>
            </div>
            <div className="mb-2">
              <div className="text-4xl font-bold mb-1 animate-count">{stats.totalDonations}</div>
              <div className="text-purple-100 text-sm font-medium">Total Donations</div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalDonations / 25) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className={`bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-700 delay-100 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                <ArrowUp className="w-3 h-3 inline mr-1" />
                Total
              </div>
            </div>
            <div className="mb-2">
              <div className="text-4xl font-bold mb-1">₹{stats.totalAmountDonated?.toLocaleString()}</div>
              <div className="text-pink-100 text-sm font-medium">Amount Donated</div>
            </div>
            <div className="text-xs text-pink-100 mt-2">
              Rank #{stats.overallRank} among all donors 🏆
            </div>
          </div>

          {/* Fundraisers Supported Card */}
          <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-700 delay-200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Target className="w-6 h-6" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Heart className="w-3 h-3 inline mr-1" />
                Causes
              </div>
            </div>
            <div className="mb-2">
              <div className="text-4xl font-bold mb-1">{stats.fundraisersSupported}</div>
              <div className="text-blue-100 text-sm font-medium">Campaigns Supported</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((stats.fundraisersSupported / 10) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-100">{stats.fundraisersSupported}/10</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className={`bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl transform transition-all duration-700 delay-300 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-6 h-6" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Calendar className="w-3 h-3 inline mr-1" />
                Streak
              </div>
            </div>
            <div className="mb-2">
              <div className="text-4xl font-bold mb-1">{stats.consecutiveDonationStreak}</div>
              <div className="text-orange-100 text-sm font-medium">
                {stats.consecutiveDonationStreak === 1 ? 'Month' : 'Months'} Streak
              </div>
            </div>
            <div className="text-xs text-orange-100 mt-2">
              {stats.consecutiveDonationStreak >= 3 ? '🔥 On Fire! Keep it up!' : '💪 Keep the momentum going!'}
            </div>
          </div>

        </div>

        {/* Achievement Badges */}
        {stats.badges && stats.badges.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Achievement Badges</h2>
                <p className="text-gray-600 text-sm">Your milestones and accomplishments</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.badges.map((badge, index) => (
                <div 
                  key={badge.id}
                  className={`group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${animateCards ? 'animate-bounce-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="absolute top-4 right-4 text-4xl transform group-hover:scale-125 transition-transform duration-300"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' }}
                  >
                    {badge.icon}
                  </div>
                  <div className="mb-16">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{badge.progress}/{badge.target}</span>
                    </div>
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.min((badge.progress / badge.target) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${badge.color}, ${badge.color}dd)`
                        }}
                      ></div>
                    </div>
                  </div>
                  {badge.progress >= badge.target && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Donations Chart */}
        {stats.monthlyDonations && stats.monthlyDonations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Donation Trends</h2>
                <p className="text-gray-600 text-sm">Your giving pattern over the last 6 months</p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {stats.monthlyDonations.map((month, index) => {
                const maxAmount = Math.max(...stats.monthlyDonations.map(m => m.amount));
                const height = maxAmount > 0 ? (month.amount / maxAmount) * 200 : 0;
                return (
                  <div key={index} className="flex flex-col items-center group">
                    <div className="relative w-full h-64 flex flex-col justify-end mb-2">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-xl transition-all duration-1000 group-hover:from-purple-600 group-hover:to-pink-600 cursor-pointer relative"
                        style={{ 
                          height: `${height}px`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
                          ₹{month.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-gray-700">{month.month}</div>
                      <div className="text-xs text-gray-500">{month.count} gifts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {stats.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Impact by Category</h2>
                <p className="text-gray-600 text-sm">Where your donations are making a difference</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.values(stats.categoryBreakdown).map((category, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          background: `hsl(${index * 360 / Object.keys(stats.categoryBreakdown).length}, 70%, 60%)`
                        }}
                      ></div>
                      <span className="font-semibold text-gray-700">{category.category.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">₹{category.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{category.donationCount} donations</div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110"
                      style={{ 
                        width: `${category.percentage}%`,
                        background: `linear-gradient(90deg, 
                          hsl(${index * 360 / Object.keys(stats.categoryBreakdown).length}, 70%, 60%),
                          hsl(${index * 360 / Object.keys(stats.categoryBreakdown).length}, 70%, 50%)
                        )`,
                        transitionDelay: `${index * 50}ms`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">{category.percentage.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Impacts */}
        {stats.recentImpacts && stats.recentImpacts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Recent Impact Stories</h2>
                <p className="text-gray-600 text-sm">See the difference you're making</p>
              </div>
            </div>
            <div className="space-y-4">
              {stats.recentImpacts.map((impact, index) => (
                <div 
                  key={index}
                  className="group flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl hover:from-purple-50 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/donor/fundraiser/${impact.fundraiserId}`)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                    ₹
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {impact.fundraiserTitle}
                      </h3>
                      <span className="text-sm font-bold text-purple-600 whitespace-nowrap">
                        ₹{impact.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{impact.ngoName}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {impact.impactMessage}
                      </span>
                      <span className="text-gray-500">{impact.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Keep the Momentum Going! 🚀</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Every contribution creates a ripple of positive change. Discover new causes and continue your impact journey.
          </p>
          <button
            onClick={() => navigate('/donor/browse-fundraisers')}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Explore More Causes
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes count {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-count {
          animation: count 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImpactDashboard;
