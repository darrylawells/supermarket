<template>
  <div class="auth-page">
    <div class="auth-card card">
      <h2>Login to Your Account</h2>
      <p class="subtitle">Access price comparisons and contribute to the community</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <input
            v-model="credentials.username"
            type="text"
            placeholder="Enter your username"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="credentials.password"
            type="password"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
      </div>

      <div class="demo-info">
        <h3>Demo Credentials</h3>
        <p><strong>Username:</strong> demo_user</p>
        <p><strong>Password:</strong> password123</p>
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

const credentials = reactive({
  username: '',
  password: ''
});

const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';

  const result = await authStore.login(credentials);

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

.demo-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.demo-info h3 {
  color: #667eea;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.demo-info p {
  font-size: 0.85rem;
  color: #555;
  margin: 0.25rem 0;
}
</style>
