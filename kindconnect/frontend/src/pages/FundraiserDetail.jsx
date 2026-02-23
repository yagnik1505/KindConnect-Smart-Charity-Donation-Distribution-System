import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Share2, Users, Clock, MapPin, Building2, 
  CheckCircle, AlertCircle, Calendar,
  ArrowLeft, X, Gift,
  Facebook, Twitter, Linkedin, Copy, Play, Wallet
} from 'lucide-react';
import { getFundraiserById, getRecentDonations, donateToFundraiser } from '../services/fundraiserService';
import { getDonorProfile } from '../services/profileService';
import Navbar from '../components/Navbar';

const categoryLabels = {
  EDUCATION: { label: 'Education', icon: '📚' },
  HEALTHCARE: { label: 'Healthcare', icon: '🏥' },
  FOOD_HUNGER: { label: 'Food & Hunger', icon: '🍽️' },
  DISASTER_RELIEF: { label: 'Disaster Relief', icon: '🆘' },
  ELDERLY_CARE: { label: 'Elderly Care', icon: '👴' },
  CHILDREN_WELFARE: { label: 'Children Welfare', icon: '👶' },
  ANIMAL_WELFARE: { label: 'Animal Welfare', icon: '🐾' },
  ENVIRONMENT: { label: 'Environment', icon: '🌍' },
  WOMEN_EMPOWERMENT: { label: 'Women Empowerment', icon: '👩' },
  DISABILITY_SUPPORT: { label: 'Disability Support', icon: '♿' },
  COMMUNITY_DEVELOPMENT: { label: 'Community', icon: '🏘️' },
  OTHER: { label: 'Other', icon: '📦' }
};

const suggestedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

