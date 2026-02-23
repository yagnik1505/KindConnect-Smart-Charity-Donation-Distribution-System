import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Target, FileText, Image, Video, MapPin, Calendar, 
  AlertTriangle, CheckCircle, Sparkles, Upload, X, Plus,
  DollarSign, Users, Clock, Wallet
} from 'lucide-react';
import { createFundraiser } from '../services/fundraiserService';
import { getNgoProfile } from '../services/profileService';
import Navbar from '../components/Navbar';

const categories = [
  { value: 'EDUCATION', label: 'Education', icon: '📚', color: 'from-blue-400 to-indigo-500' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: '🏥', color: 'from-red-400 to-pink-500' },
  { value: 'FOOD_HUNGER', label: 'Food & Hunger', icon: '🍽️', color: 'from-orange-400 to-red-500' },
  { value: 'DISASTER_RELIEF', label: 'Disaster Relief', icon: '🆘', color: 'from-yellow-400 to-orange-500' },
  { value: 'ELDERLY_CARE', label: 'Elderly Care', icon: '👴', color: 'from-purple-400 to-pink-500' },
  { value: 'CHILDREN_WELFARE', label: 'Children Welfare', icon: '👶', color: 'from-pink-400 to-rose-500' },
  { value: 'ANIMAL_WELFARE', label: 'Animal Welfare', icon: '🐾', color: 'from-green-400 to-teal-500' },
  { value: 'ENVIRONMENT', label: 'Environment', icon: '🌍', color: 'from-green-500 to-emerald-600' },
  { value: 'WOMEN_EMPOWERMENT', label: 'Women Empowerment', icon: '👩', color: 'from-pink-500 to-purple-500' },
  { value: 'DISABILITY_SUPPORT', label: 'Disability Support', icon: '♿', color: 'from-blue-500 to-cyan-500' },
  { value: 'COMMUNITY_DEVELOPMENT', label: 'Community', icon: '🏘️', color: 'from-teal-400 to-blue-500' },
  { value: 'OTHER', label: 'Other', icon: '📦', color: 'from-gray-400 to-gray-600' }
];

