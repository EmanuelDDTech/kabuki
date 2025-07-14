<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import { useSaleStore } from '@/modules/cart/stores/sale';
import { Period } from '@/modules/cart/interfaces/sale.interface';

// type FilterOption = 'Día' | 'Semana' | 'Mes' | 'Año';
type RawDataKey = 'day' | 'week' | 'month' | 'year';

const sales = useSaleStore();

const filterKeyMap: Record<Period, RawDataKey> = {
  Día: 'day',
  Semana: 'week',
  Mes: 'month',
  Año: 'year',
};

// Datos de ejemplo
const rawData = {
  day: [120, 200, 150, 80, 70, 110, 130],
  week: [820, 932, 901, 934, 1290, 1330, 1320],
  month: [3200, 4500, 5100, 4900, 6200, 7000],
  year: [50000, 60000, 75000, 68000, 72000],
};

const filterOptions = Period;
const selectedFilter = ref<Period>(Period.MES);

const chartRef = ref(null);
let chartInstance: ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  const dataKey = filterKeyMap[selectedFilter.value];

  const option = {
    title: {
      text: `Ventas (${selectedFilter.value})`,
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: sales.purchaseSummaryLabels,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: sales.purchaseSummaryValues,
        type: 'bar',
      },
    ],
  };
  chartInstance?.setOption(option);
};

onMounted(async () => {
  await sales.getPurchasesSummary(selectedFilter.value);
  initChart();

  const observer = new ResizeObserver(() => {
    chartInstance?.resize();
  });

  if (chartRef.value) {
    observer.observe(chartRef.value);
  }

  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });

  onBeforeUnmount(() => {
    observer.disconnect();
    window.removeEventListener('resize', () => {
      chartInstance?.resize();
    });
  });
});

watch(selectedFilter, async () => {
  await sales.getPurchasesSummary(selectedFilter.value);
  updateChart();
});
</script>
<template>
  <div>
    <div class="mb-4 flex gap-2">
      <button
        v-for="option in filterOptions"
        :key="option"
        @click="selectedFilter = option"
        :class="[
          'px-4 py-2 rounded',
          selectedFilter === option ? 'bg-blue-600 text-white' : 'bg-gray-200',
        ]"
      >
        {{ option }}
      </button>
    </div>

    <div ref="chartRef" class="w-full h-96"></div>
  </div>
</template>
