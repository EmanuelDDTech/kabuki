import SaleAPI from '@/modules/cart/api/SaleAPI';
import { Period } from '@/modules/cart/interfaces/sale.interface';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSaleSummaryStore = defineStore('saleSymmary', () => {
  const saleSummary = ref({
    data: [],
    labels: [],
    values: [],
  });

  const periodOptions = ref<Period[]>([Period.DIA, Period.SEMANA, Period.MES, Period.AÑO]);
  const selectedOption = ref<Period>(Period.MES);

  const loading = ref(false);

  const getSalesSummary = async (period: Period) => {
    try {
      loading.value = true;
      const labels: any = [];
      const values: any = [];
      const summaryData: any = [];
      if (period === Period.AÑO) {
        const { data } = await SaleAPI.getByYear();

        data.forEach((summary: any) => {
          labels.push(summary.year);
          values.push(summary.total);
          summaryData.push(summary);
        });
      } else if (period === Period.MES) {
        const { data } = await SaleAPI.getByMonth();

        data.forEach((summary: any) => {
          labels.push(summary.month);
          values.push(summary.total);
          summaryData.push(summary);
        });
      } else if (period === Period.SEMANA) {
        const { data } = await SaleAPI.getByWeek();

        data.forEach((summary: any) => {
          labels.push(summary.week);
          values.push(summary.total);
          summaryData.push(summary);
        });
      } else if (period === Period.DIA) {
        const { data } = await SaleAPI.getByDay();

        data.forEach((summary: any) => {
          labels.push(summary.day);
          values.push(summary.total);
          summaryData.push(summary);
        });
      }

      saleSummary.value = { data: summaryData, labels, values };
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const selectPeriod = async (period: Period) => {
    selectedOption.value = period;
    try {
      await getSalesSummary(period);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    periodOptions,
    selectedOption,

    // Methods
    getSalesSummary,
    selectPeriod,

    // Getters
    saleSummary: computed(() => saleSummary.value),
    saleSummaryLabels: computed(() => [...saleSummary.value.labels]),
    saleSummaryValues: computed(() => [...saleSummary.value.values]),
    saleSummaryTotal: computed(() =>
      saleSummary.value.values.reduce((acc, summary) => {
        return acc + summary;
      }, 0),
    ),
  };
});
