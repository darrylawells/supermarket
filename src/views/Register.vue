<template>
  <div class="auth-page">
    <div class="auth-card card">
      <h2>Create an Account</h2>
      <p class="subtitle">Join the community and start comparing prices</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="Choose a username"
            required
            minlength="3"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Create a password"
            required
            minlength="6"
            autocomplete="new-password"
          />
          <small>Password must be at least 6 characters</small>
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errorMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';

  // Validation
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  if (formData.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }

  const result = await authStore.register({
    username: formData.username,
    email: formData.email,
    password: formData.password
  });

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.error;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 300px);
  padding: 2rem 0;
}

.auth-card {
  max-width: 450px;
  width: 100%;
}

.auth-card h2 {
  color: #667eea;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

small {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
