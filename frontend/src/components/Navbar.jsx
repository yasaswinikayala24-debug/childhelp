import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('childhelp_token');
      localStorage.removeItem('childhelp_user');
      navigate('/login');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">🌱</div>
          <span>ChildHelp</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/materials"
                    className={`nav-link ${location.pathname.startsWith('/materials') ? 'active' : ''}`}
                  >
                    Study Materials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-badge" style={{ margin: 0 }}>
                👤 {user.name} ({user.role || 'Student'})
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.45rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
