import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePriceStore = defineStore('price', () => {
  // UK Supermarkets
  const supermarkets = ref([
    { id: 1, name: 'Tesco', logo: '🛒', color: '#00539F' },
    { id: 2, name: 'Sainsbury\'s', logo: '🛍️', color: '#EC8A00' },
    { id: 3, name: 'Asda', logo: '🏪', color: '#78BE20' },
    { id: 4, name: 'Morrisons', logo: '🏬', color: '#FFD200' },
    { id: 5, name: 'Aldi', logo: '🛒', color: '#008ECC' },
    { id: 6, name: 'Lidl', logo: '🏪', color: '#0050AA' },
    { id: 7, name: 'Waitrose', logo: '🛍️', color: '#00693E' },
    { id: 8, name: 'Co-op', logo: '🏬', color: '#00B1C9' },
    { id: 9, name: 'Iceland', logo: '❄️', color: '#ED1C24' },
    { id: 10, name: 'M&S Food', logo: '🍽️', color: '#000000' }
  ])

  // Products with prices
  const products = ref([
    {
      id: 1,
      name: 'Whole Milk (2 pints)',
      category: 'Dairy',
      prices: [
        { supermarketId: 1, price: 1.45, storeLocation: 'London, Oxford Street', verifications: 5, photos: [], lastUpdated: '2025-10-24' },
        { supermarketId: 2, price: 1.50, storeLocation: 'Manchester, Deansgate', verifications: 3, photos: [], lastUpdated: '2025-10-24' },
        { supermarketId: 3, price: 1.35, storeLocation: 'Birmingham, Bull Ring', verifications: 4, photos: [], lastUpdated: '2025-10-23' },
        { supermarketId: 5, price: 1.29, storeLocation: 'Leeds, City Centre', verifications: 7, photos: [], lastUpdated: '2025-10-25' }
      ]
    },
    {
      id: 2,
      name: 'Sliced Bread (800g)',
      category: 'Bakery',
      prices: [
        { supermarketId: 1, price: 1.10, storeLocation: 'London, Camden', verifications: 6, photos: [], lastUpdated: '2025-10-24' },
        { supermarketId: 2, price: 1.20, storeLocation: 'Glasgow, Sauchiehall Street', verifications: 2, photos: [], lastUpdated: '2025-10-23' },
        { supermarketId: 5, price: 0.89, storeLocation: 'Liverpool, City Centre', verifications: 8, photos: [], lastUpdated: '2025-10-25' },
        { supermarketId: 6, price: 0.85, storeLocation: 'Edinburgh, Princes Street', verifications: 5, photos: [], lastUpdated: '2025-10-24' }
      ]
    },
    {
      id: 3,
      name: 'Free Range Eggs (6 pack)',
      category: 'Dairy',
      prices: [
        { supermarketId: 1, price: 2.25, storeLocation: 'Bristol, Broadmead', verifications: 4, photos: [], lastUpdated: '2025-10-24' },
        { supermarketId: 3, price: 2.15, storeLocation: 'Newcastle, Eldon Square', verifications: 3, photos: [], lastUpdated: '2025-10-23' },
        { supermarketId: 4, price: 2.30, storeLocation: 'Sheffield, The Moor', verifications: 2, photos: [], lastUpdated: '2025-10-24' },
        { supermarketId: 7, price: 2.85, storeLocation: 'Oxford, Headington', verifications: 5, photos: [], lastUpdated: '2025-10-25' }
      ]
    }
  ])

  // Pending verifications
  const pendingVerifications = ref([
    {
      id: 1,
      productId: 1,
      supermarketId: 1,
      price: 1.45,
      storeLocation: 'London, King\'s Cross',
      photo: null,
      submittedBy: 'User123',
      submittedDate: '2025-10-25',
      status: 'pending'
    },
    {
      id: 2,
      productId: 2,
      supermarketId: 5,
      price: 0.89,
      storeLocation: 'Manchester, Arndale',
      photo: null,
      submittedBy: 'PriceSaver',
      submittedDate: '2025-10-25',
      status: 'pending'
    }
  ])

  // Add new product price
  const addProductPrice = (productData) => {
    const product = products.value.find(p => p.id === productData.productId)
    if (product) {
      const existingPriceIndex = product.prices.findIndex(
        p => p.supermarketId === productData.supermarketId &&
             p.storeLocation === productData.storeLocation
      )

      if (existingPriceIndex > -1) {
        product.prices[existingPriceIndex] = {
          ...productData,
          verifications: 1,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      } else {
        product.prices.push({
          ...productData,
          verifications: 1,
          lastUpdated: new Date().toISOString().split('T')[0]
        })
      }
    }
  }

  // Add new product
  const addProduct = (productData) => {
    const newProduct = {
      id: products.value.length + 1,
      ...productData,
      prices: []
    }
    products.value.push(newProduct)
    return newProduct.id
  }

  // Verify price
  const verifyPrice = (verificationId, approved) => {
    const verification = pendingVerifications.value.find(v => v.id === verificationId)
    if (verification) {
      if (approved) {
        verification.status = 'approved'
        const product = products.value.find(p => p.id === verification.productId)
        if (product) {
          const priceEntry = product.prices.find(
            p => p.supermarketId === verification.supermarketId &&
                 p.storeLocation === verification.storeLocation
          )
          if (priceEntry) {
            priceEntry.verifications++
          } else {
            product.prices.push({
              supermarketId: verification.supermarketId,
              price: verification.price,
              storeLocation: verification.storeLocation,
              verifications: 1,
              photos: verification.photo ? [verification.photo] : [],
              lastUpdated: new Date().toISOString().split('T')[0]
            })
          }
        }
      } else {
        verification.status = 'rejected'
      }
      // Remove from pending after 1 second
      setTimeout(() => {
        const index = pendingVerifications.value.findIndex(v => v.id === verificationId)
        if (index > -1) {
          pendingVerifications.value.splice(index, 1)
        }
      }, 1000)
    }
  }

  // Get cheapest price for a product
  const getCheapestPrice = (productId) => {
    const product = products.value.find(p => p.id === productId)
    if (!product || product.prices.length === 0) return null

    return product.prices.reduce((min, p) => p.price < min.price ? p : min)
  }

  // Get product with all price details
  const getProductWithPrices = (productId) => {
    const product = products.value.find(p => p.id === productId)
    if (!product) return null

    const pricesWithDetails = product.prices.map(price => ({
      ...price,
      supermarket: supermarkets.value.find(s => s.id === price.supermarketId)
    })).sort((a, b) => a.price - b.price)

    return {
      ...product,
      prices: pricesWithDetails
    }
  }

  return {
    supermarkets,
    products,
    pendingVerifications,
    addProductPrice,
    addProduct,
    verifyPrice,
    getCheapestPrice,
    getProductWithPrices
  }
})
