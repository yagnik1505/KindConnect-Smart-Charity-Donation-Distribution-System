import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Phone, MapPin, Camera, Save, Award, TrendingUp, Package, FileText, X, CheckCircle, CreditCard, Wallet, Building } from 'lucide-react';
import { createNgoProfile, getNgoProfile, updateNgoProfile } from '../services/profileService';
import Navbar from '../components/Navbar';

export default function NgoProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [logoSaved, setLogoSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    ngoName: '',
    contactperson: '',
    phone: '',
    address: '',
    city: '',
    logo: '',
    upiId: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: ''
  });

  // Statistics from API (currently showing zeros until backend provides stats endpoint)
  const [stats] = useState({
    totalDonationsReceived: 0,
    activeDonations: 0,
    livesImpacted: 0
  });

  useEffect(() => {
    fetchProfile();
    // Load saved logo from localStorage
    const savedLogo = localStorage.getItem('ngoLogo');
    if (savedLogo) {
      setProfilePhoto(savedLogo);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getNgoProfile();
      if (response.data) {
        // Ensure all fields have default values to prevent uncontrolled input warning
        setFormData({
          ngoName: response.data.ngoName || '',
          contactperson: response.data.contactperson || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
          logo: response.data.logo || '',
          upiId: response.data.upiId || '',
          bankAccountNumber: response.data.bankAccountNumber || '',
          ifscCode: response.data.ifscCode || '',
          bankName: response.data.bankName || ''
        });
        setProfileExists(true);
        setIsEditing(false);
        // Load logo from response if available
        if (response.data.logo) {
          setProfilePhoto(response.data.logo);
          localStorage.setItem('ngoLogo', response.data.logo);
        }
      }
    } catch (err) {
      setIsEditing(true);
      setProfileExists(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB for localStorage)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePhoto(base64Image);
        // Save to localStorage immediately
        localStorage.setItem('ngoLogo', base64Image);
        
        // Update ngoProfile in localStorage with logo
        const existingProfile = JSON.parse(localStorage.getItem('ngoProfile') || '{}');
        existingProfile.logo = base64Image;
        localStorage.setItem('ngoProfile', JSON.stringify(existingProfile));
        
        setLogoSaved(true);
        setTimeout(() => setLogoSaved(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setProfilePhoto(null);
    localStorage.removeItem('ngoLogo');
    const existingProfile = JSON.parse(localStorage.getItem('ngoProfile') || '{}');
    delete existingProfile.logo;
    localStorage.setItem('ngoProfile', JSON.stringify(existingProfile));
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
        response = await updateNgoProfile(dataToSend);
        setSuccess('Profile updated successfully!');
      } else {
        response = await createNgoProfile(dataToSend);
        setSuccess('Profile created successfully! Redirecting to dashboard...');
        localStorage.setItem('profileCompleted', 'true');
        
        setTimeout(() => {
          navigate('/ngo/dashboard');
        }, 1500);
      }
      
      // Save profile with logo to localStorage
      const profileToSave = response.data || dataToSend;
      if (profilePhoto) {
        localStorage.setItem('ngoLogo', profilePhoto);
      }
      localStorage.setItem('ngoProfile', JSON.stringify(profileToSave));
      setFormData(prev => ({ ...prev, logo: profilePhoto || formData.logo }));
      setProfileExists(true);
      setIsEditing(false);
      
      // Trigger a storage event for other components to update
      globalThis.dispatchEvent(new Event('storage'));
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-r-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="NGO Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="h-16 w-16 text-white" />
                    )}
                  </div>
                  
                  {/* Upload/Change Button */}
                  <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2.5 cursor-pointer hover:bg-blue-600 shadow-lg transition-all hover:scale-110">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  
                  {/* Remove Button */}
                  {profilePhoto && (
                    <button 
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 cursor-pointer hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                  
                  {/* Logo Saved Indicator */}
                  {logoSaved && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle size={12} />
                      Logo Saved!
                    </div>
                  )}
                </div>
                
                <h2 className="mt-6 text-2xl font-bold text-gray-800 text-center">{formData.ngoName || 'NGO Name'}</h2>
                <p className="text-gray-500 text-sm">{formData.city || 'Location'}</p>
                
                {/* Logo Upload Hint */}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Click camera icon to upload logo (max 2MB)
                </p>
                
                {profileExists && (
                  <div className="mt-4 flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-semibold text-blue-600">Verified NGO</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Donations Received</p>
                      <p className="text-lg font-bold text-gray-800">{stats.totalDonationsReceived}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
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
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all"
                  >
                    Edit Profile
                  </button>
                )}
                {profileExists && (
                  <button
                    onClick={() => navigate('/ngo/dashboard')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                  >
                    Back to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {(() => {
                    if (!isEditing) return 'NGO Information';
                    return profileExists ? 'Edit NGO Profile' : 'Create NGO Profile';
                  })()}
                </h3>
                {!isEditing && profileExists && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    <Save className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* NGO Name */}
                  <div>
                    <label htmlFor="ngoName" className="block text-sm font-semibold text-gray-700 mb-2">
                      NGO Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="ngoName"
                        name="ngoName"
                        required
                        value={formData.ngoName}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter NGO name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Person */}
                    <div>
                      <label htmlFor="contactperson" className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="contactperson"
                          name="contactperson"
                          required
                          value={formData.contactperson}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contact person name"
                        />
                      </div>
                    </div>

                    {/* Phone */}
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
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  {/* Address */}
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
                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>

                  {/* Payment Information Section */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-green-600" />
                      Payment Information (Optional)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add your payment details to receive direct donations from supporters
                    </p>

                    {/* UPI ID */}
                    <div className="mb-6">
                      <label htmlFor="upiId" className="block text-sm font-semibold text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Wallet className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          value={formData.upiId || ''}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="yourname@paytm / yourname@upi"
                        />
                      </div>
                    </div>

                    {/* Bank Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bank Account Number */}
                      <div>
                        <label htmlFor="bankAccountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                          Bank Account Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber || ''}
                            onChange={handleChange}
                            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234567890"
                          />
                        </div>
                      </div>

                      {/* IFSC Code */}
                      <div>
                        <label htmlFor="ifscCode" className="block text-sm font-semibold text-gray-700 mb-2">
                          IFSC Code
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="ifscCode"
                            name="ifscCode"
                            value={formData.ifscCode || ''}
                            onChange={handleChange}
                            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="SBIN0001234"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bank Name */}
                    <div className="mt-6">
                      <label htmlFor="bankName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="bankName"
                          name="bankName"
                          value={formData.bankName || ''}
                          onChange={handleChange}
                          className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State Bank of India"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 font-medium transition-all"
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
                      <span className="text-sm font-medium text-gray-500">NGO Name</span>
                      <p className="mt-1 text-lg text-gray-900">{formData.ngoName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact Person</span>
                      <p className="mt-1 text-lg text-gray-900">{formData.contactperson}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone Number</span>
                      <p className="mt-1 text-lg text-gray-900">{formData.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">City</span>
                      <p className="mt-1 text-lg text-gray-900">{formData.city}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Address</span>
                      <p className="mt-1 text-lg text-gray-900">{formData.address}</p>
                    </div>
                  </div>

                  {/* Payment Information Display */}
                  {(formData.upiId || formData.bankAccountNumber || formData.ifscCode || formData.bankName) && (
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.upiId && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">UPI ID</span>
                            <p className="mt-1 text-lg text-gray-900 font-mono">{formData.upiId}</p>
                          </div>
                        )}
                        {formData.bankAccountNumber && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Bank Account Number</span>
                            <p className="mt-1 text-lg text-gray-900 font-mono">{formData.bankAccountNumber}</p>
                          </div>
                        )}
                        {formData.ifscCode && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">IFSC Code</span>
                            <p className="mt-1 text-lg text-gray-900 font-mono">{formData.ifscCode}</p>
                          </div>
                        )}
                        {formData.bankName && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Bank Name</span>
                            <p className="mt-1 text-lg text-gray-900">{formData.bankName}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      <span className="font-semibold">Profile Complete!</span> Your NGO is now ready to receive donations.
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
