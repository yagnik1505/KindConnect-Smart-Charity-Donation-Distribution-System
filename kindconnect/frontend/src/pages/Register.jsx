import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Heart } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const typeFromUrl = searchParams.get('type') || 'donor'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: typeFromUrl,
    address: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: Navigate based on user type
    if (formData.userType === 'donor') {
      navigate('/donor')
    } else {
      navigate('/ngo')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Heart size={48} className="mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Join KindConnect</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-3">I am a:</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="donor"
                    checked={formData.userType === 'donor'}
                    onChange={(e) => setFormData({...formData, userType: e.target.value})}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 font-medium">Donor</span>
                </label>
                <label className="flex-1 flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="ngo"
                    checked={formData.userType === 'ngo'}
                    onChange={(e) => setFormData({...formData, userType: e.target.value})}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-gray-700 font-medium">NGO</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">{formData.userType === 'ngo' ? 'Organization Name' : 'Full Name'}</label>
              <input
                type="text"
                placeholder={formData.userType === 'ngo' ? 'NGO Name' : 'John Doe'}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                placeholder="Your address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            <p>Already have an account? <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">Login here</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
