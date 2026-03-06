import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Phone, User, Search,
  Heart, ArrowLeft, Loader2, AlertCircle, CheckCircle2,
  Clock, HeartHandshake, Star,
  Shield, Award, ChevronRight, Wallet, CreditCard,
  BookOpen, Stethoscope, Leaf, Utensils, PawPrint, Home as HomeIcon,
  Sparkles, X, Grid3X3, List, TrendingUp, Globe, ArrowRight
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
    borderColor: 'border-blue-200',
    ringColor: 'ring-blue-400',
    shadowColor: 'shadow-blue-200/50',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    ringColor: 'ring-red-400',
    shadowColor: 'shadow-red-200/50',
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: Leaf,
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    ringColor: 'ring-green-400',
    shadowColor: 'shadow-green-200/50',
  },
  {
    id: 'food',
    name: 'Food & Nutrition',
    icon: Utensils,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    ringColor: 'ring-orange-400',
    shadowColor: 'shadow-orange-200/50',
  },
  {
    id: 'animal',
    name: 'Animal Welfare',
    icon: PawPrint,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    ringColor: 'ring-purple-400',
    shadowColor: 'shadow-purple-200/50',
  },
  {
    id: 'shelter',
    name: 'Shelter & Housing',
    icon: HomeIcon,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    ringColor: 'ring-indigo-400',
    shadowColor: 'shadow-indigo-200/50',
  },
];

