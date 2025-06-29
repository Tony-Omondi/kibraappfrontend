// === 📁 src/api/api.js ===
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = (username, password) =>
  api.post('accounts/login/', { email: username, password }); // Matches login_view

export const register = (username, email, password1, password2) =>
  api.post('auth/registration/', { username, email, password1, password2 });

export const verifyEmail = ({ verification_code }) =>
  api.post('auth/verify-email/', { verification_code });

export const getUserProfile = (userId) => api.get(`accounts/users/${userId}/`); // Matches UserViewSet

// Google Login (assumes dj_rest_auth social login endpoint)
export const googleLogin = (idToken) =>
  api.post('auth/google/', { id_token: idToken }); // Placeholder; adjust based on backend URL

// Posts
export const getPosts = () => api.get('api/posts/posts');

export default api;