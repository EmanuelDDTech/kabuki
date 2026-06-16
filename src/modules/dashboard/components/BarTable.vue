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
let resizeObserver: ResizeObserver | null = null;

const handleResize = () => {
  chartInstance?.resize();
};

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  const colors = getColors();

  const option = {
    title: {
      text: props.title,
      textStyle: {
        color: colors.primary,
        fontWeight: 700,
        fontSize: 34,
      },
    },
    textStyle: {
      color: colors.text,
    },
    grid: {
      left: 36,
      right: 22,
      top: 56,
      bottom: 34,
      containLabel: true,
    },
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.border,
      textStyle: {
        color: colors.primary,
      },
    },
    xAxis: {
      type: 'category',
      data: props.labels,
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: colors.text,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: colors.grid,
        },
      },
      axisLabel: {
        color: colors.text,
      },
    },
    series: [
      {
        data: props.values,
        type: 'bar',
        barMaxWidth: 36,
        itemStyle: {
          color: colors.accent,
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  };
  chartInstance?.setOption(option);
};

function getColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    text: styles.getPropertyValue('--gray-11').trim(),
    primary: styles.getPropertyValue('--gray-12').trim(),
    accent: styles.getPropertyValue('--green-8').trim(),
    border: styles.getPropertyValue('--gray-6').trim(),
    grid: styles.getPropertyValue('--gray-a6').trim(),
    tooltipBg: styles.getPropertyValue('--gray-2').trim(),
  };
}

onMounted(async () => {
  initChart();

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });

  if (chartRef.value) {
    resizeObserver.observe(chartRef.value);
  }

  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

watch(
  () => [props.labels, props.values, props.title],
  () => {
    updateChart();
  },
  { deep: true },
);
</script>
<template>
  <div>
    <div ref="chartRef" class="w-full h-96"></div>
  </div>
</template>
