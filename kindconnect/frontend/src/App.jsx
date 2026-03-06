import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
// Donor Pages
import DonorProfilePage from './pages/DonorProfilePage';
import DonorDashboard from './pages/DonorDashboard';
import CreateDonation from './pages/CreateDonation';
import MyDonations from './pages/MyDonations';
import BrowseNGOs from './pages/BrowseNGOs';
// NGO Pages
import NgoProfilePage from './pages/NgoProfilePage';
import NgoDashboard from './pages/NGODashboard';
import NgoAvailableDonations from './pages/NgoAvailableDonations';
import NgoMyDonations from './pages/NgoMyDonations';
// Fundraiser Pages
import CreateFundraiser from './pages/CreateFundraiser';
import NgoMyFundraisers from './pages/NgoMyFundraisers';
import BrowseFundraisers from './pages/BrowseFundraisers';
import FundraiserDetail from './pages/FundraiserDetail';
// Driver Pages
import DriverProfilePage from './pages/DriverProfilePage';
import DriverDashboard from './pages/DriverDashboard';
import AvailablePickups from './pages/AvailablePickups';
import MyDeliveries from './pages/MyDeliveries';
// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminDriverDashboard from './pages/AdminDriverDashboard';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        {/* Protected Donor Routes */}
        <Route path="/profile/donor" element={<ProtectedRoute><DonorProfilePage /></ProtectedRoute>} />
        <Route path="/donor/dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/create-donation" element={<ProtectedRoute><CreateDonation /></ProtectedRoute>} />
        <Route path="/donor/donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
        <Route path="/donor/browse-ngos" element={<ProtectedRoute><BrowseNGOs /></ProtectedRoute>} />
        <Route path="/donor/browse-fundraisers" element={<ProtectedRoute><BrowseFundraisers /></ProtectedRoute>} />
        <Route path="/donor/fundraiser/:id" element={<ProtectedRoute><FundraiserDetail /></ProtectedRoute>} />
        
        {/* Protected NGO Routes */}
        <Route path="/profile/ngo" element={<ProtectedRoute><NgoProfilePage /></ProtectedRoute>} />
        <Route path="/ngo/dashboard" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
        <Route path="/ngo/available-donations" element={<ProtectedRoute><NgoAvailableDonations /></ProtectedRoute>} />
        <Route path="/ngo/my-donations" element={<ProtectedRoute><NgoMyDonations /></ProtectedRoute>} />
        
        {/* Protected Fundraiser Routes */}
        <Route path="/ngo/create-fundraiser" element={<ProtectedRoute><CreateFundraiser /></ProtectedRoute>} />
        <Route path="/ngo/my-fundraisers" element={<ProtectedRoute><NgoMyFundraisers /></ProtectedRoute>} />
        <Route path="/ngo/edit-fundraiser/:id" element={<ProtectedRoute><CreateFundraiser /></ProtectedRoute>} />
        <Route path="/fundraisers" element={<ProtectedRoute><BrowseFundraisers /></ProtectedRoute>} />
        <Route path="/fundraiser/:id" element={<ProtectedRoute><FundraiserDetail /></ProtectedRoute>} />
        
        {/* Protected Driver Routes */}
        <Route path="/profile/driver" element={<ProtectedRoute><DriverProfilePage /></ProtectedRoute>} />
        <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/available-pickups" element={<ProtectedRoute><AvailablePickups /></ProtectedRoute>} />
        <Route path="/driver/my-deliveries" element={<ProtectedRoute><MyDeliveries /></ProtectedRoute>} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/drivers" element={<ProtectedRoute><AdminDriverDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
