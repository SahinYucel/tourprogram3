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
import GuideDashboard from './components/GuideDashboard';

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          <Route path="/" element={<CompanyLogin />} />
          <Route path="/login" element={<CompanyCreateLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company-management" element={<CompanyManagement />} />
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/companyAgencyDashboard/*" element={<CompanyAgencySlider />} />
          <Route path="/guide-dashboard/*" element={<GuideDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
