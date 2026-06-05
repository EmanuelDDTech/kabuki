<script setup lang="ts">
import { onMounted } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import AddressSelectionSection from '../components/AddressSelectionSection.vue';
import DeliveryMethodSection from '../components/DeliveryMethodSection.vue';
import SideBard from '../components/SideBard.vue';
import { useAddressStore } from '../stores/address';
import { useCartStore } from '../stores/cart';
import { useDeliveryStore } from '../stores/delivery';

const address = useAddressStore();
const cart = useCartStore();
const delivery = useDeliveryStore();
const router = useRouter();

onMounted(async () => {
  if (cart.isEmpty) {
    router.push({ name: 'cart' });
    return;
  }

  await address.getAddresses();
});

onBeforeRouteLeave((to) => {
  if (to.name !== 'pay') {
    address.clearSelectedAddress();
    delivery.clearSelectedAddress();
  }
});
</script>

<template>
  <main class="min-h-screen px-3 mb-8">
    <div class="max-w-screen-xl mx-auto block lg:flex gap-10 mt-8">
      <div class="flex-1">
        <AddressSelectionSection />
        <DeliveryMethodSection />
      </div>

      <SideBard checkout-step="delivery" />
    </div>
  </main>
</template>
