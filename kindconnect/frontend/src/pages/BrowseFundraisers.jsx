import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, Users, Clock, 
  AlertTriangle, RefreshCw, Target,
  Building2
} from 'lucide-react';
import { getActiveFundraisers, getFundraisersByCategory, searchFundraisers, getUrgentFundraisers } from '../services/fundraiserService';
import Navbar from '../components/Navbar';

const categories = [
  { value: 'ALL', label: 'All Causes', icon: '🌟' },
  { value: 'EDUCATION', label: 'Education', icon: '📚' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: '🏥' },
  { value: 'FOOD_HUNGER', label: 'Food & Hunger', icon: '🍽️' },
  { value: 'DISASTER_RELIEF', label: 'Disaster Relief', icon: '🆘' },
  { value: 'ELDERLY_CARE', label: 'Elderly Care', icon: '👴' },
  { value: 'CHILDREN_WELFARE', label: 'Children', icon: '👶' },
  { value: 'ANIMAL_WELFARE', label: 'Animals', icon: '🐾' },
  { value: 'ENVIRONMENT', label: 'Environment', icon: '🌍' },
  { value: 'WOMEN_EMPOWERMENT', label: 'Women', icon: '👩' },
  { value: 'DISABILITY_SUPPORT', label: 'Disability', icon: '♿' },
  { value: 'COMMUNITY_DEVELOPMENT', label: 'Community', icon: '🏘️' }
];

export default function BrowseFundraisers() {
  const navigate = useNavigate();
  const [fundraisers, setFundraisers] = useState([]);
  const [urgentFundraisers, setUrgentFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFundraisers();
    fetchUrgentFundraisers();
  }, []);

  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const data = await getActiveFundraisers();
      setFundraisers(data);
    } catch (err) {
      console.error('Failed to load fundraisers:', err);
      setError('Failed to load fundraisers');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrgentFundraisers = async () => {
    try {
      const data = await getUrgentFundraisers();
      setUrgentFundraisers(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch urgent fundraisers:', err);
    }
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      if (category === 'ALL') {
        const data = await getActiveFundraisers();
        setFundraisers(data);
      } else {
        const data = await getFundraisersByCategory(category);
        setFundraisers(data);
      }
    } catch (err) {
      console.error('Failed to filter fundraisers:', err);
      setError('Failed to filter fundraisers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchFundraisers();
      return;
    }
    setLoading(true);
    try {
      const data = await searchFundraisers(searchQuery);
      setFundraisers(data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make a Difference Today
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Support verified NGOs and help them achieve their goals. Every donation counts!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search fundraisers by title, cause, or NGO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-4 rounded-2xl text-gray-800 shadow-xl focus:ring-4 focus:ring-white/30 transition-all text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Urgent Fundraisers */}
      {urgentFundraisers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Urgent Needs</h2>
                <p className="text-gray-600">These causes need your immediate help</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {urgentFundraisers.map((fundraiser) => (
              <div
                key={fundraiser.id}
                onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-red-200"
              >
                <div className="relative h-40">
                  <img
                    src={fundraiser.imageUrl || 'https://via.placeholder.com/400x200'}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      🔥 URGENT
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{fundraiser.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    {fundraiser.ngoName}
                  </p>
                  <div className="mb-3">
                    {(() => {
                      const raised = fundraiser.currentAmount || 0;
                      const goal = fundraiser.targetAmount || 1;
                      const percentage = Math.min(Math.round((raised / goal) * 100), 100);
                      return (
                        <>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-rose-600">₹{raised.toLocaleString()}</span>
                            <span className="text-gray-500">of ₹{(fundraiser.targetAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex space-x-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-300/30'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'ALL' ? 'All Fundraisers' : categories.find(c => c.value === selectedCategory)?.label}
            </h2>
            <p className="text-gray-600">{fundraisers.length} campaigns found</p>
          </div>
          <button
            onClick={fetchFundraisers}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-md transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Refresh</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
            <p className="text-rose-800">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500"></div>
          </div>
        ) : fundraisers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No fundraisers found</h3>
            <p className="text-gray-600">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundraisers.map((fundraiser) => (
              <div
                key={fundraiser.id}
                onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={fundraiser.imageUrl || 'https://via.placeholder.com/400x200'}
                    alt={fundraiser.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-800 text-sm font-medium rounded-full">
                      {categories.find(c => c.value === fundraiser.category)?.icon} {categories.find(c => c.value === fundraiser.category)?.label}
                    </span>
                  </div>
                  {fundraiser.urgencyLevel === 'HIGH' && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        HIGH PRIORITY
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">{fundraiser.ngoName}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{fundraiser.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{fundraiser.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    {(() => {
                      const raised = fundraiser.currentAmount || 0;
                      const goal = fundraiser.targetAmount || 1;
                      const percentage = Math.min(Math.round((raised / goal) * 100), 100);
                      return (
                        <>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-rose-600">₹{raised.toLocaleString()}</span>
                            <span className="text-gray-500">raised of ₹{(fundraiser.targetAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full transition-all"
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
                      {fundraiser.totalDonors || 0} supporters
                    </span>
                    {fundraiser.daysLeft !== null && fundraiser.daysLeft !== undefined && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {fundraiser.daysLeft} days left
                      </span>
                    )}
                  </div>

                  {/* Donate Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg shadow-pink-300/30 transition-all flex items-center justify-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
