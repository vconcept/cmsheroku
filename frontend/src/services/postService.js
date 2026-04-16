import apiClient from './apiClient';

export const postService = {
  async getAllPosts(params = {}) {
    const response = await apiClient.get('/posts', { params });
    return response.data.data.posts || [];
  },

  async getPostById(id) {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data.data.post;
  },

  async createPost(data) {
    const response = await apiClient.post('/posts', data);
    return response.data.data.post;
  },

  async updatePost(id, data) {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data.data.post;
  },

  async deletePost(id) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data.data;
  },

  async getFeaturedPosts() {
    const response = await apiClient.get('/posts', { 
      params: { is_featured: true, limit: 5 } 
    });
    return response.data.data.posts || [];
  },

  async searchPosts(query) {
    const response = await apiClient.get('/posts', { 
      params: { search: query } 
    });
    return response.data.data.posts || [];
  },
};
