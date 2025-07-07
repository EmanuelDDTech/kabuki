<script setup lang="ts">
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import { useUsersStore } from '../stores/users';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CartProduct from '@/modules/cart/components/CartProduct.vue';

const users = useUsersStore();
const route = useRoute();

onMounted(async () => {
  const { userId } = route.params;

  try {
    await users.getUserById(parseInt(typeof userId === 'string' ? userId : userId[0]));
  } catch (error) {
    console.log(error);
  }
});
</script>
<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <div class="w-full max-w-2xl mx-auto">
      <RouterLink
        :to="{ name: 'adminUsers' }"
        class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
      >
        <div class="flex gap-2 items-center justify-start">
          <ArrowLeft class="w-6" />
          <p>Volver</p>
        </div>
      </RouterLink>

      <h2 class="text-2xl font-semibold mb-10">Usuario: {{ users?.userData?.name }}</h2>

      <div class="bg-white rounded">
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-semibold text-gray-700">ID:</label>
          <p class="text-gray-900">{{ users?.userData?.id }}</p>
        </div>
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-semibold text-gray-700">Email:</label>
          <p class="text-gray-900">{{ users?.userData?.email }}</p>
        </div>
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-semibold text-gray-700">Administrador:</label>
          <p class="text-gray-900">
            <span
              class="inline-block px-2 py-1 rounded-full"
              :class="
                users?.userData?.isAdmin ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              "
            >
              {{ users?.userData?.isAdmin ? 'Sí' : 'No' }}
            </span>
          </p>
        </div>
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-semibold text-gray-700">Nombre:</label>
          <p class="text-gray-900">{{ users?.userData?.name }}</p>
        </div>
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-semibold text-gray-700">Verificado:</label>
          <p class="text-gray-900">
            <span
              class="inline-block px-2 py-1 rounded-full"
              :class="
                users?.userData?.verified
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              "
            >
              {{ users?.userData?.verified ? 'Sí' : 'No' }}
            </span>
          </p>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-6 mt-10">Carrito</h3>

      <div v-if="users.emptyCart" class="text-center text-gray-700">
        No hay productos en el carrito.
      </div>

      <div v-else>
        <CartProduct
          v-for="product in users?.userData?.carts"
          :key="product.id"
          :item="product"
          :editable="false"
        />
      </div>
    </div>
  </main>
</template>
