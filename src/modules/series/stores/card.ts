import { defineStore } from 'pinia';
import { computed, inject, ref } from 'vue';
import type { Card } from '../interfaces';
import { getCardByIdAction } from '../actions/get-card-by-id.action';

export const useCardStore = defineStore('card', () => {
  const card = ref<Card | null>(null);
  const isLoading = ref(true);

  const toast: any = inject('toast');

  async function getCardById(cardId: string) {
    isLoading.value = true;

    try {
      const data = await getCardByIdAction(cardId);
      card.value = data;
    } catch (error) {
      toast.error('Error al obtener la información de la carta');
    } finally {
      isLoading.value = false;
    }
  }

  async function clearCardInfo() {
    card.value = null;
  }

  return {
    // State
    card,
    isLoading,

    // Methods
    getCardById,
    clearCardInfo,

    // Getters
    cardData: computed(() => card.value),
  };
});
