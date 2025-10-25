<template>
  <div class="verify-prices">
    <div class="page-header">
      <h2>Verify Community Prices</h2>
      <p>Help maintain accuracy by verifying submitted prices</p>
    </div>

    <div v-if="priceStore.loading" class="loading">
      Loading pending verifications...
    </div>

    <div v-else-if="priceStore.pendingPrices.length === 0" class="no-verifications card">
      <h3>No Pending Verifications</h3>
      <p>All submitted prices have been verified. Check back later!</p>
    </div>

    <div v-else class="verifications-grid">
      <div
        v-for="verification in priceStore.pendingPrices"
        :key="verification.id"
        class="verification-card card"
      >
        <div class="verification-header">
          <h3>{{ verification.product_name }}</h3>
          <span class="category-badge">{{ verification.category }}</span>
        </div>

        <div class="verification-details">
          <div class="detail-row">
            <span class="label">Supermarket:</span>
            <span class="value">
              {{ verification.logo }}
              {{ verification.supermarket_name }}
            </span>
          </div>

          <div class="detail-row">
            <span class="label">Price:</span>
            <span class="value price-value">£{{ parseFloat(verification.price).toFixed(2) }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Store Location:</span>
            <span class="value">{{ verification.store_location }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Submitted By:</span>
            <span class="value">{{ verification.submitted_by_username || 'Anonymous' }}</span>
          </div>

          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">{{ formatDate(verification.created_at) }}</span>
          </div>
        </div>

        <div v-if="verification.photo_url" class="verification-photo">
          <img :src="getImageUrl(verification.photo_url)" alt="Price verification photo" />
        </div>
        <div v-else class="no-photo">
          No photo provided
        </div>

        <div class="price-comparison-info">
          <h4>Current Verified Prices for this Product:</h4>
          <div v-if="verifiedPrices[verification.product_id]" class="current-prices">
            <div
              v-for="(price, index) in verifiedPrices[verification.product_id]"
              :key="index"
              class="current-price-item"
            >
              <span>{{ price.logo }} {{ price.supermarket_name }}</span>
              <span class="current-price">£{{ parseFloat(price.price).toFixed(2) }}</span>
            </div>
          </div>
          <div v-else class="loading-prices">Loading...</div>
        </div>

        <div class="verification-actions">
          <button
            @click="handleVerify(verification.id, true)"
            class="approve-btn"
            :disabled="verifying[verification.id]"
          >
            {{ verifying[verification.id] === 'approve' ? 'Approving...' : '✓ Approve Price' }}
          </button>
          <button
            @click="handleVerify(verification.id, false)"
            class="reject-btn"
            :disabled="verifying[verification.id]"
          >
            {{ verifying[verification.id] === 'reject' ? 'Rejecting...' : '✗ Reject Price' }}
          </button>
        </div>
      </div>
    </div>

    <div class="info-card card">
      <h3>Verification Guidelines</h3>
      <ul>
        <li>Check if the price matches recent prices from other verifications</li>
        <li>Look for photos - they help confirm accuracy</li>
        <li>Consider the store location - prices may vary by region</li>
        <li>Reject prices that seem unrealistic or too far from market rates</li>
        <li>Your verification helps maintain data quality for everyone</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { usePriceStore } from '../stores/priceStore';

const priceStore = usePriceStore();
const verifying = reactive({});
const verifiedPrices = reactive({});

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '';
  return photoUrl.startsWith('http') ? photoUrl : `${API_BASE}${photoUrl}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleVerify = async (verificationId, approved) => {
  verifying[verificationId] = approved ? 'approve' : 'reject';

  try {
    await priceStore.verifyPrice(verificationId, approved);
  } catch (err) {
    console.error('Failed to verify price:', err);
    alert('Failed to verify price. Please try again.');
  } finally {
    delete verifying[verificationId];
  }
};

const loadVerifiedPrices = async () => {
  for (const pending of priceStore.pendingPrices) {
    const product = await priceStore.getProductWithPrices(pending.product_id);
    if (product && product.prices) {
      verifiedPrices[pending.product_id] = product.prices.slice(0, 3);
    }
  }
};

onMounted(async () => {
  await priceStore.fetchPendingPrices();
  await loadVerifiedPrices();
});
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
}

.no-verifications {
  text-align: center;
  padding: 3rem;
}

.no-verifications h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.no-verifications p {
  color: #666;
}

.verifications-grid {
  display: grid;
  gap: 2rem;
}

.verification-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.verification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.verification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.verification-header h3 {
  font-size: 1.5rem;
  color: #333;
}

.category-badge {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.verification-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row .label {
  font-weight: 600;
  color: #666;
}

.detail-row .value {
  color: #333;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.verification-photo {
  margin: 1.5rem 0;
  text-align: center;
}

.verification-photo img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-photo {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  color: #999;
  font-style: italic;
  margin: 1.5rem 0;
}

.price-comparison-info {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.price-comparison-info h4 {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.current-prices {
  display: grid;
  gap: 0.5rem;
}

.current-price-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 5px;
}

.current-price {
  font-weight: 700;
  color: #667eea;
}

.loading-prices {
  text-align: center;
  color: #999;
  padding: 1rem;
}

.verification-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.approve-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}

.approve-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.reject-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.reject-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.info-card {
  margin-top: 2rem;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.info-card h3 {
  color: #e65100;
  margin-bottom: 1rem;
}

.info-card ul {
  list-style-position: inside;
  color: #555;
}

.info-card li {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

@media (max-width: 768px) {
  .verification-actions {
    grid-template-columns: 1fr;
  }
}
</style>
