import axios from 'axios';

// Force localhost URL to avoid Private Network Access block from browser
const API_URL = 'http://127.0.0.1:8000/api/v1';
console.log("Axios API_URL initialized as:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Only access localStorage if we are in the browser (client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle automatic token refreshing on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          try {
            // Attempt to refresh the access token
            const res = await axios.post(`${API_URL}/auth/refresh/`, {
              refresh: refreshToken,
            });
            
            const newAccessToken = res.data.access;
            localStorage.setItem('access_token', newAccessToken);
            
            // Update the Authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
            
          } catch (refreshError) {
            // Refresh token has also expired or is invalid
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Force user to login page
            window.location.href = '/login'; 
            return Promise.reject(refreshError);
          }
        } else {
            // No refresh token available, send to login
            window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
