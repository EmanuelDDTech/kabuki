<template>
  <article
    class="relative max-w-72 min-w-36 bg-shori-gray-2 shadow-md rounded-3xl p-2 cursor-pointer border border-shori-gray-6"
  >
    <div
      class="aspect-[4/3] overflow-x-hidden rounded-2xl relative flex items-center justify-center"
    >
      <img class="h-4/5" :src="campaignProduct.product.product_galleries[0].url" />
    </div>
    <div class="mt-4 pl-2 mb-2 justify-between">
      <p class="font-normal text-shori-gray-12 mb-5">
        {{ campaignProduct.product.name }}
      </p>
      <div class="flex flex-col items-start relative">
        <p class="text-xl text-shori-gray-12 font-bold mt-0">
          {{ formatCurrency(campaignProduct.product.price) }}
        </p>
        <p v-if="!isEditing" class="text-base text-shori-gray-11 line-through font-normal mt-0">
          {{ formatCurrency(campaignProduct.campaign_price) }}
        </p>
      </div>
    </div>

    <FormKit
      id="createBannerForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear el banner, revisa las notificaciones"
      @submit="updatePrice"
      v-if="isEditing"
    >
      <FormKit
        type="number"
        label="Nuevo precio"
        name="campaign_price"
        step="1"
        min="0"
        @focusout="updatePrice"
        @keydown.enter.prevent="updatePrice"
      />
    </FormKit>

    <EditIcon
      class="w-8 aspect-square p-1 rounded-full hover:bg-shori-gray-3 hover:text-blue-600 absolute top-3 right-3"
      @click="editPrice"
    />
    <DeleteIcon class="absolute right-3 top-12" @click="emit('delete')" />
  </article>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/helpers';
import { useCartStore } from '@/modules/cart/stores/cart';
import { inject, ref } from 'vue';
import EditIcon from '@/modules/common/icons/EditIcon.vue';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';

const cart = useCartStore();

const toast = inject('toast');

interface Props {
  campaignProduct: object;
}

const props = defineProps<Props>();
const isEditing = ref(false);

const emit = defineEmits(['editPrice', 'delete']);

const defaultProduct = {
  url: 'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/products%2F04da6c7dd79.jpg?alt=media&token=a77642f5-7194-4256-b4cd-bc6dfef5b897',
  id: 1,
  price: 100,
};

const router = useRouter();

let lastEventType = '';

const updatePrice = async (event) => {
  if (lastEventType === 'enter' && event.type === 'focusout') {
    return; // Evita la ejecución doble
  }

  emit('editPrice', {
    new_price: event.target.value,
    product_id: props.campaignProduct.product.id,
  });
  isEditing.value = false;
  lastEventType = event.type === 'keydown' ? 'enter' : 'focusout';
};

const editPrice = async () => {
  isEditing.value = true;
};
</script>
