import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CompanyCreateLogin from './components/CompanyCreateLogin';
import Register from './components/Register';
import Dashboard from './components/companyCreate/Dashboard';
import CompanyManagement from './components/companyCreate/CompanyManagement';
import CompanyLogin from './components/CompanyLogin';
import CompanyAgencySlider from './components/companyCreate/agency/CompanyAgencySlider';

// guide components
import GuideController from './components/guide-components/GuideController';
import Wallet from './components/guide-components/Wallet';
import Reservations from './components/guide-components/Reservations';
import Tours from './components/guide-components/Tours';
import GuideLogin from './components/guide-components/GuideLogin';
import ProtectedRoute from './components/guide-components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          {/* Company Routes */}
          <Route path="/" element={<CompanyLogin />} />
          <Route path="/login" element={<CompanyCreateLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company-management" element={<CompanyManagement />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/companyAgencyDashboard/*" element={<CompanyAgencySlider />} />

          {/* Guide Routes */}
          <Route path="/guide-login" element={<GuideLogin />} />
          <Route 
            path="/guide-dashboard" 
            element={
              <ProtectedRoute>
                <GuideController />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/guide-dashboard/wallet" 
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/guide-dashboard/reservations" 
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/guide-dashboard/tours" 
            element={
              <ProtectedRoute>
                <Tours />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