// Animated counter hook
const useAnimatedCount = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (target > 0 && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) {
          countRef.current = requestAnimationFrame(animate);
        }
      };
      countRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(countRef.current);
    }
  }, [target, duration]);

  return count;
};

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
  const [expandedBank, setExpandedBank] = useState(null);

  // Animated counters
  const animatedNgoCount = useAnimatedCount(ngos.length);
  const animatedCityCount = useAnimatedCount(cities.length);
  const animatedVerifiedCount = useAnimatedCount(ngos.filter(n => n.status === 'APPROVED').length);

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

  // ─── Enhanced NGO Card ────────────────────────────────────────────
  const NGOCard = ({ ngo, index }) => {
    const isApproved = ngo.status === 'APPROVED';
    const isPending = ngo.status === 'PENDING';
    const isHovered = hoveredCard === ngo.id;
    const isBankExpanded = expandedBank === ngo.id;

    const fieldInfo = fieldCategories.find(f => f.id === ngo.fieldType) || fieldCategories[0];
    const FieldIcon = fieldInfo.icon;

    return (
      <div
        className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-500 cursor-default
                    ${isHovered
            ? 'shadow-2xl shadow-pink-200/30 border-pink-200/80 -translate-y-3 scale-[1.01]'
            : 'shadow-md shadow-gray-100 border-white/60 hover:shadow-xl hover:shadow-rose-100/40'
          }`}
        style={{ perspective: '1200px' }}
        onMouseEnter={() => setHoveredCard(ngo.id)} 
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Decorative top gradient bar */}
        <div className={`h-1 bg-gradient-to-r ${fieldInfo.gradient}`} />

        {/* Cover Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={ngo.coverImage || getImageForNgo(index)}
            alt={ngo.ngoName}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110 brightness-105' : 'scale-100'}`}
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Field badge (top‑left) */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg bg-gradient-to-r ${fieldInfo.gradient} shadow-lg ring-1 ring-white/20`}>
              <FieldIcon size={13} /> {fieldInfo.name}
            </span>
          </div>

          {/* Status badge (top‑right) */}
          <div className="absolute top-3 right-3">
            {isApproved ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur rounded-lg ring-1 ring-emerald-300 shadow">
                <CheckCircle2 size={13} /> Verified
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 backdrop-blur rounded-lg ring-1 ring-amber-300 shadow animate-pulse">
                <Clock size={13} /> Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100/90 backdrop-blur rounded-lg ring-1 ring-gray-300 shadow">
                {ngo.status || 'New'}
              </span>
            )}
          </div>

          {/* Floating Logo */}
          <div className="absolute -bottom-7 left-5 z-10">
            <div className={`w-16 h-16 bg-gradient-to-br ${getGradientForNgo(index)} rounded-xl shadow-xl flex items-center justify-center ring-[3px] ring-white transition-transform duration-300 ${isHovered ? 'scale-110 -rotate-2' : ''}`}>
              {ngo.logo ? (
                <img src={ngo.logo} alt={ngo.ngoName} className="w-10 h-10 object-contain rounded-md" />
              ) : (
                <span className="text-2xl font-extrabold text-white drop-shadow">{ngo.ngoName?.charAt(0) || 'N'}</span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-md">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-gray-800">{ngo.rating || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-10 pb-5 px-5">
          {/* Name row */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                {ngo.ngoName || 'NGO Organization'}
              </h3>
              <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin size={13} className="text-pink-400 flex-shrink-0" />
                <span className="truncate">{ngo.city || 'Location'}</span>
              </p>
            </div>
            {isApproved && (
              <span className="flex-shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 text-[11px] font-semibold px-2 py-1 rounded-md ring-1 ring-emerald-200">
                <Shield size={12} /> Trusted
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />

          {/* Contact pills */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-rose-50/80 to-pink-50/60 rounded-lg px-3 py-2 ring-1 ring-rose-100/80">
              <div className="w-7 h-7 bg-pink-100/80 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">{ngo.contactPerson || 'Contact Person'}</span>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-600">{ngo.phone || 'Phone Number'}</span>
            </div>

            {ngo.upiId && (
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 ring-1 ring-green-100">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wallet size={14} className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{ngo.upiId}</span>
              </div>
            )}
          </div>

          {/* Bank Details (collapsible) */}
          {ngo.bankAccountNumber && (
            <div className="mb-4">
              <button
                onClick={() => setExpandedBank(isBankExpanded ? null : ngo.id)}
                className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-pink-600 bg-pink-50/60 hover:bg-pink-50 rounded-lg px-3 py-2 transition-colors ring-1 ring-pink-100/80"
              >
                <span className="flex items-center gap-2">
                  <CreditCard size={15} /> Bank Details
                </span>
                <ChevronRight size={15} className={`transition-transform duration-300 ${isBankExpanded ? 'rotate-90' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isBankExpanded ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                <div className="bg-gradient-to-br from-rose-50/60 to-pink-50/50 rounded-lg p-3 ring-1 ring-pink-100/70 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">A/C Number</span>
                    <span className="font-mono font-bold text-gray-800">{ngo.bankAccountNumber}</span>
                  </div>
                  {ngo.ifscCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">IFSC</span>
                      <span className="font-mono font-bold text-gray-800">{ngo.ifscCode}</span>
                    </div>
                  )}
                  {ngo.bankName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank</span>
                      <span className="font-bold text-gray-800">{ngo.bankName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => handleDonateClick(ngo)}
            className="w-full relative overflow-hidden py-3 px-5 rounded-xl font-bold text-white text-sm
                       bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600
                       hover:from-rose-600 hover:via-pink-600 hover:to-purple-700
                       shadow-lg shadow-rose-200/40 hover:shadow-rose-300/50 active:scale-[0.98]
                       flex items-center justify-center gap-2 transition-all duration-300 group/btn"
          >
            {/* shimmer */}
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Heart size={16} className="group-hover/btn:scale-125 transition-transform" />
            <span>Donate Now</span>
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║                        MAIN RENDER                              ║
  // ╚══════════════════════════════════════════════════════════════════╝
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-purple-50/40">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700" />
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-300/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/25 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-rose-200/25 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pb-28">
          {/* back + breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-10 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="text-center max-w-4xl mx-auto">
            {/* icon cluster */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-ping [animation-duration:3s]" />
              <div className="relative w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/20">
                <HeartHandshake size={38} className="text-white drop-shadow" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Discover &amp; Support <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-white">
                Trusted NGOs
              </span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              Browse verified organisations making real change in your community.
              Your contribution — big or small — creates lasting impact.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Building2, value: animatedNgoCount, label: 'Partner NGOs', accent: 'from-rose-400 to-pink-500' },
                { icon: Globe,     value: animatedCityCount,   label: 'Cities Active',  accent: 'from-fuchsia-400 to-purple-500' },
                { icon: Award,     value: animatedVerifiedCount, label: 'Verified',       accent: 'from-amber-400 to-orange-400' },
                { icon: TrendingUp, value: '1K+',  label: 'Lives Impacted', accent: 'from-pink-400 to-fuchsia-500' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl px-4 py-5 hover:bg-white/[0.14] transition-colors group/stat"
                  >
                    <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <p className="text-3xl font-extrabold text-white">{s.value}</p>
                    <p className="text-white/60 text-xs font-medium mt-1 uppercase tracking-wider">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* curved separator */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
            <path d="M0 80h1440V40c-120 30-360 50-720 50S120 70 0 40v40z" fill="#fffbfc" />
          </svg>
        </div>
      </section>

      {/* ─── Filters Panel ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/[0.04] p-6 sm:p-8">

          {/* Category chips */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-pink-500" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Categories</h3>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide -mx-1 px-1">
              {/* "All" chip */}
              <button
                onClick={() => setSelectedField('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ring-1
                  ${selectedField === 'all'
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white ring-transparent shadow-lg shadow-rose-300/40'
                    : 'bg-white text-gray-600 ring-gray-200 hover:ring-pink-200 hover:bg-pink-50/40'
                  }`}
              >
                <Grid3X3 size={15} />
                All
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${selectedField === 'all' ? 'bg-white/20' : 'bg-gray-200/60'}`}>
                  {ngos.length}
                </span>
              </button>

              {fieldCategories.map((field) => {
                const Icon = field.icon;
                const count = ngos.filter(n => n.fieldType === field.id).length;
                const active = selectedField === field.id;
                return (
                  <button
                    key={field.id}
                    onClick={() => setSelectedField(field.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ring-1
                      ${active
                        ? `bg-gradient-to-r ${field.gradient} text-white ring-transparent shadow-lg ${field.shadowColor}`
                        : `${field.bgColor} ${field.textColor} ring-transparent hover:shadow-md hover:ring-1 hover:${field.borderColor}`
                      }`}
                  >
                    <Icon size={15} />
                    {field.name}
                    {count > 0 && (
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-white/80'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + filters row */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search NGOs by name, city or cause..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400
                           ring-1 ring-gray-200 focus:ring-2 focus:ring-pink-400 focus:bg-white outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-pink-50 transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* City */}
            <div className="relative min-w-[200px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-700
                           ring-1 ring-gray-200 focus:ring-2 focus:ring-pink-400 focus:bg-white outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Verified toggle */}
            <button
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ring-1
                ${showVerifiedOnly
                  ? 'bg-emerald-500 text-white ring-transparent shadow-lg shadow-emerald-300/30'
                  : 'bg-gray-50 text-gray-600 ring-gray-200 hover:ring-emerald-300 hover:text-emerald-700'
                }`}
            >
              <CheckCircle2 size={16} />
              Verified
            </button>

            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 self-stretch">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-pink-600 ring-1 ring-pink-100' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 size={15} /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-pink-600 ring-1 ring-pink-100' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={15} /> List
              </button>
            </div>
          </div>

          {/* Active filter summary */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-800">{filteredNgos.length}</span> of {ngos.length} organisations
              {selectedField !== 'all' && (
                <span className="ml-1 text-pink-600 font-medium">
                  in {fieldCategories.find(f => f.id === selectedField)?.name}
                </span>
              )}
            </p>
            {(searchTerm || selectedCity !== 'all' || selectedField !== 'all' || showVerifiedOnly) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCity('all'); setSelectedField('all'); setShowVerifiedOnly(false); }}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Content ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {loading ? (
          /* ── Loading skeleton ── */
          <div className="flex flex-col items-center justify-center py-28">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-pink-100 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto text-pink-500 animate-spin" size={36} />
            </div>
            <p className="text-gray-500 text-lg font-medium animate-pulse">Finding amazing NGOs for you...</p>
            {/* Ghost cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* ── Error ── */
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-red-200">
              <AlertCircle className="text-red-400" size={44} />
            </div>
            <p className="text-red-600 text-lg font-semibold mb-2">Something went wrong</p>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={fetchNGOs}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Try Again
            </button>
          </div>
        ) : filteredNgos.length === 0 ? (
          /* ── Empty ── */
          <div className="flex flex-col items-center justify-center py-28">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-gray-200">
              <Search className="text-gray-300" size={52} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No NGOs found</h3>
            <p className="text-gray-400 text-center max-w-sm mb-6 text-sm">
              {searchTerm || selectedCity !== 'all' || selectedField !== 'all'
                ? 'Try adjusting your search or filters to discover more organisations.'
                : 'No NGOs are available at the moment. Please check back later.'}
            </p>
            {(searchTerm || selectedCity !== 'all' || selectedField !== 'all' || showVerifiedOnly) && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCity('all'); setSelectedField('all'); setShowVerifiedOnly(false); }}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          /* ── Grid / List ── */
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
            {filteredNgos.map((ngo, index) => (
              <NGOCard key={ngo.id} ngo={ngo} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Footer accent ─────────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-600" />
    </div>
  );
};

export default BrowseNGOs;
