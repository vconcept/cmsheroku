import apiClient from './apiClient';
import Cookie from 'js-cookie';

export const authService = {
  async register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    
    // Store token and user in cookies
    Cookie.set('authToken', token, { expires: 7 });
    Cookie.set('user', JSON.stringify(user), { expires: 7 });
    
    return { token, user };
  },

  logout() {
    Cookie.remove('authToken');
    Cookie.remove('user');
  },

  getCurrentUser() {
    const userCookie = Cookie.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  },

  getToken() {
    return Cookie.get('authToken');
  },

  async getCurrentUserFromAPI() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  async updateProfile(data) {
    const response = await apiClient.put('/auth/profile', data);
    const user = response.data.data;
    Cookie.set('user', JSON.stringify(user), { expires: 7 });
    return user;
  },

  isAuthenticated() {
    return !!Cookie.get('authToken');
  },
};
