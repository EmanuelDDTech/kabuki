<template>
  <div class="max-w-2xl mx-auto">
    <RouterLink
      :to="{ name: 'adminProducts' }"
      class="inline-block mb-4 text-red-600 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <LeftArrow class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold mb-6">
        {{ product.id === 0 ? 'Crear Producto' : 'Actualizar Producto' }}
      </h2>
      <SwitchButton
        :id="product.id"
        :value="product.active"
        :disabled="false"
        @toggle="product.active = !product.active"
      />
    </div>

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
        v-model="product.name"
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
        v-model="product.sku"
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
        v-model="product.price"
      />

      <FormKit
        type="number"
        label="Peso (Kg)"
        name="weight"
        min="0"
        number="float"
        step="any"
        placeholder="Peso del producto"
        validation="required"
        :validation-messages="{
          required: 'El peso es obligatorio',
        }"
        v-model="product.weight"
      />

      <div class="flex gap-6 items-start">
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
          v-model="product.stock"
        />

        <FormKit
          type="checkbox"
          label="Stock Visible"
          name="stockVisible"
          v-model="product.stock_visible"
          wrapper-class="flex flex-col-reverse items-center justify-centery gap-3 "
          label-class="!mt-0"
          input-class="!w-4 !h-4 cursor-pointer"
        />
      </div>

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
          v-for="image in product.gallery"
          :key="image.url"
          class="relative draggable-item border-solid flex-1 flex aspect-square border border-shori-gray-6 text-shori-gray-11 justify-center items-center"
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
          v-for="i in 5 - product.gallery.length"
          :key="i"
          class="border-dashed flex-1 flex aspect-square border border-shori-gray-6 text-shori-gray-11 justify-center items-center"
        >
          <ImageIcon class="w-12" />
        </article>
      </div>

      <!-- <FormKit
        type="text"
        label="Descripción"
        name="descripcion"
        placeholder="Descripción del producto"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="product.description"
      /> -->

      <div class="mb-2">
        <label class="block text-shori-gray-11 mb-2">Descripción</label>

        <QuillEditor theme="snow" ref="myEditor" content-type="html" />
      </div>

      <FormKit
        type="select"
        label="Categoría"
        placeholder="-- Selecciona una categoría --"
        :options="categoryStore.categoryOptions"
        validation="required"
        :validation-messages="{
          required: 'La categoría es obligatoria',
        }"
        v-model="product.product_category_id"
      />

      <div v-if="product.product_category_id !== 0" class="flex flex-col gap-6 mt-6">
        <div v-for="filter in filterCategory.filters" :key="filter.id">
          <h3 class="font-bold">{{ filter.filter_group.name }}</h3>
          <ul class="grid grid-cols-3 gap-2 mt-3">
            <li
              v-for="filterValue in filter.filter_group.filter_values"
              :key="filterValue.id"
              class="flex justify-center items-center text-center border py-1 px-2 rounded-md hover:cursor-pointer"
              :class="
                product.filters.includes(filterValue.id)
                  ? 'border-blue-500 text-white bg-blue-500'
                  : 'border-shori-gray-6 text-shori-gray-11'
              "
              @click="product.selectFilter(filterValue.id)"
            >
              {{ filterValue.name }}
            </li>
          </ul>
        </div>
      </div>

      <FormKit type="submit">{{
        product.id === 0 ? 'Crear Producto' : 'Actualizar Producto'
      }}</FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { reset } from '@formkit/vue';
import { Sortable } from '@shopify/draggable';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ProductGalleryAPI from '../api/ProductGalleryAPI';
import { useProductStore } from '@/modules/product/stores/product';
import { useCategoryStore } from '../../admin/stores/category';
import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';
import useImage from '@/modules/products/composables/useImage';
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
import ImageIcon from '@/modules/common/icons/ImageIcon.vue';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';
import SwitchButton from '@/modules/common/components/SwitchButton.vue';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const product = useProductStore();
const categoryStore = useCategoryStore();
const filterCategory = useFilterCategoryStore();

const { onFileChange, images, deleteImage, updateOrder, deleteImageAll } = useImage();

const toast: any = inject('toast');
const route = useRoute();
const router = useRouter();

const myEditor = ref<string | null>(null);

onMounted(() => {
  const sortable = new Sortable(document.querySelector('#draggable'), {
    draggable: '.draggable-item',
    handle: '.handle',
  });

  sortable.on('sortable:stop', (e) => saveSortedImages(e));
});

onMounted(() => {
  const { id } = route.params;

  if (!id) return;

  product.findProduct(id);
});

onMounted(() => {
  // const editor: HTMLElement | null = document.getElementById('editor');
});

onUnmounted(() => {
  if (product.id === 0) {
    deleteImageAll();
  }
  product.cleanProduct();
});

const handleSubmit = async () => {
  product.description = myEditor.value?.getHTML();

  try {
    if (product.id === 0) {
      const productData = {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        weight: product.weight,
        discount: product.discount,
        stock: product.stock,
        stock_visible: product.stock_visible,
        product_category_id: product.product_category_id,
        active: product.active,
      };
      const data = await product.create(productData);
      await ProductGalleryAPI.create({
        product_id: data.id,
        images: product.gallery,
      });
      await product.saveFilters();

      reset('createProductForm');

      toast.open({
        message: 'Producto creado correctamente',
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminProducts' });
      }, 1000);
    } else {
      const productData = {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        weight: product.weight,
        discount: product.discount,
        stock: product.stock,
        stock_visible: product.stock_visible,
        product_category_id: product.product_category_id,
        active: product.active,
      };

      console.log(productData);

      const data = await product.update(productData);
      await product.saveFilters();

      toast.open({
        message: data.msg,
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminProducts' });
      }, 1000);
    }
  } catch (error: any) {
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

watch(
  () => product.description,
  (newValue) => {
    myEditor.value.setHTML(newValue);
  },
);
</script>
