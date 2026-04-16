import { create } from 'zustand';
import { postService, commentService, categoryService, tagService, mediaService } from '../services/index';

export const usePostStore = create((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  fetchPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const posts = await postService.getAllPosts(params);
      set({ posts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPostById: async (id) => {
    set({ loading: true, error: null });
    try {
      const post = await postService.getPostById(id);
      set({ currentPost: post, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createPost: async (data) => {
    set({ loading: true, error: null });
    try {
      const post = await postService.createPost(data);
      set((state) => ({
        posts: [post, ...state.posts],
        loading: false,
      }));
      return post;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePost: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const post = await postService.updatePost(id, data);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? post : p)),
        currentPost: post,
        loading: false,
      }));
      return post;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await postService.deletePost(id);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export const useCommentStore = create((set) => ({
  comments: [],
  loading: false,
  error: null,

  fetchComments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const comments = await commentService.getComments(params);
      set({ comments, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createComment: async (data) => {
    try {
      const comment = await commentService.createComment(data);
      set((state) => ({
        comments: [comment, ...state.comments],
      }));
      return comment;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  approveComment: async (id) => {
    try {
      const comment = await commentService.approveComment(id);
      set((state) => ({
        comments: state.comments.map((c) => (c._id === id ? comment : c)),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoryService.getAllCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createCategory: async (data) => {
    try {
      const category = await categoryService.createCategory(data);
      set((state) => ({
        categories: [...state.categories, category],
      }));
      return category;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));

export const useTagStore = create((set) => ({
  tags: [],
  popularTags: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const tags = await tagService.getAllTags();
      set({ tags, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPopularTags: async (limit = 10) => {
    try {
      const tags = await tagService.getPopularTags(limit);
      set({ popularTags: tags });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export const useMediaStore = create((set) => ({
  media: [],
  loading: false,
  error: null,

  fetchMedia: async () => {
    set({ loading: true, error: null });
    try {
      const media = await mediaService.getAllMedia();
      set({ media, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  uploadMedia: async (file) => {
    set({ loading: true, error: null });
    try {
      const mediaFile = await mediaService.uploadMedia(file);
      set((state) => ({
        media: [mediaFile, ...state.media],
        loading: false,
      }));
      return mediaFile;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
