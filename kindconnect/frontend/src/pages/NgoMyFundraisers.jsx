import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Eye, Pause, Play, Edit, TrendingUp, Users, 
  Clock, Target, RefreshCw, AlertCircle, Search,
  DollarSign, Calendar, BarChart3
} from 'lucide-react';
import { getMyFundraisers, toggleFundraiserStatus } from '../services/fundraiserService';
import Navbar from '../components/Navbar';

const categoryIcons = {
  EDUCATION: '📚',
  HEALTHCARE: '🏥',
  FOOD_HUNGER: '🍽️',
  DISASTER_RELIEF: '🆘',
  ELDERLY_CARE: '👴',
  CHILDREN_WELFARE: '👶',
  ANIMAL_WELFARE: '🐾',
  ENVIRONMENT: '🌍',
  WOMEN_EMPOWERMENT: '👩',
  DISABILITY_SUPPORT: '♿',
  COMMUNITY_DEVELOPMENT: '🏘️',
  OTHER: '📦'
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700'
};

export default function MyFundraisers() {
  const navigate = useNavigate();
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const data = await getMyFundraisers();
      setFundraisers(data);
    } catch (err) {
      setError('Failed to load fundraisers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleFundraiserStatus(id);
      fetchFundraisers();
    } catch (err) {
      alert('Failed to update fundraiser status');
    }
  };

  const filteredFundraisers = fundraisers.filter(f => {
    const matchesFilter = filter === 'ALL' || f.status === filter;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: fundraisers.length,
    active: fundraisers.filter(f => f.status === 'ACTIVE').length,
    totalRaised: fundraisers.reduce((sum, f) => sum + (f.currentAmount || 0), 0),
    totalDonors: fundraisers.reduce((sum, f) => sum + (f.totalDonors || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading fundraisers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Fundraisers</h1>
            <p className="text-lg text-gray-600">Manage and track your fundraising campaigns</p>
          </div>
          <button
            onClick={() => navigate('/ngo/create-fundraiser')}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Fundraiser
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Total Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalRaised.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600">Total Donors</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search fundraisers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={fetchFundraisers}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Fundraisers List */}
        {filteredFundraisers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No fundraisers yet</h3>
            <p className="text-gray-600 mb-6">Start your first fundraiser to raise funds for your cause!</p>
            <button
              onClick={() => navigate('/ngo/create-fundraiser')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Fundraiser
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFundraisers.map((fundraiser) => (
              <div
                key={fundraiser.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-40">
                  <img
                    src={fundraiser.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[fundraiser.status]}`}>
                      {fundraiser.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-2xl">{categoryIcons[fundraiser.category]}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{fundraiser.title}</h3>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    {(() => {
                      const raised = fundraiser.currentAmount || 0;
                      const goal = fundraiser.targetAmount || 1;
                      const percentage = Math.min(Math.round((raised / goal) * 100), 100);
                      return (
                        <>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">₹{raised.toLocaleString()}</span>
                            <span className="font-semibold text-gray-800">₹{(fundraiser.targetAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{percentage}% funded</p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {fundraiser.totalDonors || 0} donors
                    </span>
                    {fundraiser.daysLeft !== null && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {fundraiser.daysLeft} days left
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/ngo/edit-fundraiser/${fundraiser.id}`)}
                      className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {(fundraiser.status === 'ACTIVE' || fundraiser.status === 'PAUSED') && (
                      <button
                        onClick={() => handleToggleStatus(fundraiser.id)}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all ${
                          fundraiser.status === 'ACTIVE'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {fundraiser.status === 'ACTIVE' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
