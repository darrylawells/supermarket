<template>
  <div id="app">
    <header>
      <nav>
        <div class="container">
          <h1>UK Supermarket Price Comparison</h1>
          <div class="nav-links">
            <router-link to="/">Home</router-link>
            <router-link to="/add-price">Add Price</router-link>
            <router-link to="/verify-prices">Verify Prices</router-link>
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

header h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
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