export default function FundraiserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fundraiser, setFundraiser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [donating, setDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const [donationForm, setDonationForm] = useState({
    amount: '',
    message: '',
    anonymous: false
  });

  const isLoggedIn = localStorage.getItem('authToken') !== null;
  const userRole = localStorage.getItem('userRole');

  // Check if current user is the owner of this fundraiser
  const isOwner = () => {
    if (!fundraiser || userRole !== 'NGO') return false;
    try {
      const ngoProfile = JSON.parse(localStorage.getItem('ngoProfile') || '{}');
      return fundraiser.ngoUserId === ngoProfile.userId;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    fetchFundraiser();
    fetchDonations();
    // Ensure donor profile is cached for donation
    if (isLoggedIn && userRole === 'DONOR') {
      fetchDonorProfile();
    }
  }, [id]);

  const fetchDonorProfile = async () => {
    try {
      const cachedProfile = localStorage.getItem('donorProfile');
      if (!cachedProfile || cachedProfile === '{}') {
        const response = await getDonorProfile();
        if (response.data) {
          localStorage.setItem('donorProfile', JSON.stringify(response.data));
        }
      }
    } catch (err) {
      console.error('Failed to fetch donor profile:', err);
    }
  };

  const fetchFundraiser = async () => {
    try {
      setLoading(true);
      const data = await getFundraiserById(id);
      setFundraiser(data);
    } catch (err) {
      console.error('Failed to fetch fundraiser:', err);
      setError('Fundraiser not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const data = await getRecentDonations(id);
      setDonations(data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/auth/login');
      return;
    }

    if (!donationForm.amount || Number(donationForm.amount) < 100) {
      alert('Minimum donation is ₹100');
      return;
    }

    setDonating(true);
    try {
      // TODO: Integrate real payment gateway (Razorpay/Stripe) for production
      // Currently using timestamp-based ID for demo purposes
      await donateToFundraiser(id, {
        amount: Number(donationForm.amount),
        message: donationForm.message,
        anonymous: donationForm.anonymous,
        paymentId: 'DEMO_PAY_' + Date.now()
      });
      setDonationSuccess(true);
      fetchFundraiser();
      fetchDonations();
    } catch (err) {
      console.error('Donation failed:', err);
      alert('Donation failed. Please try again.');
    } finally {
      setDonating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(globalThis.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(globalThis.location.href);
    const text = encodeURIComponent(`Help support "${fundraiser?.title}" - Every donation makes a difference!`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    globalThis.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Fundraiser Not Found</h1>
          <p className="text-gray-600 mb-6">The fundraiser you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/fundraisers')}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all"
          >
            Browse Fundraisers
          </button>
        </div>
      </div>
    );
  }

  const allImages = [fundraiser.imageUrl, ...(fundraiser.additionalImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/fundraisers')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Fundraisers
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={allImages[selectedImage] || 'https://via.placeholder.com/800x400'}
                  alt={fundraiser.title}
                  className="w-full h-80 md:h-96 object-cover"
                />
                {fundraiser.urgencyLevel === 'CRITICAL' && (
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full animate-pulse">
                      🔥 URGENT
                    </span>
                  </div>
                )}
                {fundraiser.videoUrl && (
                  <button className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-black/70 text-white rounded-full hover:bg-black/80 transition-all">
                    <Play className="w-5 h-5" />
                    <span>Watch Video</span>
                  </button>
                )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-pink-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & NGO */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">{categoryLabels[fundraiser.category]?.icon}</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
                  {categoryLabels[fundraiser.category]?.label}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{fundraiser.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span className="font-medium">{fundraiser.ngoName}</span>
                </div>
                {fundraiser.beneficiaryLocation && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{fundraiser.beneficiaryLocation}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Started {new Date(fundraiser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About this Fundraiser</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{fundraiser.description}</p>
              
              {fundraiser.story && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Our Story</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{fundraiser.story}</p>
                </div>
              )}

              {fundraiser.beneficiaryName && (
                <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                  <p className="text-sm text-gray-600">Beneficiary</p>
                  <p className="font-semibold text-gray-800">{fundraiser.beneficiaryName}</p>
                </div>
              )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Supporters</h2>
              {donations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Be the first to support this cause!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {donation.anonymous ? '?' : donation.donorName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">
                            {donation.anonymous ? 'Anonymous' : donation.donorName}
                          </p>
                          <p className="font-bold text-pink-600">₹{donation.amount.toLocaleString()}</p>
                        </div>
                        {donation.message && (
                          <p className="text-gray-600 text-sm mt-1">"{donation.message}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(donation.donatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Donation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Progress */}
              <div className="mb-6">
                {(() => {
                  const raised = fundraiser.currentAmount || 0;
                  const goal = fundraiser.targetAmount || 1;
                  const percentage = Math.min(Math.round((raised / goal) * 100), 100);
                  return (
                    <>
                      <div className="flex items-end justify-between mb-2">
                        <div>
                          <p className="text-3xl font-bold text-pink-600">₹{raised.toLocaleString()}</p>
                          <p className="text-gray-500 text-sm">raised of ₹{(fundraiser.targetAmount || 0).toLocaleString()} goal</p>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Users className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-800">{fundraiser.totalDonors || 0}</p>
                  <p className="text-xs text-gray-500">Donors</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-800">{fundraiser.daysLeft ?? '∞'}</p>
                  <p className="text-xs text-gray-500">Days Left</p>
                </div>
              </div>

              {/* Donate Button */}
              {isOwner() ? (
                <div className="w-full py-4 bg-gray-300 text-gray-600 rounded-xl font-bold text-lg text-center cursor-not-allowed">
                  You cannot donate to your own fundraiser
                </div>
              ) : (
                <button
                  onClick={() => setShowDonateModal(true)}
                  disabled={!fundraiser.isActive}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Heart className="w-6 h-6 mr-2" fill="white" />
                  {fundraiser.isActive ? 'Donate Now' : 'Campaign Ended'}
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full mt-3 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share this Fundraiser
              </button>

              {/* Direct Donation - UPI Info */}
              {fundraiser.upiId && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={18} className="text-green-600" />
                    <h4 className="text-sm font-bold text-gray-800">Direct Donation</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Pay directly via UPI</p>
                  <div className="bg-white/60 rounded-lg p-2.5 flex items-center justify-between group hover:bg-white transition-colors">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">UPI ID</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">{fundraiser.upiId}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(fundraiser.upiId);
                        // Simple feedback - you could add a toast here
                      }}
                      className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                      title="Copy UPI ID"
                    >
                      <Copy size={14} className="text-green-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Verified NGO
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Secure Payment
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Tax Benefits Available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {donationSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You! 🎉</h2>
                <p className="text-gray-600 mb-6">Your donation of ₹{Number(donationForm.amount).toLocaleString()} has been received. Together, we're making a difference!</p>
                <button
                  onClick={() => {
                    setShowDonateModal(false);
                    setDonationSuccess(false);
                    setDonationForm({ amount: '', message: '', anonymous: false });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Make a Donation</h2>
                    <p className="text-sm text-gray-500">Support {fundraiser.ngoName}</p>
                  </div>
                  <button
                    onClick={() => setShowDonateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleDonate} className="p-6 space-y-6">
                  {/* Suggested Amounts */}
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-3">Select Amount</legend>
                    <div className="grid grid-cols-3 gap-3">
                      {suggestedAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setDonationForm(prev => ({ ...prev, amount: amount.toString() }))}
                          className={`py-3 rounded-xl font-semibold transition-all ${
                            donationForm.amount === amount.toString()
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ₹{amount.toLocaleString()}
                        </button>
                      ))
                    }
                    </div>
                  </fieldset>

                  {/* Custom Amount */}
                  <div>
                    <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">Or enter custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        id="customAmount"
                        type="number"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                        min="100"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum ₹100</p>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="donationMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Leave a message (optional)
                    </label>
                    <textarea
                      id="donationMessage"
                      value={donationForm.message}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Share a few words of support..."
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all resize-none"
                    />
                  </div>

                  {/* Anonymous */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={donationForm.anonymous}
                      onChange={(e) => setDonationForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                      className="w-5 h-5 text-pink-500 border-2 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700">Make my donation anonymous</span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={donating || !donationForm.amount}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {donating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Donate ₹{donationForm.amount ? Number(donationForm.amount).toLocaleString() : '0'}
                      </>
                    )}
                  </button>

                  {!isLoggedIn && (
                    <p className="text-center text-sm text-gray-500">
                      <span 
                        className="text-pink-600 cursor-pointer hover:underline" 
                        onClick={() => navigate('/auth/login')}
                        onKeyDown={(e) => e.key === 'Enter' && navigate('/auth/login')}
                        role="button"
                        tabIndex={0}
                      >
                        Login
                      </span> to complete your donation
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Share this Fundraiser</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => shareOnSocial('facebook')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
              >
                <Facebook className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-xs text-gray-600">Facebook</span>
              </button>
              <button
                onClick={() => shareOnSocial('twitter')}
                className="flex flex-col items-center p-4 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all"
              >
                <Twitter className="w-8 h-8 text-sky-500 mb-2" />
                <span className="text-xs text-gray-600">Twitter</span>
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
              >
                <Linkedin className="w-8 h-8 text-blue-700 mb-2" />
                <span className="text-xs text-gray-600">LinkedIn</span>
              </button>
              <button
                onClick={copyLink}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
              >
                <Copy className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-xs text-gray-600">Copy Link</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Sharing helps raise awareness and brings more support to this cause!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
