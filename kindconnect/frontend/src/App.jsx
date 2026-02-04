import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
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

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        {/* Donor Routes */}
        <Route path="/profile/donor" element={<DonorProfilePage />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/create-donation" element={<CreateDonation />} />
        <Route path="/donor/donations" element={<MyDonations />} />
        <Route path="/donor/browse-ngos" element={<BrowseNGOs />} />
        {/* NGO Routes */}
        <Route path="/profile/ngo" element={<NgoProfilePage />} />
        <Route path="/ngo/dashboard" element={<NgoDashboard />} />
        <Route path="/ngo/available-donations" element={<NgoAvailableDonations />} />
        <Route path="/ngo/my-donations" element={<NgoMyDonations />} />
        {/* Fundraiser Routes */}
        <Route path="/ngo/create-fundraiser" element={<CreateFundraiser />} />
        <Route path="/ngo/my-fundraisers" element={<NgoMyFundraisers />} />
        <Route path="/ngo/edit-fundraiser/:id" element={<CreateFundraiser />} />
        <Route path="/fundraisers" element={<BrowseFundraisers />} />
        <Route path="/fundraiser/:id" element={<FundraiserDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
