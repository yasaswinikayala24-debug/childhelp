import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_BASE_URL || '';
if (rawBaseURL && !rawBaseURL.startsWith('http://') && !rawBaseURL.startsWith('https://')) {
  const isLocal = rawBaseURL.includes('localhost') || rawBaseURL.includes('127.0.0.1');
  rawBaseURL = isLocal ? `http://${rawBaseURL}` : `https://${rawBaseURL}`;
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
