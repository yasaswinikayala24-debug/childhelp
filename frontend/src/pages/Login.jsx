import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { token, _id, name, email, role } = response.data;

      const userObj = { _id, name, email, role };

      // Store JWT token and user info in localStorage
      localStorage.setItem('childhelp_token', token);
      localStorage.setItem('childhelp_user', JSON.stringify(userObj));

      if (onLoginSuccess) {
        onLoginSuccess(userObj);
      }

      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        'Invalid credentials or server error. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your ChildHelp dashboard</p>
        </div>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              className="form-input"
              placeholder="e.g. rahul@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1rem', padding: '0.8rem' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" className="auth-link">
            Register Here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
