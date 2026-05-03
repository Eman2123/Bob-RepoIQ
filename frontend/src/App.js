import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DashboardEnhanced from './pages/DashboardEnhanced';
import CompareRepos from './pages/CompareRepos';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analyze" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardEnhanced />} />
          <Route path="/dashboard-old" element={<Dashboard />} />
          <Route path="/compare" element={<CompareRepos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Made with Bob
