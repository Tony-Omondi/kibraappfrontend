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

// Login API
export const login = (username, password) =>
  api.post('auth/login/', { username, password });

// Registration API
export const register = (username, email, password1, password2) =>
  api.post('auth/registration/', {
    username,
    email,
    password1,
    password2,
    role: 'user',          // ➡ Always default to "user"
  });

export const getPosts = () => api.get('api/posts/posts');

export default api;
