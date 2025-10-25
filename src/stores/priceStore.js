import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const usePriceStore = defineStore('price', () => {
  const supermarkets = ref([]);
  const products = ref([]);
  const categories = ref([]);
  const pendingPrices = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch all supermarkets
  const fetchSupermarkets = async () => {
    try {
      loading.value = true;
      const response = await api.getSupermarkets();
      supermarkets.value = response.data.supermarkets;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch supermarkets';
      console.error('Fetch supermarkets error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch all products with optional filters
  const fetchProducts = async (filters = {}) => {
    try {
      loading.value = true;
      const response = await api.getProducts(filters);
      products.value = response.data.products;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch products';
      console.error('Fetch products error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      categories.value = response.data.categories;
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  // Get product with prices
  const getProductWithPrices = async (productId) => {
    try {
      const response = await api.getProduct(productId);
      return response.data.product;
    } catch (err) {
      console.error('Get product error:', err);
      return null;
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      const response = await api.createProduct(productData);
      products.value.push(response.data.product);
      return response.data.product.id;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to create product';
      throw err;
    }
  };

  // Add new price
  const addProductPrice = async (priceData) => {
    try {
      const response = await api.createPrice(priceData);
      return response.data.price;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to add price';
      throw err;
    }
  };

  // Fetch pending prices for verification
  const fetchPendingPrices = async () => {
    try {
      loading.value = true;
      const response = await api.getPendingPrices();
      pendingPrices.value = response.data.prices;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch pending prices';
      console.error('Fetch pending prices error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Verify price
  const verifyPrice = async (priceId, isApproved) => {
    try {
      await api.verifyPrice(priceId, isApproved);
      // Remove from pending list
      pendingPrices.value = pendingPrices.value.filter(p => p.id !== priceId);
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to verify price';
      throw err;
    }
  };

  // Get price history
  const getPriceHistory = async (productId, supermarketId, days = 30) => {
    try {
      const response = await api.getPriceHistory({ productId, supermarketId, days });
      return response.data.history;
    } catch (err) {
      console.error('Get price history error:', err);
      return [];
    }
  };

  // Get product price history (all supermarkets)
  const getProductPriceHistory = async (productId, days = 30) => {
    try {
      const response = await api.getProductPriceHistory(productId, days);
      return response.data.history;
    } catch (err) {
      console.error('Get product price history error:', err);
      return [];
    }
  };

  return {
    supermarkets,
    products,
    categories,
    pendingPrices,
    loading,
    error,
    fetchSupermarkets,
    fetchProducts,
    fetchCategories,
    getProductWithPrices,
    addProduct,
    addProductPrice,
    fetchPendingPrices,
    verifyPrice,
    getPriceHistory,
    getProductPriceHistory
  };
});
