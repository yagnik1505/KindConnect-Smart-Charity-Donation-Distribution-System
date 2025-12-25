import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Package, MapPin, Users } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center text-white text-2xl font-bold hover:text-purple-200 transition">
            <Heart className="inline mr-2" />
            KindConnect
          </a>
          <div className="flex gap-3">
            <button className="px-6 py-2 text-white border-2 border-white rounded-lg hover:bg-white/10 transition font-medium" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium shadow-lg" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Connect Kindness, Transform Lives</h1>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Smart platform connecting donors with NGOs for efficient charity distribution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-bold text-lg shadow-xl" onClick={() => navigate('/register?type=donor')}>
              I Want to Donate
            </button>
            <button className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition font-bold text-lg shadow-xl" onClick={() => navigate('/register?type=ngo')}>
              I'm an NGO
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How KindConnect Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Package size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Easy Donations</h3>
              <p className="text-purple-100 text-center">Donate items or funds easily through our platform with complete transparency</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Smart Matching</h3>
              <p className="text-purple-100 text-center">AI-powered matching system connects donations with NGOs in need</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MapPin size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Optimized Routing</h3>
              <p className="text-purple-100 text-center">Efficient pickup and delivery routes to maximize impact</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Track Impact</h3>
              <p className="text-purple-100 text-center">Real-time tracking of your donations and their impact on communities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">10,000+</h3>
              <p className="text-purple-200">Donations Delivered</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
              <p className="text-purple-200">Partner NGOs</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">50,000+</h3>
              <p className="text-purple-200">Lives Impacted</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-2">25+</h3>
              <p className="text-purple-200">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black/20 backdrop-blur-md py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-purple-100">&copy; 2025 KindConnect. Making charity distribution smarter and more efficient.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
