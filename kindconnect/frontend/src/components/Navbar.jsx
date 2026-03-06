import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogOut, Menu, X, Home, Package, PlusCircle, List, User, Bell, Target, Building2, Shield, Truck } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ngoLogo, setNgoLogo] = useState(null);
  const [donorLogo, setDonorLogo] = useState(null);
  const [driverLogo, setDriverLogo] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  
  // Update user info from localStorage on mount and location change
  useEffect(() => {
    const updateUserInfo = () => {
      const role = localStorage.getItem('userRole') || '';
      const token = localStorage.getItem('authToken');
      const profile = localStorage.getItem('profileCompleted') === 'true';
      
      console.log('[Navbar] User Role:', role); // Debug log
      setUserRole(role);
      setIsAuthenticated(token !== null);
      setProfileCompleted(profile);
    };
    
    updateUserInfo();
    
    // Listen for storage changes
    globalThis.addEventListener('storage', updateUserInfo);
    return () => globalThis.removeEventListener('storage', updateUserInfo);
  }, [location.pathname]); // Re-check on route change
  
  // Load logos on mount and listen for changes
  useEffect(() => {
    if (userRole === 'NGO') {
      const savedLogo = localStorage.getItem('ngoLogo');
      if (savedLogo) {
        setNgoLogo(savedLogo);
      } else {
        // Try to get from ngoProfile
        try {
          const profile = JSON.parse(localStorage.getItem('ngoProfile') || '{}');
          if (profile.logo) {
            setNgoLogo(profile.logo);
          }
        } catch {}
      }
    } else if (userRole === 'DONOR') {
      const savedLogo = localStorage.getItem('donorLogo');
      if (savedLogo) {
        setDonorLogo(savedLogo);
      }
    } else if (userRole === 'DRIVER') {
      const savedLogo = localStorage.getItem('driverLogo');
      if (savedLogo) {
        setDriverLogo(savedLogo);
      } else {
        // Try to get from driverProfile
        try {
          const profile = JSON.parse(localStorage.getItem('driverProfile') || '{}');
          if (profile.photo) {
            setDriverLogo(profile.photo);
          }
        } catch {}
      }
    }
    
    // Listen for storage changes
    const handleStorageChange = () => {
      if (userRole === 'NGO') {
        const savedLogo = localStorage.getItem('ngoLogo');
        setNgoLogo(savedLogo);
      } else if (userRole === 'DONOR') {
        const savedLogo = localStorage.getItem('donorLogo');
        setDonorLogo(savedLogo);
      } else if (userRole === 'DRIVER') {
        const savedLogo = localStorage.getItem('driverLogo');
        setDriverLogo(savedLogo);
      }
    };
    
    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, [userRole]);
  
  // Get username from cached profile
  const getUserName = () => {
    try {
      if (userRole === 'ADMIN') {
        return 'Admin';
      } else if (userRole === 'DONOR') {
        const profile = JSON.parse(localStorage.getItem('donorProfile') || '{}');
        return profile.name || 'Donor';
      } else if (userRole === 'NGO') {
        const profile = JSON.parse(localStorage.getItem('ngoProfile') || '{}');
        return profile.ngoName || 'NGO';
      } else if (userRole === 'DRIVER') {
        const profile = JSON.parse(localStorage.getItem('driverProfile') || '{}');
        return profile.name || 'Driver';
      }
    } catch {
      return userRole?.toLowerCase() || 'User';
    }
    return 'User';
  };

  const userName = getUserName();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileCompleted');
    localStorage.removeItem('donorProfile');
    localStorage.removeItem('ngoProfile');
    localStorage.removeItem('driverProfile');
    navigate('/');
    globalThis.location.reload();
  };

  // Check if current path matches
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Navigation config based on role
  const getNavLinks = () => {
    if (userRole === 'ADMIN') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/admin/dashboard', label: 'NGO Management', icon: Building2 },
        { path: '/admin/drivers', label: 'Driver Management', icon: Truck },
      ];
    } else if (userRole === 'NGO') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/ngo/available-donations', label: 'Available Donations', icon: Package },
        { path: '/ngo/my-donations', label: 'My Donations', icon: List },
        { path: '/ngo/my-fundraisers', label: 'Fundraisers', icon: Target },
      ];
    } else if (userRole === 'DONOR') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/donor/browse-ngos', label: 'Browse NGOs', icon: Building2 },
        { path: '/donor/create-donation', label: 'Create Donation', icon: PlusCircle },
        { path: '/donor/donations', label: 'My Donations', icon: List },
        { path: '/fundraisers', label: 'Fundraisers', icon: Target },
      ];
    } else if (userRole === 'DRIVER') {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/driver/available-pickups', label: 'Available Pickups', icon: Package },
        { path: '/driver/my-deliveries', label: 'My Deliveries', icon: List },
        { path: '/driver/dashboard', label: 'Dashboard', icon: Home },
      ];
    }
    // Default for non-logged in
    return [
      { path: '/', label: 'Home', icon: Home },
      { path: '/fundraisers', label: 'Fundraisers', icon: Target },
      { path: '/campaigns', label: 'Campaigns', icon: Package },
      { path: '/ngos', label: 'NGOs', icon: List },
      { path: '/impact', label: 'Impact', icon: List },
    ];
  };

  const navLinks = getNavLinks();

  // Get colors based on role
  const getColors = () => {
    if (userRole === 'ADMIN') {
      return {
        gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600',
        heartColor: 'text-indigo-600',
        buttonColor: 'text-indigo-600',
        activeClass: 'bg-white/30',
        hoverClass: 'hover:bg-white/20',
      };
    } else if (userRole === 'NGO') {
      return {
        gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
        heartColor: 'text-blue-600',
        buttonColor: 'text-blue-600',
        activeClass: 'bg-white/30',
        hoverClass: 'hover:bg-white/20',
      };
    } else if (userRole === 'DONOR') {
      return {
        gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600',
        heartColor: 'text-pink-500',
        buttonColor: 'text-pink-600',
        activeClass: 'bg-white/30',
        hoverClass: 'hover:bg-white/20',
      };
    } else if (userRole === 'DRIVER') {
      return {
        gradient: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600',
        heartColor: 'text-green-600',
        buttonColor: 'text-green-600',
        activeClass: 'bg-white/30',
        hoverClass: 'hover:bg-white/20',
      };
    }
    // Default
    return {
      gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600',
      heartColor: 'text-pink-500',
      buttonColor: 'text-pink-600',
      activeClass: 'bg-white/30',
      hoverClass: 'hover:bg-white/20',
    };
  };

  const colors = getColors();

  // Handle dashboard navigation
  const handleDashboardClick = () => {
    if (userRole === 'ADMIN') {
      navigate('/admin/dashboard');
      return;
    }
    if (!profileCompleted) {
      alert('Please complete your profile first!');
      return;
    }
    if (userRole === 'DONOR') {
      navigate('/donor/dashboard');
    } else if (userRole === 'NGO') {
      navigate('/ngo/dashboard');
    } else if (userRole === 'DRIVER') {
      navigate('/driver/dashboard');
    }
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    if (userRole === 'DONOR') {
      navigate('/profile/donor');
    } else if (userRole === 'NGO') {
      navigate('/profile/ngo');
    } else if (userRole === 'DRIVER') {
      navigate('/profile/driver');
    }
  };

  return (
    <nav className={`${colors.gradient} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            className="flex items-center space-x-3 cursor-pointer group bg-transparent border-none" 
            onClick={() => navigate('/')}
            type="button"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className={`h-6 w-6 ${colors.heartColor}`} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">KindConnect</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all ${
                  isActive(link.path) 
                    ? `${colors.activeClass} shadow-inner` 
                    : colors.hoverClass
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Welcome Text */}
                <span className="hidden lg:block text-white text-sm font-medium">
                  Welcome, {userName}!
                </span>

                {/* Complete Profile Alert */}
                {!profileCompleted && userRole !== 'ADMIN' && (
                  <button
                    onClick={handleProfileClick}
                    className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition-all font-bold text-xs animate-pulse"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Complete Profile</span>
                  </button>
                )}

                {/* Dashboard Button for Admin */}
                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/admin/dashboard')
                        ? 'bg-white/30 shadow-inner text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}

                {/* Dashboard Button - Show logo for NGO/Donor/Driver (not admin) */}
                {userRole !== 'ADMIN' && (
                  <button
                    onClick={handleDashboardClick}
                    className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all overflow-hidden"
                    title="Dashboard"
                    type="button"
                  >
                    {(() => {
                      if (userRole === 'NGO' && ngoLogo) {
                        return <img src={ngoLogo} alt="NGO" className="w-full h-full object-cover" />;
                      }
                      if (userRole === 'DONOR' && donorLogo) {
                        return <img src={donorLogo} alt="Donor" className="w-full h-full object-cover" />;
                      }
                      if (userRole === 'DRIVER' && driverLogo) {
                        return <img src={driverLogo} alt="Driver" className="w-full h-full object-cover" />;
                      }
                      return <User className="w-4 h-4 text-white" />;
                    })()}
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 px-4 py-1.5 bg-white ${colors.buttonColor} rounded-full hover:shadow-lg hover:scale-105 transition-all font-bold text-sm`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
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
              className="md:hidden w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/20">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-white font-medium text-left flex items-center space-x-2 transition-all ${
                      isActive(link.path) 
                        ? `${colors.activeClass}` 
                        : colors.hoverClass
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              
              {isAuthenticated && !profileCompleted && userRole !== 'ADMIN' && (
                <button
                  onClick={() => {
                    handleProfileClick();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 mt-2 px-4 py-2.5 bg-yellow-400 text-gray-900 rounded-lg font-bold flex items-center justify-center space-x-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Complete Profile</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
