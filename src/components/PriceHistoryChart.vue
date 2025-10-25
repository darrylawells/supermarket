<template>
  <div class="price-history-chart">
    <div class="chart-header">
      <h3>Price History - {{ productName }}</h3>
      <div class="chart-controls">
        <select v-model="selectedDays" @change="loadHistory">
          <option :value="7">Last 7 days</option>
          <option :value="14">Last 14 days</option>
          <option :value="30">Last 30 days</option>
          <option :value="60">Last 60 days</option>
          <option :value="90">Last 90 days</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading price history...</div>

    <div v-else-if="!chartData" class="no-data">
      <p>No price history data available for this product.</p>
    </div>

    <div v-else class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { usePriceStore } from '../stores/priceStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    default: 'Product'
  }
});

const priceStore = usePriceStore();

const loading = ref(false);
const selectedDays = ref(30);
const historyData = ref([]);

const chartData = computed(() => {
  if (!historyData.value || historyData.value.length === 0) {
    return null;
  }

  // Group data by supermarket
  const supermarketData = {};

  historyData.value.forEach(entry => {
    const supermarketId = entry.supermarket_id;
    const supermarketName = entry.supermarket_name;

    if (!supermarketData[supermarketId]) {
      supermarketData[supermarketId] = {
        label: supermarketName,
        data: [],
        dates: [],
        borderColor: entry.color || '#667eea',
        backgroundColor: entry.color || '#667eea',
        tension: 0.3
      };
    }

    supermarketData[supermarketId].data.push(parseFloat(entry.price));
    supermarketData[supermarketId].dates.push(new Date(entry.recorded_at));
  });

  // Get all unique dates
  const allDates = [...new Set(historyData.value.map(e =>
    new Date(e.recorded_at).toLocaleDateString('en-GB')
  ))].sort((a, b) => {
    const dateA = a.split('/').reverse().join('-');
    const dateB = b.split('/').reverse().join('-');
    return new Date(dateA) - new Date(dateB);
  });

  // Convert to chart format
  const datasets = Object.values(supermarketData).map(market => ({
    label: market.label,
    data: allDates.map(date => {
      const index = market.dates.findIndex(d =>
        d.toLocaleDateString('en-GB') === date
      );
      return index >= 0 ? market.data[index] : null;
    }),
    borderColor: market.borderColor,
    backgroundColor: market.backgroundColor,
    tension: market.tension,
    spanGaps: true
  }));

  return {
    labels: allDates,
    datasets: datasets
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': £' + context.parsed.y.toFixed(2);
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: function(value) {
          return '£' + value.toFixed(2);
        }
      }
    }
  }
};

const loadHistory = async () => {
  loading.value = true;
  try {
    const data = await priceStore.getProductPriceHistory(props.productId, selectedDays.value);
    historyData.value = data;
  } catch (error) {
    console.error('Failed to load price history:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.price-history-chart {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  color: #333;
  margin: 0;
}

.chart-controls select {
  width: auto;
  padding: 0.5rem 1rem;
}

.chart-container {
  position: relative;
  width: 100%;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #999;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .chart-controls select {
    width: 100%;
  }
}
</style>
