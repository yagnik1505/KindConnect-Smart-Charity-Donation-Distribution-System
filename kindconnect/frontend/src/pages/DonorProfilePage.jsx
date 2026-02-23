import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Building, Camera, Save, Award, TrendingUp, Gift, X, Upload, CheckCircle } from 'lucide-react';
import { createDonorProfile, getDonorProfile, updateDonorProfile } from '../services/profileService';
import { getImpactStats } from '../services/fundraiserService';
import Navbar from '../components/Navbar';

export default function DonorProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [logoSaved, setLogoSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    logo: ''
  });

  // Statistics from API
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    livesImpacted: 0,
    activeCampaigns: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchImpactStats();
  }, []);

  const fetchImpactStats = async () => {
    try {
      const data = await getImpactStats();
      setStats({
        totalDonations: data.totalDonations || 0,
        totalAmount: data.totalAmountDonated || 0,
        livesImpacted: data.fundraisersSupported || 0,
        activeCampaigns: data.badges?.filter(b => b.progress >= b.target).length || 0
      });
    } catch (error) {
      // Silently fail - keep showing zeros if API fails
      console.log('Could not load impact stats');
    }
  };

  const fetchProfile = async () => {
    // Load saved logo from localStorage
    const savedLogo = localStorage.getItem('donorLogo');
    if (savedLogo) {
      setProfilePhoto(savedLogo);
      setLogoSaved(true);
    }
    
    try {
      const response = await getDonorProfile();
      if (response.data) {
        setFormData(response.data);
        setProfileExists(true);
        setIsEditing(false);
        // Load logo from response if available
        if (response.data.logo) {
          setProfilePhoto(response.data.logo);
          localStorage.setItem('donorLogo', response.data.logo);
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
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePhoto(base64Image);
        // Save to localStorage immediately
        localStorage.setItem('donorLogo', base64Image);
        setLogoSaved(true);
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setProfilePhoto(null);
    localStorage.removeItem('donorLogo');
    setLogoSaved(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      
      let response;
      if (profileExists) {
        response = await updateDonorProfile(dataToSend);
        setSuccess('Profile updated successfully!');
      } else {
        response = await createDonorProfile(dataToSend);
        setSuccess('Profile created successfully! Redirecting to dashboard...');
        localStorage.setItem('profileCompleted', 'true');
        
        // Redirect to dashboard after creating profile
        setTimeout(() => {
          navigate('/donor/dashboard');
        }, 1500);
      }
      
      localStorage.setItem('donorProfile', JSON.stringify(response.data || dataToSend));
      // Also save logo with profile if exists
      if (profilePhoto) {
        localStorage.setItem('donorLogo', profilePhoto);
      }
      setFormData(prev => ({ ...prev, logo: profilePhoto || formData.logo }));
      setProfileExists(true);
      setIsEditing(false);
      
      if (profileExists) {
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-16 w-16 text-white" />
                    )}
                  </div>
                  {/* Remove logo button */}
                  {profilePhoto && (
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute top-0 right-0 bg-red-500 rounded-full p-1.5 cursor-pointer hover:bg-red-600 shadow-lg"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                  <label className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 cursor-pointer hover:bg-pink-600 shadow-lg">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">{formData.name || 'Donor'}</h2>
                <p className="text-gray-500 text-sm">{formData.city || 'Location'}</p>
                {/* Logo saved indicator */}
                {logoSaved && (
                  <div className="mt-2 flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Photo Saved!</span>
                  </div>
                )}
                {!profilePhoto && (
                  <p className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
                    <Upload className="h-3 w-3" />
                    <span>Click camera to add photo</span>
                  </p>
                )}
                {profileExists && (
                  <div className="mt-4 flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 text-pink-500" />
                    <span className="text-sm font-semibold text-pink-600">Verified Donor</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Donations</p>
                      <p className="text-lg font-bold text-gray-800">{stats.totalDonations}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lives Impacted</p>
                      <p className="text-lg font-bold text-gray-800">{stats.livesImpacted}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {!isEditing && profileExists && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
                  >
                    Edit Profile
                  </button>
                )}
                {profileExists && (
                  <button
                    onClick={() => navigate('/donor/dashboard')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Back to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditing ? (profileExists ? 'Edit Profile' : 'Create Profile') : 'Profile Information'}
                </h3>
                {!isEditing && profileExists && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-pink-500 hover:bg-pink-50 rounded-lg font-medium"
                  >
                    <Save className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>

                  {/* City Field */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 font-medium"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Save Profile</span>
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
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
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
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="mt-1 text-lg text-gray-900">{formData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-1 text-lg text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="mt-1 text-lg text-gray-900">{formData.city}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="mt-1 text-lg text-gray-900">{formData.address}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      <span className="font-semibold">Profile Complete!</span> Your information helps us provide personalized donation experiences.
                    </p>
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
