<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

interface Props {
  labels: string[];
  values: number[];
  title: string;
}

const props = defineProps<Props>();

const chartRef = ref(null);
let chartInstance: ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  const option = {
    title: {
      text: props.title,
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: props.labels,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: props.values,
        type: 'bar',
      },
    ],
  };
  chartInstance?.setOption(option);
};

onMounted(async () => {
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

watch(props, async () => {
  updateChart();
});
</script>
<template>
  <div>
    <div ref="chartRef" class="w-full h-96"></div>
  </div>
</template>
