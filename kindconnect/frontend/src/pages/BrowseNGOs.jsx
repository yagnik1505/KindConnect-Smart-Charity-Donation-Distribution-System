import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, User, Search, Filter, 
  Heart, ArrowLeft, Loader2, AlertCircle, CheckCircle2,
  Clock, Users, HeartHandshake, Star,
  Shield, Award, ChevronRight, ExternalLink, Wallet, CreditCard,
  BookOpen, Stethoscope, Leaf, Utensils, PawPrint, Home as HomeIcon,
  Sparkles, X
} from 'lucide-react';
import { getAllNgos } from '../services/profileService';
import Navbar from '../components/Navbar';

// NGO cover images for visual appeal
const ngoCoverImages = [
  'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop',
];

// Gradient colors for NGO logos
const logoGradients = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-orange-500 to-amber-600',
  'from-teal-500 to-cyan-600',
];

// NGO Field Categories with enhanced styling
const fieldCategories = [
  { 
    id: 'education', 
    name: 'Education', 
    icon: BookOpen, 
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'healthcare', 
    name: 'Healthcare', 
    icon: Stethoscope, 
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  { 
    id: 'environment', 
    name: 'Environment', 
    icon: Leaf, 
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  { 
    id: 'food', 
    name: 'Food & Nutrition', 
    icon: Utensils, 
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  { 
    id: 'animal', 
    name: 'Animal Welfare', 
    icon: PawPrint, 
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  { 
    id: 'shelter', 
    name: 'Shelter & Housing', 
    icon: HomeIcon, 
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
];

const BrowseNGOs = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [cities, setCities] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchNGOs();
  }, []);

  useEffect(() => {
    filterNGOs();
  }, [searchTerm, selectedCity, selectedField, showVerifiedOnly, ngos]);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllNgos();
      const ngoList = response.data || [];
      
      // Assign random field categories to NGOs for demo (in production, this would come from backend)
      const ngosWithFields = ngoList.map(ngo => ({
        ...ngo,
        fieldType: ngo.fieldType || fieldCategories[Math.floor(Math.random() * fieldCategories.length)].id
      }));
      
      setNgos(ngosWithFields);
      setFilteredNgos(ngosWithFields);
      
      const uniqueCities = [...new Set(ngosWithFields.map(ngo => ngo.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      setError('Failed to load NGOs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterNGOs = () => {
    let filtered = [...ngos];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ngo => 
        ngo.ngoName?.toLowerCase().includes(term) ||
        ngo.contactPerson?.toLowerCase().includes(term) ||
        ngo.city?.toLowerCase().includes(term) ||
        ngo.address?.toLowerCase().includes(term)
      );
    }
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(ngo => 
        ngo.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    
    if (selectedField !== 'all') {
      filtered = filtered.filter(ngo => 
        ngo.fieldType === selectedField
      );
    }
    
    if (showVerifiedOnly) {
      filtered = filtered.filter(ngo => ngo.status === 'APPROVED');
    }
    
    setFilteredNgos(filtered);
  };

  const handleDonateClick = (ngo) => {
    navigate('/donor/create-donation', { state: { selectedNgo: ngo } });
  };

  const getImageForNgo = (index) => ngoCoverImages[index % ngoCoverImages.length];
  const getGradientForNgo = (index) => logoGradients[index % logoGradients.length];

  // Enhanced NGO Card Component
  const NGOCard = ({ ngo, index }) => {
    const isApproved = ngo.status === 'APPROVED';
    const isPending = ngo.status === 'PENDING';
    const isHovered = hoveredCard === ngo.id;
    
    // Get field category info
    const fieldInfo = fieldCategories.find(f => f.id === ngo.fieldType) || fieldCategories[0];
    const FieldIcon = fieldInfo.icon;

    return (
      <div 
        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
        onMouseEnter={() => setHoveredCard(ngo.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Card Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={ngo.coverImage || getImageForNgo(index)}
            alt={ngo.ngoName}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Field Category Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <div className={`px-4 py-2 bg-gradient-to-r ${fieldInfo.gradient} backdrop-blur-sm rounded-xl flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform`}>
              <FieldIcon size={16} className="text-white" />
              <span className="text-white text-sm font-bold">{fieldInfo.name}</span>
            </div>
          </div>
          
          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4">
            {isApproved ? (
              <span className="px-4 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 size={14} />
                Verified
              </span>
            ) : isPending ? (
              <span className="px-4 py-1.5 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                <Clock size={14} />
                Pending Review
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-gray-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                {ngo.status || 'New'}
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className={`absolute top-4 left-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
              <Heart size={16} className="text-pink-500" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
              <ExternalLink size={16} className="text-gray-600" />
            </button>
          </div>
          
          {/* NGO Logo */}
          <div className="absolute -bottom-8 left-6">
            <div className={`w-20 h-20 bg-gradient-to-br ${getGradientForNgo(index)} rounded-2xl shadow-xl flex items-center justify-center border-4 border-white transform transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
              {ngo.logo ? (
                <img src={ngo.logo} alt={ngo.ngoName} className="w-12 h-12 object-contain rounded-lg" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {ngo.ngoName?.charAt(0) || 'N'}
                </span>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-800">{ngo.rating || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="pt-12 pb-6 px-6">
          {/* NGO Name & Trust Badge */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                {ngo.ngoName || 'NGO Organization'}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={14} className="text-pink-500" />
                {ngo.city || 'Location'}
              </p>
            </div>
            {isApproved && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                <Shield size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-blue-600">Trusted</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <User size={16} className="text-purple-500" />
              <span className="text-sm font-medium">{ngo.contactPerson || 'Contact Person'}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} className="text-green-500" />
              <span className="text-sm">{ngo.phone || 'Phone Number'}</span>
            </div>
            
            {ngo.upiId && (
              <div className="flex items-center gap-3 text-gray-600 bg-green-50 rounded-lg px-3 py-2">
                <Wallet size={16} className="text-green-600" />
                <span className="text-sm font-medium">{ngo.upiId}</span>
              </div>
            )}
          </div>

          {/* Payment Information - Bank Details Only */}
          {ngo.bankAccountNumber && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-gray-800">Bank Account Details</h4>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white/60 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CreditCard size={14} className="text-blue-600" />
                    <p className="text-xs text-gray-500 font-medium">Bank Details</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-5">
                    <div>
                      <p className="text-xs text-gray-400">A/C Number</p>
                      <p className="text-xs font-mono font-semibold text-gray-800">{ngo.bankAccountNumber}</p>
                    </div>
                    {ngo.ifscCode && (
                      <div>
                        <p className="text-xs text-gray-400">IFSC</p>
                        <p className="text-xs font-mono font-semibold text-gray-800">{ngo.ifscCode}</p>
                      </div>
                    )}
                    {ngo.bankName && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Bank</p>
                        <p className="text-xs font-semibold text-gray-800">{ngo.bankName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleDonateClick(ngo)}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-xl
                         hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-[1.02] transition-all duration-300
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
            >
              <Heart size={18} className="group-hover/btn:animate-pulse" />
              <span>Donate Now</span>
              <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            {/* Animated Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 animate-bounce">
              <HeartHandshake size={40} className="text-white" />
            </div>
            
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              Find Your Cause, <span className="text-pink-200">Make a Difference</span>
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect with verified NGOs working tirelessly in your community. 
              Every donation, big or small, creates ripples of positive change.
            </p>
            
            {/* Stats Cards */}
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 min-w-[160px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 size={28} className="text-pink-200" />
                  <span className="text-4xl font-extrabold text-white">{ngos.length}</span>
                </div>
                <p className="text-white/80 text-sm font-medium">Partner NGOs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 min-w-[160px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin size={28} className="text-cyan-200" />
                  <span className="text-4xl font-extrabold text-white">{cities.length}</span>
                </div>
                <p className="text-white/80 text-sm font-medium">Cities Active</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 min-w-[160px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award size={28} className="text-yellow-200" />
                  <span className="text-4xl font-extrabold text-white">{ngos.filter(n => n.status === 'APPROVED').length}</span>
                </div>
                <p className="text-white/80 text-sm font-medium">Verified</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 min-w-[160px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users size={28} className="text-green-200" />
                  <span className="text-4xl font-extrabold text-white">1K+</span>
                </div>
                <p className="text-white/80 text-sm font-medium">Lives Impacted</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Category Filter Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-pink-500" />
              <h3 className="font-bold text-gray-800">Browse by Category</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedField('all')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedField === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 size={18} />
                <span>All Categories</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {ngos.length}
                </span>
              </button>
              {fieldCategories.map((field) => {
                const Icon = field.icon;
                const count = ngos.filter(n => n.fieldType === field.id).length;
                return (
                  <button
                    key={field.id}
                    onClick={() => setSelectedField(field.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                      selectedField === field.id
                        ? `bg-gradient-to-r ${field.gradient} text-white shadow-lg`
                        : `${field.bgColor} ${field.textColor} hover:shadow-md`
                    }`}
                  >
                    <Icon size={18} />
                    <span>{field.name}</span>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedField === field.id ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Search by NGO name, city, or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all text-gray-700 placeholder-gray-400 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </div>
            
            {/* City Filter */}
            <div className="relative min-w-[220px]">
              <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="all">🌍 All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>📍 {city}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                List
              </button>
            </div>
          </div>
          
          {/* Results Count & Quick Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">
                Showing <span className="text-pink-600 font-bold">{filteredNgos.length}</span> of {ngos.length} NGOs
                {selectedField !== 'all' && (
                  <span className="ml-2 text-sm text-gray-500">
                    in {fieldCategories.find(f => f.id === selectedField)?.name}
                  </span>
                )}
              </span>
              {(searchTerm || selectedCity !== 'all' || selectedField !== 'all' || showVerifiedOnly) && (
                <button
                  onClick={() => { 
                    setSearchTerm(''); 
                    setSelectedCity('all'); 
                    setSelectedField('all');
                    setShowVerifiedOnly(false);
                  }}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
                >
                  Clear all filters ×
                </button>
              )}
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  showVerifiedOnly
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  {showVerifiedOnly ? 'Verified Only ✓' : 'Verified Only'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-pink-200 rounded-full animate-pulse"></div>
              <Loader2 className="absolute inset-0 m-auto animate-spin text-pink-500" size={40} />
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Finding amazing NGOs for you...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
            <button
              onClick={fetchNGOs}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredNgos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Building2 className="text-gray-400" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No NGOs Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchTerm || selectedCity !== 'all' || selectedField !== 'all'
                ? 'Try adjusting your search filters to find more NGOs.'
                : 'No NGOs are available at the moment. Please check back later.'}
            </p>
            {(searchTerm || selectedCity !== 'all' || selectedField !== 'all' || showVerifiedOnly) && (
              <button
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedCity('all'); 
                  setSelectedField('all');
                  setShowVerifiedOnly(false);
                }}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all transform hover:scale-105"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* NGO Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredNgos.map((ngo, index) => (
                <NGOCard key={ngo.id} ngo={ngo} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseNGOs;
