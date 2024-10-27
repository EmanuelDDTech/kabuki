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
        type="text"
        label="SKU"
        name="sku"
        placeholder="SKU del producto"
        validation="required"
        :validation-messages="{
          required: 'El sku es obligatorio',
        }"
        v-model="productStore.product.sku"
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

      <!-- <div v-if="image" class="my-5">
        <p class="font-semibold mb-4">Imagen Producto:</p>
        <img class="w-80 mb-6" :src="productStore.product.image" />
      </div> -->

      <FormKit
        type="text"
        label="Descripción"
        name="descripcion"
        placeholder="Descripción del producto"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="productStore.product.description"
      />

      <FormKit
        type="select"
        label="Categoría"
        placeholder="-- Selecciona una categoría --"
        :options="categoryStore.categoryOptions"
        validation="required"
        :validation-messages="{
          required: 'La categoría es obligatoria',
        }"
        v-model="productStore.product.product_category_id"
      />

      <FormKit type="submit">Actualizar Producto</FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
// import useImage from '@/composables/useImage';
// import ProductsAPI from '@/api/ProductsAPI';
import { reset } from '@formkit/vue';
import { inject, onBeforeUnmount, onBeforeMount, watch } from 'vue';
import { useProductStore } from '../stores/product';
import { useCategoryStore } from '../stores/category';
import ProductAPI from '../api/ProductAPI';
import { useRouter } from 'vue-router';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const toast: any = inject('toast');
const router = useRouter();
// const { url, image, uploadImage } = useImage();

onBeforeMount(async () => {
  // if (props.id) {
  //   try {
  //     await productStore.setProduct(props.id);
  //     url.value = productStore.product.image;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
});

onBeforeUnmount(() => {
  // productStore.cleanProduct();
  // url.value = null;
});

// watch(url, (newUrl, oldUrl) => {
//   productStore.product.image = newUrl;
// });

const handleSubmit = async () => {
  try {
    if (productStore.product.id === 0) {
      const { data } = await ProductAPI.create(productStore.product);

      toast.open({
        message: 'Producto creado correctamente',
        type: 'success',
      });
      reset('createProductForm');
      productStore.cleanProduct();
      productStore.addProduct(data);
      // url.value = null;

      setTimeout(() => {
        router.push({ name: 'adminProducts' });
      }, 1000);
    } else {
      // const { data } = await ProductsAPI.update(id, productData);
      // toast.open({
      //   message: data.msg,
      //   type: 'success',
      // });
    }
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const uploadImage = () => {
  return;
};
</script>
