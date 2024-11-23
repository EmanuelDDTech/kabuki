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
        multiple="true"
        @change="onFileChange"
      />

      <!-- <div>
        <p class="font-semibold mb-4">Imagen Producto:</p>
        <div class="flex gap-1 cursor-grab">
          <article v-for="image in images" class="my-5" :key="image.order">
            <img class="w-80 mb-6" :src="image.url" />
          </article>
        </div>
      </div> -->

      <div id="draggable" class="grid grid-cols-5 gap-2 cursor-grab mb-4">
        <article
          v-for="image in images"
          :key="image.url"
          class="relative draggable-item border-solid flex-1 flex aspect-square border border-gray-300 text-gray-300 justify-center items-center"
        >
          <div>
            <img :src="image.url" class="handle w-full aspect-square max-w-32" />
            <DeleteIcon
              class="cursor-pointer absolute top-0 right-0"
              @click="deleteImage(image.url)"
            />
          </div>
        </article>

        <article
          v-for="i in 5 - images.length"
          :key="i"
          class="border-dashed flex-1 flex aspect-square border border-gray-300 text-gray-300 justify-center items-center"
        >
          <ImageIcon class="w-12" />
        </article>
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

      <FormKit type="submit">Crear Producto</FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import { reset } from '@formkit/vue';
import { inject, onMounted, onUnmounted } from 'vue';
import { Sortable } from '@shopify/draggable';
import { useProductStore } from '../stores/product';
import { useCategoryStore } from '../stores/category';
import { useRouter } from 'vue-router';
import useImage from '@/modules/products/composables/useImage';
import ImageIcon from '@/modules/common/icons/ImageIcon.vue';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';
import ProductGalleryAPI from '../api/ProductGalleryAPI';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const { onFileChange, images, deleteImage, updateOrder, deleteImageAll } = useImage();

const toast: any = inject('toast');
const router = useRouter();

onMounted(() => {
  const sortable = new Sortable(document.querySelector('#draggable'), {
    draggable: '.draggable-item',
    handle: '.handle',
  });

  sortable.on('sortable:stop', (e) => saveSortedImages(e));
});

onUnmounted(() => {
  if (productStore.product.id === 0) {
    deleteImageAll();
  }
  productStore.cleanProduct();
  productStore.getProducts();
});

const handleSubmit = async () => {
  try {
    if (productStore.product.id === 0) {
      const { id, ...productData } = productStore.product;
      const data = await productStore.create(productData);
      await ProductGalleryAPI.create({
        product_id: data.id,
        images: images.value,
      });

      reset('createProductForm');

      toast.open({
        message: 'Producto creado correctamente',
        type: 'success',
      });

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
    console.log(error);
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const saveSortedImages = async (e) => {
  setTimeout(() => {
    const imagesElements = document.querySelectorAll('#draggable .draggable-item img');
    const imagesOrder = [];

    imagesElements.forEach((imageElement, index) => {
      const url = imageElement.src;
      const order = index + 1;
      imagesOrder.push({ order, url });
    });

    updateOrder(imagesOrder);
  }, 50);
};
</script>
