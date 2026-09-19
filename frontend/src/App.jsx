import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import MaterialDetails from './pages/MaterialDetails';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read initial user state from localStorage
    const savedUser = localStorage.getItem('childhelp_user');
    const token = localStorage.getItem('childhelp_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
        localStorage.removeItem('childhelp_user');
        localStorage.removeItem('childhelp_token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('childhelp_token');
    localStorage.removeItem('childhelp_user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Public Login Page (Redirects to /dashboard if already logged in) */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Public Register Page (Redirects to /dashboard if already logged in) */}
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Protected Study Materials Explorer Route */}
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <StudyMaterials />
            </ProtectedRoute>
          }
        />

        {/* Protected Material Details Route */}
        <Route
          path="/materials/:id"
          element={
            <ProtectedRoute>
              <MaterialDetails />
            </ProtectedRoute>
          }
        />

        {/* Catch all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
