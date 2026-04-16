const slugify = require('slugify');
const crypto = require('crypto');

// Generate URL-friendly slug from text
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

// Paginate results
const paginate = (page = 1, limit = 10) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  if (limit > 100) limit = 100;
  if (limit < 1) limit = 10;
  if (page < 1) page = 1;
  
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// Calculate pagination metadata
const getPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Format success response
const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};

// Format error response
const errorResponse = (message, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

// Calculate reading time from text
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(readingTime, 1);
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
};

// Generate random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Extract excerpt from content
const extractExcerpt = (content, length = 200) => {
  const text = content.replace(/<[^>]*>/g, '');
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length).trim() + '...';
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  generateSlug,
  paginate,
  getPaginationMeta,
  successResponse,
  errorResponse,
  calculateReadingTime,
  sanitizeInput,
  generateToken,
  extractExcerpt,
  isValidEmail
};
