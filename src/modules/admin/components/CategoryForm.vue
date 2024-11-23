<template>
  <div class="max-w-2xl mx-auto">
    <RouterLink
      :to="{ name: 'adminCategories' }"
      class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <LeftArrow class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <h2 class="text-2xl font-semibold mb-6">
      {{ id ? 'Actualizar Categoría' : 'Crear Categoría' }}
    </h2>

    <FormKit
      id="createCategoryForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear la categoría, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre"
        name="name"
        placeholder="Nombre de la categoría"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="categoryStore.category.name"
      />

      <div class="flex justify-between items-center mb-3 mt-6">
        <label class="text-xl font-semibold">Grupo de Filtros</label>
        <FormKit
          type="button"
          label="Agregar grupo de filtros"
          commandfor="filter-dialog"
          command="showModal"
          id="filter-group-open"
        />
      </div>

      <div class="grid grid-cols-3 gap-3">
        <article
          v-for="group in categoryStore.selectedFilters"
          :key="group.id"
          class="border border-gray-300 text-left rounded-lg py-2 px-3 cursor-pointer hover:bg-gray-100 relative"
        >
          <h3 class="text-lg font-bold">{{ group.filter_group.name }}</h3>

          <ul>
            <li v-for="value in group.filter_group.filter_values" :key="value.id" class="text-sm">
              {{ value.name }}
            </li>
          </ul>

          <delete-icon class="absolute top-2 right-2" @click="deleteFilter(group)" />
        </article>
      </div>

      <!-- <FormKit type="hidden" name="filter-groups" v-model="categoryStore.selectedFilters" /> -->

      <FormKit type="submit">{{ !id ? 'Crear Categoría' : 'Actualizar Categoría' }}</FormKit>
    </FormKit>

    <FilterForm />
  </div>
</template>

<script lang="ts" setup>
import LeftArrow from '@/modules/icons/ArrowLeft.vue';
// import useImage from '@/composables/useImage';
// import ProductsAPI from '@/api/ProductsAPI';
import { reset } from '@formkit/vue';
import { inject, onBeforeUnmount, onBeforeMount, watch, onMounted } from 'vue';
import { useCategoryStore } from '@/modules/admin/stores/category';
import FilterForm from './FilterForm.vue';
import CategoryAPI from '../api/CategoryAPI';
import { useRouter } from 'vue-router';
import FilterCategoryAPI from '../api/FilterCategoryAPI';
import DeleteIcon from '@/modules/common/icons/DeleteIcon.vue';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const categoryStore = useCategoryStore();

const toast = inject('toast');
const router = useRouter();

onBeforeMount(async () => {
  if (props.id) {
    try {
      await categoryStore.findCategory(props.id);
      // url.value = productStore.product.image;
    } catch (error) {
      console.log(error);
    }
  }
});

onMounted(() => {
  const buttonOpen = document.querySelector('#filter-group-open');
  const filterDialog = document.querySelector('#filter-dialog');

  buttonOpen?.addEventListener('click', () => {
    filterDialog?.showModal();
  });
});

onBeforeUnmount(() => {
  categoryStore.cleanCategory();
  // url.value = null;
});

// watch(url, (newUrl, oldUrl) => {
//   productStore.product.image = newUrl;
// });

const handleSubmit = async () => {
  const { id, name } = categoryStore.category;

  try {
    if (!id) {
      const { data } = await CategoryAPI.create({ name });
      const { id: categId } = data.category;

      categoryStore.selectedFilters.forEach(async (selectedFilter) => {
        const filter_group_id = selectedFilter.filter_group.id;
        const product_category_id = categId;

        await FilterCategoryAPI.create({ filter_group_id, product_category_id });
      });

      toast.open({
        message: 'Categoria creada correctamente',
        type: 'success',
      });

      reset('createCategoryForm');
      categoryStore.cleanCategory();
      categoryStore.getCategories();

      setTimeout(() => {
        router.push({ name: 'adminCategories' });
      }, 1000);
      // url.value = null;
    } else {
      const { data } = await CategoryAPI.update(id, { name });

      categoryStore.selectedFilters.forEach(async (selectedFilter) => {
        if (selectedFilter.id) return;

        const filter_group_id = selectedFilter.filter_group.id;
        const product_category_id = id;

        await FilterCategoryAPI.create({ filter_group_id, product_category_id });
      });

      toast.open({
        message: data.msg,
        type: 'success',
      });

      reset('createCategoryForm');
      categoryStore.cleanCategory();
      categoryStore.getCategories();

      setTimeout(() => {
        router.push({ name: 'adminCategories' });
      }, 1000);
    }
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};

const deleteFilter = async (group) => {
  try {
    await categoryStore.deleteFilterCategory(group);
  } catch (error) {
    console.log(error);
  }
};
</script>
