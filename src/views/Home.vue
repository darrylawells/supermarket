<template>
  <div class="home">
    <div class="hero">
      <h2>Compare Prices Across Top UK Supermarkets</h2>
      <p>Community-verified prices to help you save money on your shopping</p>
    </div>

    <div class="search-section card">
      <div class="form-group">
        <label>Search Products</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for products..."
        />
      </div>
      <div class="form-group">
        <label>Filter by Category</label>
        <select v-model="selectedCategory">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <div class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card card"
      >
        <div class="product-header">
          <h3>{{ product.name }}</h3>
          <span class="category-badge">{{ product.category }}</span>
        </div>

        <div class="price-comparison">
          <div
            v-for="(priceEntry, index) in product.prices"
            :key="index"
            class="price-entry"
            :class="{ 'cheapest': index === 0 }"
          >
            <div class="supermarket-info">
              <span class="supermarket-logo">{{ priceEntry.supermarket.logo }}</span>
              <div>
                <div class="supermarket-name">{{ priceEntry.supermarket.name }}</div>
                <div class="store-location">{{ priceEntry.storeLocation }}</div>
              </div>
            </div>
            <div class="price-info">
              <div class="price">£{{ priceEntry.price.toFixed(2) }}</div>
              <div class="verifications">
                ✓ {{ priceEntry.verifications }} verifications
              </div>
              <div class="last-updated">
                Updated: {{ formatDate(priceEntry.lastUpdated) }}
              </div>
            </div>
            <div v-if="index === 0" class="best-price-badge">
              BEST PRICE
            </div>
          </div>
        </div>

        <div v-if="product.prices.length === 0" class="no-prices">
          No prices available yet. Be the first to add one!
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="no-results">
      <p>No products found. Try adjusting your search or filters.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePriceStore } from '../stores/priceStore'

const priceStore = usePriceStore()
const searchQuery = ref('')
const selectedCategory = ref('')

const categories = computed(() => {
  const cats = new Set(priceStore.products.map(p => p.category))
  return Array.from(cats)
})

const filteredProducts = computed(() => {
  let filtered = priceStore.products

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  return filtered.map(product => priceStore.getProductWithPrices(product.id))
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-GB')
}
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero h2 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.search-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  gap: 1.5rem;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.product-header h3 {
  font-size: 1.5rem;
  color: #333;
}

.category-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.price-comparison {
  display: grid;
  gap: 1rem;
}

.price-entry {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.price-entry:hover {
  background: #f0f0f0;
}

.price-entry.cheapest {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left-color: #4caf50;
}

.supermarket-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.supermarket-logo {
  font-size: 2rem;
}

.supermarket-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
}

.store-location {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.price-info {
  text-align: right;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.verifications {
  font-size: 0.85rem;
  color: #4caf50;
  margin-top: 0.25rem;
}

.last-updated {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

.best-price-badge {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.no-prices {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #999;
}

@media (max-width: 768px) {
  .search-section {
    grid-template-columns: 1fr;
  }

  .price-entry {
    grid-template-columns: 1fr;
  }

  .price-info {
    text-align: left;
  }

  .hero h2 {
    font-size: 1.8rem;
  }
}
</style>
