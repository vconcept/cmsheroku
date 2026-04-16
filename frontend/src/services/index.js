import apiClient from './apiClient';
import { postService } from './postService';

export { postService };

export const commentService = {
  async getComments(params = {}) {
    const response = await apiClient.get('/comments', { params });
    return response.data.data.comments || [];
  },

  async getCommentById(id) {
    const response = await apiClient.get(`/comments/${id}`);
    return response.data.data;
  },

  async createComment(data) {
    const response = await apiClient.post('/comments', data);
    return response.data.data;
  },

  async updateComment(id, data) {
    const response = await apiClient.put(`/comments/${id}`, data);
    return response.data.data;
  },

  async deleteComment(id) {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data.data;
  },

  async approveComment(id) {
    const response = await apiClient.put(`/comments/${id}/approve`);
    return response.data.data;
  },

  async rejectComment(id) {
    const response = await apiClient.put(`/comments/${id}/reject`);
    return response.data.data;
  },

  async toggleLike(id) {
    const response = await apiClient.put(`/comments/${id}/like`);
    return response.data.data;
  },
};

export const categoryService = {
  async getAllCategories() {
    const response = await apiClient.get('/categories');
    return response.data.data.categories || [];
  },

  async getCategoryById(id) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  async createCategory(data) {
    const response = await apiClient.post('/categories', data);
    return response.data.data;
  },

  async updateCategory(id, data) {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data.data;
  },
};

export const tagService = {
  async getAllTags() {
    const response = await apiClient.get('/tags');
    return response.data.data.tags || [];
  },

  async getPopularTags(limit = 10) {
    const response = await apiClient.get('/tags/popular', { 
      params: { limit } 
    });
    return response.data.data.tags || [];
  },

  async createTag(data) {
    const response = await apiClient.post('/tags', data);
    return response.data.data;
  },

  async updateTag(id, data) {
    const response = await apiClient.put(`/tags/${id}`, data);
    return response.data.data;
  },

  async deleteTag(id) {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data.data;
  },
};

export const mediaService = {
  async getAllMedia() {
    const response = await apiClient.get('/media');
    return response.data.data.media || [];
  },

  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  async deleteMedia(id) {
    const response = await apiClient.delete(`/media/${id}`);
    return response.data.data;
  },

  async getMediaByType(type) {
    const response = await apiClient.get(`/media/type/${type}`);
    return response.data.data.media || [];
  },
};

export const userService = {
  async getAllUsers() {
    const response = await apiClient.get('/users');
    return response.data.data.users || [];
  },

  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },

  async updateUserRole(id, role) {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data.data;
  },

  async deactivateUser(id) {
    const response = await apiClient.put(`/users/${id}/deactivate`);
    return response.data.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data.data;
  },
};
