<template>
  <div id="app">
    <header>
      <nav>
        <div class="container">
          <div class="nav-header">
            <h1>UK Supermarket Price Comparison</h1>
            <div class="nav-right">
              <div class="nav-links">
                <router-link to="/">Home</router-link>
                <router-link v-if="authStore.isAuthenticated" to="/add-price">Add Price</router-link>
                <router-link v-if="authStore.isAuthenticated" to="/verify-prices">Verify Prices</router-link>
              </div>
              <div class="auth-section">
                <div v-if="authStore.isAuthenticated" class="user-menu">
                  <span class="username">{{ authStore.user?.username }}</span>
                  <button @click="handleLogout" class="logout-btn">Logout</button>
                </div>
                <div v-else class="auth-links">
                  <router-link to="/login" class="auth-link">Login</router-link>
                  <router-link to="/register" class="auth-link">Register</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="container">
      <router-view />
    </main>
    <footer>
      <div class="container">
        <p>&copy; 2025 UK Supermarket Price Comparison - Community Verified Prices</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

header h1 {
  font-size: 1.8rem;
  margin: 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: white;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.auth-links {
  display: flex;
  gap: 1rem;
}

.auth-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.3s;
}

.auth-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 968px) {
  .nav-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

main {
  flex: 1;
  padding: 2rem 0;
}

footer {
  background: #333;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}
</style>
