import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import MaterialDetails from './pages/MaterialDetails';
import Quizzes from './pages/Quizzes';
import QuizDetails from './pages/QuizDetails';
import QuizResult from './pages/QuizResult';
import MyProgress from './pages/MyProgress';
import Scholarships from './pages/Scholarships';
import Announcements from './pages/Announcements';
import MentorSupport from './pages/MentorSupport';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AskDoubt from './pages/AskDoubt';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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

  const getDashboardRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'mentor') return <Navigate to="/mentor-dashboard" replace />;
    return <Dashboard user={user} onLogout={handleLogout} />;
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : user.role === 'mentor' ? (
                <Navigate to="/mentor-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

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

        {/* Role Smart Redirect / Student Dashboard */}
        <Route path="/dashboard" element={getDashboardRedirect()} />

        {/* Protected Common & Student Routes */}
        <Route
          path="/materials"
          element={
            <ProtectedRoute user={user}>
              <StudyMaterials user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/:id"
          element={
            <ProtectedRoute user={user}>
              <MaterialDetails user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute user={user}>
              <Quizzes user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute user={user}>
              <QuizDetails user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz-result"
          element={
            <ProtectedRoute user={user}>
              <QuizResult user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-progress"
          element={
            <ProtectedRoute user={user}>
              <MyProgress user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scholarships"
          element={
            <ProtectedRoute user={user}>
              <Scholarships user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute user={user}>
              <Announcements user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-support"
          element={
            <ProtectedRoute user={user}>
              <MentorSupport user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask-doubt"
          element={
            <ProtectedRoute user={user}>
              <AskDoubt user={user} />
            </ProtectedRoute>
          }
        />

        {/* Protected Mentor Portal Route */}
        <Route
          path="/mentor-dashboard"
          element={
            <RoleProtectedRoute user={user} allowedRoles={['mentor', 'admin']}>
              <MentorDashboard user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Protected Admin Control Panel Route */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
