import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
if (rawBaseURL && !rawBaseURL.startsWith('http://') && !rawBaseURL.startsWith('https://')) {
  rawBaseURL = `https://${rawBaseURL}`;
}

// Ensure baseURL ends with /api
const baseURL = rawBaseURL.endsWith('/api')
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, '')}/api`;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header if token exists in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('childhelp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
