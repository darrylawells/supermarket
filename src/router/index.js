import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddPrice from '../views/AddPrice.vue'
import VerifyPrices from '../views/VerifyPrices.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-price',
    name: 'AddPrice',
    component: AddPrice
  },
  {
    path: '/verify-prices',
    name: 'VerifyPrices',
    component: VerifyPrices
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
