import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Building, Truck } from 'lucide-react';
import { register, login } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Register user - backend returns: { "Message": "User registered successfully" }
      await register(formData.email, formData.password, formData.role);
      
      // Auto-login after registration
      const loginResponse = await login(formData.email, formData.password);
      
      // Redirect to homepage
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.Message || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white">Join KindConnect</h1>
          <p className="text-white/90 mt-2">Create your account to start making a difference</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'DONOR' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'DONOR'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${
                    formData.role === 'DONOR' ? 'text-pink-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.role === 'DONOR' ? 'text-pink-600' : 'text-gray-600'
                  }`}>
                    Donor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'NGO' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'NGO'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Building className={`h-6 w-6 mx-auto mb-2 ${
                    formData.role === 'NGO' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.role === 'NGO' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    NGO
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'DRIVER' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'DRIVER'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Truck className={`h-6 w-6 mx-auto mb-2 ${
                    formData.role === 'DRIVER' ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.role === 'DRIVER' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    Driver
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-pink-500 hover:text-pink-600 font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
