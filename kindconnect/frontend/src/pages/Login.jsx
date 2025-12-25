import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'donor'
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to KindConnect</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg">
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            <p>Don't have an account? <a href="/register" className="text-purple-600 hover:text-purple-700 font-medium">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
