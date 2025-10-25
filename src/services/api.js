import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Auth
  register(userData) {
    return api.post('/auth/register', userData);
  },
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  getProfile() {
    return api.get('/auth/profile');
  },

  // Supermarkets
  getSupermarkets() {
    return api.get('/supermarkets');
  },
  getSupermarket(id) {
    return api.get(`/supermarkets/${id}`);
  },

  // Products
  getProducts(params) {
    return api.get('/products', { params });
  },
  getProduct(id) {
    return api.get(`/products/${id}`);
  },
  createProduct(productData) {
    return api.post('/products', productData);
  },
  getCategories() {
    return api.get('/categories');
  },

  // Prices
  getPrices(params) {
    return api.get('/prices', { params });
  },
  createPrice(priceData) {
    return api.post('/prices', priceData);
  },
  getPendingPrices() {
    return api.get('/prices/pending');
  },
  verifyPrice(id, isApproved) {
    return api.post(`/prices/${id}/verify`, { isApproved });
  },

  // Price History
  getPriceHistory(params) {
    return api.get('/price-history', { params });
  },
  getProductPriceHistory(productId, days = 30) {
    return api.get(`/products/${productId}/price-history`, { params: { days } });
  },

  // File Upload
  uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
