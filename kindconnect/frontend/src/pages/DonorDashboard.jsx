import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Package, MapPin, Clock, LogOut } from 'lucide-react'

const DonorDashboard = () => {
  const navigate = useNavigate()
  const [showDonateForm, setShowDonateForm] = useState(false)
  const [donationForm, setDonationForm] = useState({
    itemType: '',
    quantity: '',
    description: '',
    pickupAddress: '',
    preferredDate: ''
  })

  const donations = [
    { id: 1, item: 'Clothes', quantity: '50 pieces', status: 'Delivered', ngo: 'Hope Foundation', date: '2025-12-15' },
    { id: 2, item: 'Books', quantity: '100 books', status: 'In Transit', ngo: 'Education for All', date: '2025-12-18' },
    { id: 3, item: 'Food Items', quantity: '25 kg', status: 'Pending Pickup', ngo: 'Meal Share NGO', date: '2025-12-19' }
  ]

  const handleDonate = (e) => {
    e.preventDefault()
    alert('Donation request submitted successfully!')
    setShowDonateForm(false)
    setDonationForm({
      itemType: '',
      quantity: '',
      description: '',
      pickupAddress: '',
      preferredDate: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center text-purple-600 text-2xl font-bold hover:text-purple-700 transition">
            <Heart className="inline mr-2" />
            KindConnect
          </a>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition" onClick={() => navigate('/')}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard</h1>
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg" onClick={() => setShowDonateForm(!showDonateForm)}>
            <Package size={20} />
            Make a Donation
          </button>
        </div>

        {showDonateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Donation</h2>
            <form onSubmit={handleDonate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Item Type</label>
                  <select
                    value={donationForm.itemType}
                    onChange={(e) => setDonationForm({...donationForm, itemType: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select item type</option>
                    <option value="clothes">Clothes</option>
                    <option value="food">Food Items</option>
                    <option value="books">Books</option>
                    <option value="toys">Toys</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g., 50 pieces, 25 kg"
                    value={donationForm.quantity}
                    onChange={(e) => setDonationForm({...donationForm, quantity: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  placeholder="Describe the items you want to donate"
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                  rows="3"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Pickup Address</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={donationForm.pickupAddress}
                  onChange={(e) => setDonationForm({...donationForm, pickupAddress: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Preferred Pickup Date</label>
                <input
                  type="date"
                  value={donationForm.preferredDate}
                  onChange={(e) => setDonationForm({...donationForm, preferredDate: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex gap-4">
                <button type="button" className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium" onClick={() => setShowDonateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg">
                  Submit Donation
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">12</h3>
            <p className="text-gray-600 font-medium">Total Donations</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-green-600 mb-2">8</h3>
            <p className="text-gray-600 font-medium">Delivered</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">3</h3>
            <p className="text-gray-600 font-medium">In Progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-3xl font-bold text-orange-600 mb-2">150+</h3>
            <p className="text-gray-600 font-medium">Lives Impacted</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Donations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">NGO</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-purple-600" />
                        <span className="font-medium text-gray-800">{donation.item}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{donation.quantity}</td>
                    <td className="px-6 py-4 text-gray-700">{donation.ngo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>{donation.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        donation.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        donation.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
