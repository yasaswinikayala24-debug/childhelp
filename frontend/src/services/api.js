import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
if (rawBaseURL && !rawBaseURL.startsWith('http://') && !rawBaseURL.startsWith('https://')) {
  const isLocal = rawBaseURL.includes('localhost') || rawBaseURL.includes('127.0.0.1');
  rawBaseURL = isLocal ? `http://${rawBaseURL}` : `https://${rawBaseURL}`;
}

// Strip trailing /api or /api/ from base URL to prevent double /api/api paths
if (rawBaseURL.endsWith('/api')) {
  rawBaseURL = rawBaseURL.slice(0, -4);
} else if (rawBaseURL.endsWith('/api/')) {
  rawBaseURL = rawBaseURL.slice(0, -5);
}

const API = axios.create({
  baseURL: rawBaseURL,
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
