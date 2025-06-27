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
  api.post('auth/login/', { username, password });

export const register = (username, email, password1, password2) =>
  api.post('auth/registration/', { username, email, password1, password2 });

export const verifyEmail = ({ verification_code }) =>
  api.post('auth/verify-email/', { verification_code });

export const getUserProfile = (userId) => api.get(`users/${userId}/`);

// Posts
export const getPosts = () => api.get('api/posts/posts');

export default api;