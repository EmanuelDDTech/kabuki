<template>
  <div class="max-w-2xl mx-auto">
    <RouterLink
      :to="{ name: 'adminProducts' }"
      class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <LeftArrow class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <h2 class="text-2xl font-semibold mb-6">Crear Producto</h2>

    <FormKit
      id="createProductForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear el producto, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre"
        name="name"
        placeholder="Nombre del producto"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="productStore.product.name"
      />

      <FormKit
        type="number"
        label="Precio"
        name="price"
        min="0"
        placeholder="Precio del producto"
        validation="required"
        :validation-messages="{
          required: 'El precio es obligatorio',
        }"
        v-model="productStore.product.price"
      />

      <FormKit
        type="number"
        label="Cantidad"
        name="stock"
        placeholder="Cantidad de producto"
        validation="required"
        :validation-messages="{
          required: 'La cantidad es obligatoria',
        }"
        step="1"
        v-model="productStore.product.stock"
      />

      <FormKit
        type="file"
        name="image"
        label="Imagen"
        accept=".jpg, .webp, .png, .avif"
        multiple="false"
        @change="uploadImage"
      />

      <div v-if="image" class="my-5">
        <p class="font-semibold mb-4">Imagen Producto:</p>
        <img class="w-80 mb-6" :src="productStore.product.image" />
      </div>

      <FormKit
        type="text"
        label="Descripción"
        name="descripcion"
        placeholder="Descripción del producto"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="productStore.product.descripcion"
      />

      <FormKit type="submit">{{
        productStore.product.id === '' ? 'Crear Producto' : 'Actualizar Producto'
      }}</FormKit>
    </FormKit>
  </div>
</template>

<script setup>
import LeftArrow from '@/components/Icons/LeftArrow.vue';
import useImage from '@/composables/useImage';
import ProductsAPI from '@/api/ProductsAPI';
import { reset } from '@formkit/vue';
import { inject, onBeforeUnmount, onBeforeMount, watch } from 'vue';
import { useProductStore } from '@/stores/products';

const productStore = useProductStore();
// const { product, setProduct, cleanProduct } = useProductStore();
const toast = inject('toast');
const { url, image, uploadImage } = useImage();

const props = defineProps({
  id: {
    type: String,
  },
});

onBeforeMount(async () => {
  if (props.id) {
    try {
      await productStore.setProduct(props.id);
      url.value = productStore.product.image;
    } catch (error) {
      console.log(error);
    }
  }
});

onBeforeUnmount(() => {
  productStore.cleanProduct();
  url.value = null;
});

watch(url, (newUrl, oldUrl) => {
  productStore.product.image = newUrl;
});

const handleSubmit = async () => {
  const { id, ...productData } = productStore.product;

  try {
    if (!id) {
      const { data } = await ProductsAPI.create(productData);

      toast.open({
        message: data.msg,
        type: 'success',
      });

      reset('createProductForm');
      url.value = null;
    } else {
      const { data } = await ProductsAPI.update(id, productData);

      toast.open({
        message: data.msg,
        type: 'success',
      });
    }
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>
