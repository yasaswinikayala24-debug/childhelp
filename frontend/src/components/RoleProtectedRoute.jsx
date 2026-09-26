import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ user, allowedRoles, children }) => {
  const token = localStorage.getItem('childhelp_token');

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role || 'student';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <span style={{ fontSize: '3rem' }}>🚫</span>
          <h2 style={{ marginTop: '1rem', color: '#e53e3e' }}>Access Restricted</h2>
          <p style={{ color: '#718096', margin: '1rem 0' }}>
            Your current account role (<strong>{userRole}</strong>) does not have permission to view this page.
          </p>
          <a href="/dashboard" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
