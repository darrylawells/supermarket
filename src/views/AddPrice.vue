<template>
  <div class="add-price">
    <div class="page-header">
      <h2>Add Price Information</h2>
      <p>Help the community by adding price information for products</p>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Select Product</label>
          <select v-model="formData.productId" required>
            <option value="">Choose a product...</option>
            <option v-for="product in priceStore.products" :key="product.id" :value="product.id">
              {{ product.name }} ({{ product.category }})
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Or Add New Product</label>
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="e.g., Organic Bananas (6 pack)"
            />
          </div>
          <div class="form-group">
            <label>Category</label>
            <input
              v-model="newProduct.category"
              type="text"
              placeholder="e.g., Fruit & Veg"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Supermarket *</label>
            <select v-model="formData.supermarketId" required>
              <option value="">Choose a supermarket...</option>
              <option
                v-for="market in priceStore.supermarkets"
                :key="market.id"
                :value="market.id"
              >
                {{ market.logo }} {{ market.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Price (£) *</label>
            <input
              v-model.number="formData.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Store Location *</label>
          <input
            v-model="formData.storeLocation"
            type="text"
            placeholder="e.g., London, Oxford Street"
            required
          />
          <small>Include city and area/street for better identification</small>
        </div>

        <div class="form-group">
          <label>Upload Photo (Optional)</label>
          <div class="file-upload">
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              ref="fileInput"
            />
            <button
              type="button"
              class="upload-btn"
              @click="$refs.fileInput.click()"
            >
              Choose Photo
            </button>
            <span v-if="formData.photo">{{ formData.photo.name }}</span>
            <span v-else>No file chosen</span>
          </div>
          <small>Upload a photo of the price tag for verification</small>
        </div>

        <div v-if="photoPreview" class="photo-preview">
          <img :src="photoPreview" alt="Price photo preview" />
          <button type="button" @click="removePhoto" class="remove-photo">
            Remove Photo
          </button>
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success">
          {{ successMessage }}
        </div>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Price' }}
        </button>
      </form>
    </div>

    <div class="info-card card">
      <h3>Tips for Adding Prices</h3>
      <ul>
        <li>Make sure the price is current and accurate</li>
        <li>Include the exact store location for better tracking</li>
        <li>Photos help verify prices and build trust in the community</li>
        <li>Check if the product already exists before creating a new one</li>
        <li>Prices are verified by the community before being fully approved</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { usePriceStore } from '../stores/priceStore'

const priceStore = usePriceStore()

const formData = reactive({
  productId: '',
  supermarketId: '',
  price: null,
  storeLocation: '',
  photo: null
})

const newProduct = reactive({
  name: '',
  category: ''
})

const photoPreview = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)
const fileInput = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 5MB'
      return
    }

    formData.photo = file

    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    errorMessage.value = ''
  }
}

const removePhoto = () => {
  formData.photo = null
  photoPreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = () => {
  errorMessage.value = ''
  successMessage.value = ''

  let productId = formData.productId

  // Check if creating a new product
  if (newProduct.name && newProduct.category) {
    productId = priceStore.addProduct({
      name: newProduct.name,
      category: newProduct.category
    })
  }

  if (!productId) {
    errorMessage.value = 'Please select a product or add a new one'
    return
  }

  if (!formData.supermarketId || !formData.price || !formData.storeLocation) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  isSubmitting.value = true

  // Simulate API call
  setTimeout(() => {
    priceStore.addProductPrice({
      productId: productId,
      supermarketId: formData.supermarketId,
      price: formData.price,
      storeLocation: formData.storeLocation,
      photos: formData.photo ? [formData.photo.name] : []
    })

    successMessage.value = 'Price submitted successfully! Thank you for contributing.'

    // Reset form
    formData.productId = ''
    formData.supermarketId = ''
    formData.price = null
    formData.storeLocation = ''
    formData.photo = null
    newProduct.name = ''
    newProduct.category = ''
    photoPreview.value = null

    if (fileInput.value) {
      fileInput.value.value = ''
    }

    isSubmitting.value = false

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }, 1000)
}
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

small {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-upload input[type="file"] {
  display: none;
}

.upload-btn {
  background: #f0f0f0;
  color: #333;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.upload-btn:hover {
  background: #e0e0e0;
}

.photo-preview {
  margin-top: 1rem;
  text-align: center;
}

.photo-preview img {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.remove-photo {
  margin-top: 1rem;
  background: #e74c3c;
  font-size: 0.9rem;
}

.remove-photo:hover {
  background: #c0392b;
}

.info-card {
  margin-top: 2rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.info-card h3 {
  color: #1976d2;
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
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