const urgencyLevels = [
  { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-300' }
];

export default function CreateFundraiser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState('');
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    category: '',
    targetAmount: '',
    imageUrl: '',
    additionalImages: [],
    videoUrl: '',
    endDate: '',
    beneficiaryName: '',
    beneficiaryLocation: '',
    urgencyLevel: 'MEDIUM',
    upiId: '' // Will be auto-populated from NGO profile
  });

  // Auto-populate UPI ID from NGO profile
  useEffect(() => {
    const fetchNgoProfile = async () => {
      try {
        const cachedProfile = localStorage.getItem('ngoProfile');
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          if (profile.upiId) {
            setFormData(prev => ({ ...prev, upiId: profile.upiId }));
          }
        }
        
        // Also fetch fresh profile
        const response = await getNgoProfile();
        if (response.data?.upiId) {
          setFormData(prev => ({ ...prev, upiId: response.data.upiId }));
          // Update cache
          localStorage.setItem('ngoProfile', JSON.stringify(response.data));
        }
      } catch (err) {
        // Silently fail - UPI ID is optional
        console.log('Could not fetch NGO profile for UPI ID');
      }
    };
    
    fetchNgoProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  const addAdditionalImage = () => {
    if (formData.additionalImages.length < 4) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, '']
      }));
      setAdditionalPreviews(prev => [...prev, '']);
    }
  };

  const updateAdditionalImage = (index, url) => {
    const newImages = [...formData.additionalImages];
    newImages[index] = url;
    setFormData(prev => ({ ...prev, additionalImages: newImages }));
    
    const newPreviews = [...additionalPreviews];
    newPreviews[index] = url;
    setAdditionalPreviews(newPreviews);
  };

  const removeAdditionalImage = (index) => {
    const newImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, additionalImages: newImages }));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.targetAmount) {
        setError('Please fill in title, category, and target amount');
        return false;
      }
      if (Number(formData.targetAmount) < 1000) {
        setError('Minimum target amount is ₹1,000');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.description || formData.description.length < 100) {
        setError('Description should be at least 100 characters');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.imageUrl) {
        setError('Please add a main image URL');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
      setError('');
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        additionalImages: formData.additionalImages.filter(img => img)
      };

      await createFundraiser(payload);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/ngo/my-fundraisers');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create fundraiser. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Fundraiser Created! 🎉</h2>
          <p className="text-gray-600 mb-6">Your fundraiser is now live. Share it with the world to start collecting donations!</p>
          <button
            onClick={() => navigate('/ngo/my-fundraisers')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
          >
            View My Fundraisers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Start a Fundraiser</h1>
          <p className="text-lg text-gray-600">Create a compelling campaign to raise funds for your cause</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-8 text-sm">
            <span className={step === 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Basics</span>
            <span className={step === 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Story</span>
            <span className={step === 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Media</span>
            <span className={step === 4 ? 'text-blue-600 font-semibold' : 'text-gray-500'}>Review</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Basics */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-600" />
                  Basic Information
                </h2>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fundraiser Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Help Feed 1000 Children This Winter"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          formData.category === cat.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{cat.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="50000"
                      min="1000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum ₹1,000</p>
                </div>

                {/* UPI ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID for Direct Donations (Optional)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="yourname@paytm (from your NGO profile)"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-filled from your NGO profile. You can change it for this fundraiser.
                  </p>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {urgencyLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: level.value }))}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          formData.urgencyLevel === level.value
                            ? level.color + ' border-current'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Story */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Tell Your Story
                </h2>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A brief summary that will appear on fundraiser cards..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters (min 100)</p>
                </div>

                {/* Full Story */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Story (Optional)
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    placeholder="Share the complete story behind this fundraiser. Why is this cause important? Who will benefit? How will the funds be used?"
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    maxLength={5000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.story.length}/5000 characters</p>
                </div>

                {/* Beneficiary Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary Name (Optional)
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="beneficiaryName"
                        value={formData.beneficiaryName}
                        onChange={handleChange}
                        placeholder="e.g., Orphanage Children"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="beneficiaryLocation"
                        value={formData.beneficiaryLocation}
                        onChange={handleChange}
                        placeholder="e.g., Mumbai, India"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Media */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Image className="w-6 h-6 mr-2 text-blue-600" />
                  Add Photos & Video
                </h2>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image URL *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'; }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Use high-quality images that tell your story. You can use image hosting services like Imgur, Cloudinary, or Google Drive (make sure the link is public).
                  </p>
                </div>

                {/* Additional Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Images (Optional - Max 4)
                    </label>
                    {formData.additionalImages.length < 4 && (
                      <button
                        type="button"
                        onClick={addAdditionalImage}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Image
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {formData.additionalImages.map((img, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => updateAdditionalImage(index, e.target.value)}
                          placeholder={`Additional image URL ${index + 1}`}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {additionalPreviews.filter(p => p).length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {additionalPreviews.map((preview, index) => preview && (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Error'; }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL (Optional - YouTube/Vimeo)
                  </label>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Videos can increase donations by up to 150%!</p>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
                  Review Your Fundraiser
                </h2>

                {/* Preview Card */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Fundraiser"
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{categories.find(c => c.value === formData.category)?.icon}</span>
                        <span className="text-sm font-medium text-gray-500">
                          {categories.find(c => c.value === formData.category)?.label}
                        </span>
                        {formData.urgencyLevel === 'CRITICAL' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{formData.title || 'Fundraiser Title'}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{formData.description || 'Description will appear here...'}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">₹0 raised</span>
                          <span className="font-semibold text-gray-800">₹{Number(formData.targetAmount).toLocaleString()} goal</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          0 donors
                        </span>
                        {formData.endDate && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {Math.ceil((new Date(formData.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Beneficiary</p>
                    <p className="font-medium text-gray-800">{formData.beneficiaryName || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-800">{formData.beneficiaryLocation || 'Not specified'}</p>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    By creating this fundraiser, you agree to use the collected funds only for the stated purpose. 
                    All donations are final and will be transferred to your NGO account.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg font-semibold transition-all disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Launch Fundraiser
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
