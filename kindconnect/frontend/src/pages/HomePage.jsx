import { Heart, Truck, TrendingUp, ChevronRight, ChevronLeft, Search, Bell, Award, Target, Eye, Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkProfileCompletion, getDonorProfile, getNgoProfile, getDriverProfile, getAllNgos, getPublicNgos } from '../services/profileService';
import { getActiveFundraisers } from '../services/fundraiserService';

// Import images
import feedImage from '../assets/feed_image.webp';
import elderImage from '../assets/elder_image.jpg';
import educationImage from '../assets/education_image.jpg';
import winterImage from '../assets/winter_image.jpeg';
import medicalImage from '../assets/medical_image.jpg';
import trackdonationIcon from '../assets/track_donation.png';
import taxBenefitIcon from '../assets/tax_benifit.png';
import physicalDonationIcon from '../assets/physical_donation.jpg';
import verifiedNgoIcon from '../assets/verified_ngo.jpg';
import donor1Image from '../assets/donor1.jpg';
import donor2Image from '../assets/dono2.jpg';
import donor3Image from '../assets/donor3.jpg';

// Fallback images for fundraisers
const fallbackImages = [feedImage, elderImage, educationImage, medicalImage, winterImage];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userLogo, setUserLogo] = useState(null);
  const [fundraisers, setFundraisers] = useState([]);
  const [loadingFundraisers, setLoadingFundraisers] = useState(true);
  const [totalNgos, setTotalNgos] = useState(0);
  const [ngoPartners, setNgoPartners] = useState([]);

  // Check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('authToken') !== null;
  };

  // Check authentication status on mount and set state
  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
    const role = localStorage.getItem('userRole') || '';
    setUserRole(role);
    
    // Load user logo based on role
    if (role === 'DRIVER') {
      setUserLogo(localStorage.getItem('driverLogo'));
    } else if (role === 'DONOR') {
      setUserLogo(localStorage.getItem('donorLogo'));
    } else if (role === 'NGO') {
      setUserLogo(localStorage.getItem('ngoLogo'));
    }
  }, []);

  // Check profile completion on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn()) {
      checkProfile();
      fetchUserName();
    }
  }, []);

  // Fetch fundraisers and NGO count for homepage
  useEffect(() => {
    fetchFundraisers();
    fetchNgoCount();
  }, []);

  const fetchNgoCount = async () => {
    try {
      // Try public endpoint first, then fall back to authenticated endpoint
      let ngos = [];
      try {
        const response = await getPublicNgos();
        console.log('Public NGO API response:', response);
        ngos = response.data || response || [];
        console.log('Parsed NGOs:', ngos);
      } catch (error_) {
        console.log('Public endpoint failed:', error_);
        // If public fails, try authenticated endpoint
        const response = await getAllNgos();
        console.log('Authenticated NGO API response:', response);
        ngos = response.data || response || [];
      }
      
      console.log('Final NGOs array:', ngos, 'Is Array:', Array.isArray(ngos));
      if (Array.isArray(ngos)) {
        setTotalNgos(ngos.length);
        setNgoPartners(ngos.slice(0, 6));
      }
    } catch (err) {
      console.log('Could not fetch NGO list:', err);
    }
  };

  const fetchFundraisers = async () => {
    try {
      setLoadingFundraisers(true);
      const data = await getActiveFundraisers();
      setFundraisers(data.slice(0, 3)); // Show top 3 fundraisers
    } catch (err) {
      console.error('Could not fetch fundraisers:', err);
    } finally {
      setLoadingFundraisers(false);
    }
  };

  // Fetch user name from profile
  const fetchUserName = async () => {
    try {
      const role = localStorage.getItem('userRole');
      
      // Check cache first
      const cachedProfile = localStorage.getItem(`${role.toLowerCase()}Profile`);
      if (cachedProfile) {
        const profile = JSON.parse(cachedProfile);
        setUserName(profile.name || profile.ngoName || role.toLowerCase());
        return;
      }

      // Fetch from API
      let profile;
      if (role === 'DONOR') {
        profile = await getDonorProfile();
      } else if (role === 'NGO') {
        profile = await getNgoProfile();
      } else if (role === 'DRIVER') {
        profile = await getDriverProfile();
      }
      
      if (profile) {
        setUserName(profile.name || profile.ngoName || role.toLowerCase());
        localStorage.setItem(`${role.toLowerCase()}Profile`, JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fallback to role if profile fetch fails
      const role = localStorage.getItem('userRole');
      setUserName(role?.toLowerCase() || 'user');
    }
  };

  const checkProfile = async () => {
    // Check localStorage first for instant result
    const cachedStatus = localStorage.getItem('profileCompleted');
    if (cachedStatus === 'true') {
      setShowProfileBanner(false);
      return;
    }

    try {
      // Add shorter timeout to prevent long waiting
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 2000)
      );
      
      const profilePromise = checkProfileCompletion();
      const profileStatus = await Promise.race([profilePromise, timeoutPromise]);
      
      if (!profileStatus.hasProfile) {
        setShowProfileBanner(true);
        localStorage.removeItem('profileCompleted');
      } else {
        localStorage.setItem('profileCompleted', 'true');
        setShowProfileBanner(false);
      }
    } catch (error) {
      console.error('Profile check error:', error);
      // Silently handle errors - assume profile not complete if no cache
      if (!cachedStatus) {
        setShowProfileBanner(true);
      }
    }
  };

  const handleCompleteProfile = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'DONOR') {
      navigate('/profile/donor');
    } else if (role === 'NGO') {
      navigate('/profile/ngo');
    } else if (role === 'DRIVER') {
      navigate('/profile/driver');
    }
    setShowProfileBanner(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileCompleted');
    localStorage.removeItem('donorProfile');
    localStorage.removeItem('ngoProfile');
    localStorage.removeItem('driverProfile');
    setIsAuthenticated(false);
    setUserName('');
    navigate('/');
  };

  // Scroll to contact/footer section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to Featured Campaigns section
  const scrollToFundraisers = () => {
    const campaignsSection = document.getElementById('featured-campaigns');
    if (campaignsSection) {
      campaignsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to Trusted NGO Partners section
  const scrollToNgos = () => {
    const ngosSection = document.getElementById('trusted-partners');
    if (ngosSection) {
      ngosSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle protected navigation - check both authentication and profile completion
  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn()) {
      navigate('/auth/login');
    } else if (showProfileBanner) {
      // Profile not completed - show alert and prevent navigation
      alert('Please complete your profile first to access all features!');
      return;
    } else {
      navigate(path);
    }
  };

  const heroSlides = [
    {
      title: "Every meal matters. Help us to feed hungry children today",
      subtitle: "Your donation provides nutritious meals to children in need. One meal can change a life forever.",
      bgImage: feedImage,
      fallbackGradient: "from-orange-600 to-red-600"
    },
    {
      title: "This winter, be the warmth they desperately need",
      subtitle: "Abandoned elderly people are struggling in the bitter cold. Your support provides shelter, warm meals, and dignity.",
      bgImage: winterImage,
      fallbackGradient: "from-blue-600 to-indigo-600"
    },
    {
      title: "Give the gift of education to children who dream of a better tomorrow",
      subtitle: "Empower blind and disabled children with quality education. Every child deserves the chance to learn and grow.",
      bgImage: educationImage,
      fallbackGradient: "from-green-600 to-teal-600"
    },
    {
      title: "Healing hands needed: Help us provide life-saving medical care",
      subtitle: "Disabled children are waiting for critical medical treatment. Your donation can give them hope and a healthier future.",
      bgImage: medicalImage,
      fallbackGradient: "from-teal-600 to-cyan-600"
    },
    {
      title: "No elder should face their final years alone and forgotten",
      subtitle: "Abandoned elders deserve love, care, and respect. Help us provide them shelter, medical care, and the dignity they've earned.",
      bgImage: elderImage,
      fallbackGradient: "from-purple-600 to-pink-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Handle logo click - scroll to top
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Enhanced Navigation - Role-specific colors */}
      <nav className={`shadow-lg sticky top-0 z-50 backdrop-blur-lg ${
        userRole === 'ADMIN'
          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600'
          : userRole === 'NGO' 
          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' 
          : userRole === 'DRIVER'
          ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600'
          : 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={handleLogoClick}
              onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
              role="button"
              tabIndex={0}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Heart className={`h-6 w-6 ${userRole === 'ADMIN' ? 'text-indigo-600' : userRole === 'NGO' ? 'text-blue-600' : userRole === 'DRIVER' ? 'text-green-600' : 'text-pink-500'}`} fill="currentColor" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white tracking-tight">KindConnect</span>
              </div>
            </div>

            {/* Desktop Navigation Links - Role Specific */}
            <div className="hidden lg:flex items-center space-x-1">
              <button onClick={scrollToTop} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                Home
              </button>
              {userRole === 'ADMIN' ? (
                // Admin specific navigation
                <>
                  <button onClick={() => navigate('/admin/dashboard')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                </>
              ) : userRole === 'NGO' ? (
                // NGO specific navigation
                <>
                  <button onClick={() => navigate('/ngo/available-donations')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Available Donations
                  </button>
                  <button onClick={() => navigate('/ngo/my-donations')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    My Donations
                  </button>
                  <button onClick={() => navigate('/ngo/my-fundraisers')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Fundraisers
                  </button>
                </>
              ) : userRole === 'DONOR' ? (
                // Donor specific navigation
                <>
                  <button onClick={() => navigate('/donor/browse-ngos')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Browse NGOs
                  </button>
                  <button onClick={() => navigate('/donor/create-donation')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Create Donation
                  </button>
                  <button onClick={() => navigate('/donor/donations')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    My Donations
                  </button>
                  <button onClick={() => navigate('/fundraisers')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Fundraisers
                  </button>
                </>
              ) : userRole === 'DRIVER' ? (
                // Driver specific navigation
                <>
                  <button onClick={() => navigate('/driver/available-pickups')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Available Pickups
                  </button>
                  <button onClick={() => navigate('/driver/my-deliveries')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    My Deliveries
                  </button>
                  <button onClick={() => navigate('/driver/dashboard')} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Dashboard
                  </button>
                </>
              ) : (
                // Default navigation for non-logged in users - Donor-like experience
                <>
                  <button onClick={scrollToFundraisers} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Fundraisers
                  </button>
                  <button onClick={scrollToNgos} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    NGOs
                  </button>
                  <button onClick={scrollToContact} className="px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-all font-medium text-sm">
                    Contact Us
                  </button>
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button - Show for all */}
              <button 
                onClick={() => isAuthenticated ? setSearchOpen(!searchOpen) : navigate('/auth/login')}
                className="hidden sm:flex w-9 h-9 items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all"
                title="Search"
              >
                <Search className="w-4 h-4 text-white" />
              </button>

              {/* When logged in - show user info and actions */}
              {isAuthenticated ? (
                <>
                  {/* Welcome Text */}
                  <div className="hidden md:block text-white text-sm font-medium px-2">
                    Welcome, {userRole === 'ADMIN' ? 'Admin' : userName || 'user'}!
                  </div>

                  {/* Complete Profile Alert Button */}
                  {showProfileBanner && userRole !== 'ADMIN' && (
                    <button
                      onClick={handleCompleteProfile}
                      className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition-all font-bold text-sm animate-pulse"
                      title="Complete your profile"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Complete Profile</span>
                    </button>
                  )}

                  {/* Profile/Dashboard Button */}
                  <button
                    onClick={() => {
                      if (showProfileBanner && userRole !== 'ADMIN') {
                        alert('Please complete your profile first!');
                        return;
                      }
                      const role = localStorage.getItem('userRole');
                      if (role === 'ADMIN') {
                        navigate('/admin/dashboard');
                      } else if (role === 'DONOR') {
                        navigate('/donor/dashboard');
                      } else if (role === 'NGO') {
                        navigate('/ngo/dashboard');
                      } else if (role === 'DRIVER') {
                        navigate('/driver/dashboard');
                      }
                    }}
                    className="flex w-9 h-9 items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all overflow-hidden"
                    title="Dashboard"
                  >
                    {userRole === 'ADMIN' ? (
                      <Shield className="w-5 h-5 text-white" />
                    ) : userLogo ? (
                      <img src={userLogo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-1 px-4 py-1.5 bg-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-bold text-sm ${
                      userRole === 'ADMIN' ? 'text-indigo-600' : userRole === 'NGO' ? 'text-blue-600' : userRole === 'DRIVER' ? 'text-green-600' : 'text-pink-600'
                    }`}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                /* When not logged in - show login button */
                <button
                  onClick={() => navigate('/auth/login')}
                  className="flex items-center space-x-1 px-5 py-2 bg-white text-pink-600 rounded-full hover:shadow-lg hover:scale-105 transition-all font-bold text-sm"
                >
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          {searchOpen && isAuthenticated && (
            <div className="py-3 border-t border-white/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for NGOs, campaigns, or causes..."
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/95 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-white/20">
              <div className="flex flex-col space-y-1">
                <button onClick={() => { scrollToTop(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Home</span>
                </button>
                
                {userRole === 'ADMIN' ? (
                  // Admin specific mobile menu
                  <>
                    <button onClick={() => { navigate('/admin/dashboard'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  </>
                ) : userRole === 'NGO' ? (
                  // NGO specific mobile menu
                  <>
                    <button onClick={() => { navigate('/ngo/available-donations'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Available Donations</span>
                    </button>
                    <button onClick={() => { navigate('/ngo/my-donations'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>My Donations</span>
                    </button>
                  </>
                ) : userRole === 'DONOR' ? (
                  // Donor specific mobile menu
                  <>
                    <button onClick={() => { navigate('/donor/browse-ngos'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Browse NGOs</span>
                    </button>
                    <button onClick={() => { navigate('/donor/create-donation'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Create Donation</span>
                    </button>
                    <button onClick={() => { navigate('/donor/donations'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>My Donations</span>
                    </button>
                    <button onClick={() => { navigate('/fundraisers'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Fundraisers</span>
                    </button>
                  </>
                ) : userRole === 'DRIVER' ? (
                  // Driver specific mobile menu
                  <>
                    <button onClick={() => { navigate('/driver/available-pickups'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Available Pickups</span>
                    </button>
                    <button onClick={() => { navigate('/driver/my-deliveries'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>My Deliveries</span>
                    </button>
                    <button onClick={() => { navigate('/driver/dashboard'); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                  </>
                ) : (
                  // Default mobile menu
                  <>
                    <button onClick={() => { scrollToFundraisers(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Campaigns</span>
                    </button>
                    <button onClick={() => { scrollToNgos(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>NGOs</span>
                    </button>
                    <button onClick={() => { scrollToContact(); setMobileMenuOpen(false); }} className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Contact Us</span>
                    </button>
                  </>
                )}
                
                {isAuthenticated && (
                  <>
                    {showProfileBanner && userRole !== 'ADMIN' && (
                      <button
                        onClick={() => { handleCompleteProfile(); setMobileMenuOpen(false); }}
                        className="mx-2 px-4 py-2.5 bg-yellow-400 text-gray-900 rounded-lg font-bold flex items-center justify-center space-x-2 animate-pulse"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Complete Profile</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (showProfileBanner && userRole !== 'ADMIN') {
                          alert('Please complete your profile first!');
                          setMobileMenuOpen(false);
                          return;
                        }
                        const role = localStorage.getItem('userRole');
                        if (role === 'ADMIN') {
                          navigate('/admin/dashboard');
                        } else if (role === 'DONOR') {
                          navigate('/donor/dashboard');
                        } else if (role === 'NGO') {
                          navigate('/ngo/dashboard');
                        } else if (role === 'DRIVER') {
                          navigate('/driver/dashboard');
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2.5 text-white hover:bg-white/20 rounded-lg transition-all text-left font-medium flex items-center space-x-2"
                    >
                      {userRole === 'ADMIN' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      <span>Dashboard</span>
                    </button>
                  </>
                )}
                
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className={`mx-2 mt-2 px-4 py-2.5 bg-white rounded-full font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 ${
                      userRole === 'NGO' ? 'text-blue-600' : userRole === 'DRIVER' ? 'text-green-600' : 'text-pink-600'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate('/auth/login'); setMobileMenuOpen(false); }}
                    className="mx-2 mt-2 px-4 py-2.5 bg-white text-pink-600 rounded-full font-bold hover:shadow-lg transition-all text-center"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Completion Banner */}
      {showProfileBanner && isAuthenticated && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Complete Your Profile</h3>
                  <p className="text-white/90 text-sm">Please complete your profile to access all features and start making a difference!</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCompleteProfile}
                  className="px-6 py-2.5 bg-white text-orange-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-bold flex items-center space-x-2"
                >
                  <span>Complete Profile Now</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Carousel Block */}
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-12">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background with overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center px-8 md:px-16">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-6">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => handleProtectedNavigation('/donor/browse-ngos')}
                    className="px-8 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 font-semibold text-base"
                  >
                    Donate now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 mb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to make a lasting impact</p>
          </div>

          <div className="relative">
            {/* Connecting Line - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-blue-300 via-green-300 to-purple-300 z-0" style={{ width: '75%', left: '12.5%' }}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="text-center group relative">
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Search className="h-12 w-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Arrow for desktop - positioned absolutely relative to parent */}
                <div className="hidden md:block absolute top-12 -right-4 transform -translate-y-1/2 translate-x-1/2 z-10">
                  <ChevronRight className="h-6 w-6 text-gray-300" />
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border-t-4 border-pink-500">
                  <h3 className="text-lg font-bold text-pink-700 mb-2">Choose a Cause</h3>
                  <p className="text-gray-600 text-sm">Browse verified NGOs and select a cause close to your heart</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group relative">
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Heart className="h-12 w-12 text-white" fill="currentColor" strokeWidth={2} />
                  </div>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-12 -right-4 transform -translate-y-1/2 translate-x-1/2 z-10">
                  <ChevronRight className="h-6 w-6 text-gray-300" />
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border-t-4 border-blue-500">
                  <h3 className="text-lg font-bold text-blue-700 mb-2">Make Your Donation</h3>
                  <p className="text-gray-600 text-sm">Donate securely with multiple payment options available</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group relative">
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Eye className="h-12 w-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-12 -right-4 transform -translate-y-1/2 translate-x-1/2 z-10">
                  <ChevronRight className="h-6 w-6 text-gray-300" />
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border-t-4 border-green-500">
                  <h3 className="text-lg font-bold text-green-700 mb-2">Track Impact</h3>
                  <p className="text-gray-600 text-sm">Get real-time updates on how your donation is making a difference</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Award className="h-12 w-12 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md border-t-4 border-purple-500">
                  <h3 className="text-lg font-bold text-purple-700 mb-2">Get Tax Benefits</h3>
                  <p className="text-gray-600 text-sm">Receive 80G certificates and regular impact reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose KindConnect Section */}
        <div className="mt-20 mb-16 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Choose KindConnect?</h2>
            <p className="text-gray-600 text-lg">Your trusted partner in making a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Donation */}
             <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 flex items-center justify-center mb-4 mx-auto">
                <img src={verifiedNgoIcon} alt="Verified NGOs" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{totalNgos > 0 ? `${totalNgos}+ Verified NGOs` : '100% Verified NGOs'}</h3>
              <p className="text-gray-600 text-sm">All partner NGOs are thoroughly verified and certified</p>
            </div>

            {/* Feature 2 - Tax Benefits */}
           <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 flex items-center justify-center mb-4 mx-auto">
                <img src={trackdonationIcon} alt="Secure Donations" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Donations</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment gateway for all your contributions</p>
            </div>

            {/* Feature 3 - Physical Donations */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 flex items-center justify-center mb-4 mx-auto">
                <img src={physicalDonationIcon} alt="Physical Donations" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Physical Donations</h3>
              <p className="text-gray-600 text-sm">Our driver network picks up your in-kind donations</p>
            </div>

            {/* Feature 4 - Verified NGOs */}

             <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-32 h-32 flex items-center justify-center mb-4 mx-auto">
                <img src={taxBenefitIcon} alt="Tax Benefits" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Tax Benefits</h3>
              <p className="text-gray-600 text-sm">Get 80G certificates instantly for tax deductions</p>
            </div>
          </div>
        </div>
           

        {/* Featured Campaigns Section */}
        <div id="featured-campaigns" className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Campaigns</h2>
            <p className="text-gray-600 text-lg">Support these urgent causes and make an immediate impact</p>
          </div>

          {loadingFundraisers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
            </div>
          ) : fundraisers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fundraisers.map((fundraiser, index) => (
                <div 
                  key={fundraiser.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/fundraiser/${fundraiser.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${fundraiser.imageUrl || fallbackImages[index % fallbackImages.length]})`,
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
                        fundraiser.urgencyLevel === 'CRITICAL' ? 'bg-red-500' :
                        fundraiser.urgencyLevel === 'HIGH' ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}>
                        {fundraiser.urgencyLevel === 'CRITICAL' ? '🔥 Urgent' :
                         fundraiser.urgencyLevel === 'HIGH' ? 'High Priority' :
                         'Verified'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{fundraiser.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{fundraiser.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      {(() => {
                        const raised = fundraiser.currentAmount || 0;
                        const goal = fundraiser.targetAmount || 1;
                        const percentage = Math.min(Math.round((raised / goal) * 100), 100);
                        return (
                          <>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">₹{raised.toLocaleString()} raised</span>
                              <span className="font-semibold text-pink-600">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </>
                        );
                      })()}
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{((fundraiser.targetAmount || 0) - (fundraiser.currentAmount || 0)).toLocaleString()} to go
                      </p>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProtectedNavigation(`/fundraiser/${fundraiser.id}`);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback to static content if no fundraisers
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Campaign 1 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${feedImage})`,
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Urgent
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Feed 500 Children Daily</h3>
                  <p className="text-gray-600 text-sm mb-4">Help provide nutritious meals to underprivileged children</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">₹4,50,000 raised</span>
                      <span className="font-semibold text-pink-600">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">₹50,000 to go</p>
                  </div>
                  <button 
                    onClick={() => handleProtectedNavigation('/fundraisers')}
                    className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-semibold"
                  >
                    Donate Now
                  </button>
                </div>
              </div>

              {/* Campaign 2 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${elderImage})`,
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Elder Care Support</h3>
                  <p className="text-gray-600 text-sm mb-4">Provide shelter and medical care for abandoned elders</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">₹2,80,000 raised</span>
                      <span className="font-semibold text-blue-600">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">₹1,20,000 to go</p>
                  </div>
                  <button 
                    onClick={() => handleProtectedNavigation('/fundraisers')}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                  >
                    Donate Now
                  </button>
                </div>
              </div>

              {/* Campaign 3 */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${educationImage})`,
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Tax Benefit
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Education for 100 Kids</h3>
                  <p className="text-gray-600 text-sm mb-4">Sponsor education for blind and disabled children</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">₹1,80,000 raised</span>
                      <span className="font-semibold text-green-600">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">₹1,20,000 to go</p>
                  </div>
                  <button 
                    onClick={() => handleProtectedNavigation('/fundraisers')}
                    className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <button 
              onClick={() => handleProtectedNavigation('/fundraisers')}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
            >
              View All Campaigns
            </button>
          </div>
        </div>

        {/* Our Trusted NGO Partners Section */}
        <div id="trusted-partners" className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Our Trusted NGO Partners</h2>
            <p className="text-gray-600 text-lg">Verified organizations making a real difference in communities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* NGO Partner Cards */}
            {ngoPartners.length > 0 ? (
              ngoPartners.map((ngo, index) => {
                const colors = [
                  'from-blue-100 to-blue-200',
                  'from-green-100 to-green-200',
                  'from-cyan-100 to-cyan-200',
                  'from-red-100 to-red-200',
                  'from-orange-100 to-orange-200',
                  'from-indigo-100 to-indigo-200',
                ];
                return (
                  <div 
                    key={ngo.id || index} 
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" 
                    onClick={() => handleProtectedNavigation('/donor/browse-ngos')}
                    onKeyDown={(e) => e.key === 'Enter' && handleProtectedNavigation('/donor/browse-ngos')}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={`w-full h-24 bg-gradient-to-br ${colors[index % colors.length]} rounded-lg mb-4 flex items-center justify-center overflow-hidden`}>
                      {ngo.logo ? (
                        <img src={ngo.logo} alt={ngo.ngoName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="h-10 w-10 text-gray-700" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2">{ngo.ngoName}</p>
                  </div>
                );
              })
            ) : (
              // Placeholder cards when no NGOs loaded
              [1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center animate-pulse">
                    <Building2 className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              What our partners say about <span className="text-pink-500">KindConnect</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <p className="text-gray-700 mb-8 leading-relaxed">
                KindConnect makes generosity effortless with its user-friendly platform, offering a wide range of trusted NGOs and causes to support. Whether you prefer monthly contributions for sustained impact or a one-time donation, the choice is yours. Plus, transparent usage reports ensure you know exactly how your kindness transforms lives.
              </p>
              <div className="flex items-center mt-auto">
                <img 
                  src={donor1Image} 
                  alt="Sir Ratan Tata" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-md flex-shrink-0"
                />
                <div className="ml-5">
                  <p className="font-bold text-gray-900 text-base">Sir Ratan Tata</p>
                  <p className="text-sm text-gray-600 mt-1">Believes in trustworthy and impactful giving</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <p className="text-gray-700 mb-8 leading-relaxed">
                What truly resonated with me about KindConnect was the platform's trustworthiness and the assurance that my donation would be used effectively. The transparency of information about the NGOs, the ease of use, and the excellent customer support all contributed to a positive giving experience.
              </p>
              <div className="flex items-center mt-auto">
                <img 
                  src={donor2Image} 
                  alt="Azim Premji" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-purple-100 shadow-md flex-shrink-0"
                />
                <div className="ml-5">
                  <p className="font-bold text-gray-900 text-base">Azim Premji</p>
                  <p className="text-sm text-gray-600 mt-1">Joined the mission to turn compassion into action</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
              <p className="text-gray-700 mb-8 leading-relaxed">
                What truly sets KindConnect apart is the platform's commitment to transparency. The comprehensive information provided about each NGO, combined with the ease of navigation and secure payment options, instilled a deep sense of trust. Knowing that I am contributing to a meaningful cause further solidified my confidence in the platform.
              </p>
              <div className="flex items-center mt-auto">
                <img 
                  src={donor3Image} 
                  alt="Rohini Nilekani" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-pink-100 shadow-md flex-shrink-0"
                />
                <div className="ml-5">
                  <p className="font-bold text-gray-900 text-base">Rohini Nilekani</p>
                  <p className="text-sm text-gray-600 mt-1">Arghyam Foundation since 2020</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section - Only show when not logged in */}
        {!isAuthenticated && (
          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-12 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-lg font-semibold inline-flex items-center"
            >
              Get Started <ChevronRight className="ml-2" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer id="contact-section" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                <h3 className="text-2xl font-bold">KindConnect</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Bridging the gap between generous donors and impactful NGOs. Together, we create lasting change and empower communities across the nation.
              </p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-pink-400">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={scrollToTop} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/about')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/ngos')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Browse NGOs
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/campaigns')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Active Campaigns
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/how-it-works')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* For NGOs */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-pink-400">For NGOs</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleProtectedNavigation('/ngo-registration')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Register Your NGO
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/ngo-guidelines')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Guidelines
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/verification')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Verification Process
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/ngo-resources')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Resources
                  </button>
                </li>
                <li>
                  <button onClick={() => handleProtectedNavigation('/success-stories')} className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                    Success Stories
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-pink-400">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">
                    123 Silverstone Archade , Surat ,<br />Gujarat 395004, India
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">support@kindconnect.org</span>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-xs text-gray-400 mb-2">Subscribe to our newsletter</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-r-lg transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                &copy; 2026 KindConnect. All rights reserved. Empowering Change, Making a Difference.
              </p>
              <div className="flex space-x-6 text-sm">
                <button onClick={() => handleProtectedNavigation('/privacy')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => handleProtectedNavigation('/terms')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Terms of Service
                </button>
                <button onClick={() => handleProtectedNavigation('/refund')} className="text-gray-400 hover:text-pink-400 transition-colors">
                  Refund Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
