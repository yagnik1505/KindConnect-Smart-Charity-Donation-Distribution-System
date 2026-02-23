import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, Phone, User, Camera, Save, Award, Package, 
  MapPin, FileText, X, CheckCircle, Car, CreditCard,
  Shield, Star, Clock, Navigation
} from 'lucide-react';
import { getDriverProfile } from '../services/profileService';
import { createDriverProfile, updateDriverAvailability } from '../services/driverService';
import Navbar from '../components/Navbar';

export default function DriverProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [logoSaved, setLogoSaved] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    logo: ''
  });

  // Statistics from API (currently showing zeros until backend provides stats endpoint)
  const [stats] = useState({
    totalPickups: 0,
    totalDeliveries: 0,
    rating: 0,
    onTimeRate: 0
  });

  const vehicleTypes = [
    { value: 'BIKE', label: '🏍️ Bike/Scooter', description: 'Small packages' },
    { value: 'AUTO', label: '🛺 Auto Rickshaw', description: 'Medium packages' },
    { value: 'CAR', label: '🚗 Car', description: 'Multiple items' },
    { value: 'VAN', label: '🚐 Van', description: 'Large donations' },
    { value: 'TRUCK', label: '🚚 Mini Truck', description: 'Bulk donations' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // Load saved logo from localStorage
    const savedLogo = localStorage.getItem('driverLogo');
    if (savedLogo) {
      setProfilePhoto(savedLogo);
      setLogoSaved(true);
    }
    
    try {
      const response = await getDriverProfile();
      if (response.data) {
        setFormData(response.data);
        setProfileExists(true);
        setIsEditing(false);
        setIsAvailable(response.data.available ?? true);
        // Load logo from response if available
        if (response.data.logo) {
          setProfilePhoto(response.data.logo);
          localStorage.setItem('driverLogo', response.data.logo);
          setLogoSaved(true);
        }
      }
    } catch (err) {
      // Profile doesn't exist yet, show creation form
      setIsEditing(true);
      setProfileExists(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePhoto(base64Image);
        localStorage.setItem('driverLogo', base64Image);
        setLogoSaved(true);
        globalThis.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setProfilePhoto(null);
    localStorage.removeItem('driverLogo');
    setLogoSaved(false);
    globalThis.dispatchEvent(new Event('storage'));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityToggle = async () => {
    try {
      await updateDriverAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
      setSuccess(`You are now ${!isAvailable ? 'available' : 'unavailable'} for pickups`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Include logo in the data to send
      const dataToSend = {
        ...formData,
        logo: profilePhoto || formData.logo || ''
      };
      
      await createDriverProfile(dataToSend);
      setSuccess('Profile created successfully! Redirecting to dashboard...');
      localStorage.setItem('profileCompleted', 'true');
      localStorage.setItem('driverProfile', JSON.stringify(dataToSend));
      if (profilePhoto) {
        localStorage.setItem('driverLogo', profilePhoto);
      }
      
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 1500);
      
      setProfileExists(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProfileTitle = () => {
    if (!isEditing) return 'Driver Information';
    return profileExists ? 'Edit Driver Profile' : 'Create Driver Profile';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Navigation Bar */}
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Driver Profile</h1>
                <p className="text-white/80 mt-1">Manage your delivery profile and availability</p>
              </div>
            </div>
            {profileExists && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAvailabilityToggle}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    isAvailable 
                      ? 'bg-green-400 text-green-900 hover:bg-green-300' 
                      : 'bg-red-400 text-red-900 hover:bg-red-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-900 animate-pulse' : 'bg-red-900'}`}></div>
                  <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-r-xl flex items-center space-x-3 shadow-lg">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-medium">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-xl shadow-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Photo Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-emerald-100">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl transform transition-transform group-hover:scale-105">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-16 w-16 text-white" />
                    )}
                  </div>
                  
                  {profilePhoto && (
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 cursor-pointer hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                  
                  <label className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-3 cursor-pointer hover:bg-emerald-600 shadow-lg transition-all hover:scale-110">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  
                  {logoSaved && (
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-lg">
                      <CheckCircle size={12} />
                      Photo Saved!
                    </div>
                  )}
                </div>
                
                <h2 className="mt-8 text-2xl font-bold text-gray-800">{formData.name || 'Driver Name'}</h2>
                <p className="text-gray-500 flex items-center space-x-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Partner</span>
                </p>
                
                {profileExists && (
                  <div className="mt-4 flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-2.5 rounded-full border border-emerald-200">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Verified Driver</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-emerald-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Performance Stats</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 text-center">
                  <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">{stats.totalPickups}</p>
                  <p className="text-xs text-emerald-600 font-medium">Total Pickups</p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 text-center">
                  <Navigation className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-teal-700">{stats.totalDeliveries}</p>
                  <p className="text-xs text-teal-600 font-medium">Deliveries</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-700">{stats.rating}</p>
                  <p className="text-xs text-yellow-600 font-medium">Rating</p>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 text-center">
                  <Clock className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-cyan-700">{stats.onTimeRate}%</p>
                  <p className="text-xs text-cyan-600 font-medium">On-Time</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {profileExists && (
              <div className="space-y-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={() => navigate('/driver/dashboard')}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-emerald-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span>{getProfileTitle()}</span>
                </h3>
                {!isEditing && profileExists && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Vehicle Type Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {vehicleTypes.map((vehicle) => (
                        <button
                          key={vehicle.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, vehicleType: vehicle.value })}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.vehicleType === vehicle.value
                              ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{vehicle.label.split(' ')[0]}</span>
                          <p className="font-bold text-gray-800 text-sm">{vehicle.label.split(' ').slice(1).join(' ')}</p>
                          <p className="text-xs text-gray-500">{vehicle.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Number */}
                    <div>
                      <label htmlFor="vehicleNumber" className="block text-sm font-bold text-gray-700 mb-2">
                        Vehicle Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="vehicleNumber"
                          name="vehicleNumber"
                          required
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all uppercase"
                          placeholder="MH 01 AB 1234"
                        />
                      </div>
                    </div>

                    {/* License Number */}
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-bold text-gray-700 mb-2">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          required
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all uppercase"
                          placeholder="DL-1234567890"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-800 mb-1">Verification Process</h4>
                        <p className="text-sm text-emerald-700">
                          Your documents will be verified within 24 hours. Once approved, you can start accepting delivery requests.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !formData.vehicleType}
                      className="flex-1 flex justify-center items-center space-x-2 py-4 px-6 border border-transparent rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating Profile...</span>
                        </>
                      ) : (
                        <>
                          <Truck className="h-6 w-6" />
                          <span>Start Delivering</span>
                        </>
                      )}
                    </button>
                    {profileExists && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile();
                        }}
                        className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* View Mode - Display Profile Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Full Name</span>
                      </span>
                      <p className="mt-2 text-xl font-bold text-gray-900">{formData.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                      </span>
                      <p className="mt-2 text-xl font-bold text-gray-900">{formData.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span>Vehicle Type</span>
                      </span>
                      <p className="mt-2 text-xl font-bold text-gray-900">
                        {vehicleTypes.find(v => v.value === formData.vehicleType)?.label || formData.vehicleType}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <Car className="w-4 h-4" />
                        <span>Vehicle Number</span>
                      </span>
                      <p className="mt-2 text-xl font-bold text-gray-900 uppercase">{formData.vehicleNumber}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                      <span className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>License Number</span>
                      </span>
                      <p className="mt-2 text-xl font-bold text-gray-900 uppercase">{formData.licenseNumber}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center space-x-3">
                      <Award className="w-8 h-8 text-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-800">Profile Verified!</p>
                        <p className="text-sm text-emerald-700">You're ready to start accepting deliveries.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
