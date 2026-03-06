import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Hash, FileText, CheckCircle, Gift, Sparkles, Building2, MapPin, User } from 'lucide-react';
import { createDonation } from '../services/donationService';
import Navbar from '../components/Navbar';

export default function CreateDonation() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedNgo = location.state?.selectedNgo; // Get selected NGO from navigation state
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    itemType: '',
    quantity: 1,
    description: '',
    targetNgoUserId: selectedNgo?.userId || null // Set target NGO if coming from Browse NGOs
  });

  const itemCategories = [
    { value: 'Food', icon: '🍽️', color: 'from-orange-400 to-red-500' },
    { value: 'Clothes', icon: '👕', color: 'from-blue-400 to-indigo-500' },
    { value: 'Books', icon: '📚', color: 'from-green-400 to-teal-500' },
    { value: 'Toys', icon: '🧸', color: 'from-pink-400 to-purple-500' },
    { value: 'Electronics', icon: '💻', color: 'from-cyan-400 to-blue-500' },
    { value: 'Furniture', icon: '🪑', color: 'from-yellow-400 to-orange-500' },
    { value: 'Medical', icon: '⚕️', color: 'from-red-400 to-pink-500' },
    { value: 'Other', icon: '📦', color: 'from-gray-400 to-gray-600' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
    setError('');
  };

  const handleItemTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, itemType: type }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createDonation(formData);
      setSuccess(true);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        navigate('/donor/donations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center ring-1 ring-pink-100">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-pink-300/40">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Donation Created!</h2>
          <p className="text-gray-600 mb-6">Thank you for your generosity. Your donation will help those in need.</p>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/donor/donations')}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 font-semibold transition-all hover:scale-105 shadow-lg"
            >
              View My Donations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected NGO Banner (if donating to specific NGO) */}
        {selectedNgo && (
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg shadow-pink-300/30 ring-1 ring-white/20">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                {selectedNgo.logo ? (
                  <img src={selectedNgo.logo} alt={selectedNgo.ngoName} className="w-12 h-12 object-contain rounded-lg" />
                ) : (
                  <Building2 className="w-8 h-8 text-pink-600" />
                )}
              </div>
              <div className="flex-1 text-white">
                <p className="text-sm font-medium opacity-90 mb-1">Donating to</p>
                <h3 className="text-2xl font-bold mb-2">{selectedNgo.ngoName}</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedNgo.city}</span>
                  </div>
                  {selectedNgo.contactPerson && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{selectedNgo.contactPerson}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-pink-300/40">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {selectedNgo ? 'Donate to ' + selectedNgo.ngoName : 'Create Your Donation'}
          </h1>
          <p className="text-lg text-gray-600">
            {selectedNgo 
              ? `Your donation will be exclusively sent to ${selectedNgo.ngoName}` 
              : 'Share what you have with those who need it most'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
            <p className="text-rose-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 ring-1 ring-pink-100/80">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Type Selection */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-4">
                <Package className="w-6 h-6 text-rose-500" />
                <span>What would you like to donate? <span className="text-red-500">*</span></span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {itemCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleItemTypeSelect(category.value)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                      formData.itemType === category.value
                        ? 'border-rose-400 bg-rose-50 shadow-lg scale-105 ring-1 ring-rose-200'
                        : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{category.icon}</div>
                      <p className={`text-sm font-semibold ${
                        formData.itemType === category.value ? 'text-rose-600' : 'text-gray-700'
                      }`}>
                        {category.value}
                      </p>
                    </div>
                    {formData.itemType === category.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-rose-500 fill-current" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-3">
                <Hash className="w-6 h-6 text-rose-500" />
                <span>Quantity <span className="text-red-500">*</span></span>
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className="w-12 h-12 bg-pink-50 hover:bg-pink-100 text-rose-600 rounded-xl font-bold text-xl transition-all ring-1 ring-pink-200"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="flex-1 text-center text-2xl font-bold px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                  className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold text-xl transition-all shadow-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="flex items-center space-x-2 text-lg font-bold text-gray-800 mb-3">
                <FileText className="w-6 h-6 text-rose-500" />
                <span>Description <span className="text-red-500">*</span></span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none text-gray-700"
                placeholder="Please provide details about your donation (condition, brand, size, etc.)"
              />
              <p className="mt-2 text-sm text-gray-500">Tip: Be as detailed as possible to help NGOs understand what you're donating</p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-l-4 border-rose-400 p-6 rounded-r-xl">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ NGOs will review your donation</li>
                    <li>✓ Once accepted, a driver will be assigned</li>
                    <li>✓ Driver will pick up from your location</li>
                    <li>✓ Track your donation's journey in real-time</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.itemType}
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 font-bold text-lg shadow-lg shadow-pink-300/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Donation...</span>
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6" />
                  <span>Create Donation</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
