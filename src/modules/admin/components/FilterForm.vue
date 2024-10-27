<template>
  <dialog id="filter-dialog" class="w-[600px] rounded-lg h-96 p-4">
    <h2 class="text-xl font-semibold mb-6">Selecciona un filtro</h2>

    <div class="grid grid-cols-3 gap-3 mb-6">
      <article
        v-for="group in filterStore.filterGroups"
        :key="group.id"
        class="border border-gray-300 text-left rounded-lg py-2 px-3 cursor-pointer hover:bg-gray-100"
        @click="selectFilter(group)"
      >
        <h3 class="text-lg font-bold">{{ group.name }}</h3>

        <ul>
          <li v-for="value in group.filter_values" :key="value.id" class="text-sm">
            {{ value.name }}
          </li>
        </ul>
      </article>
    </div>

    <button
      id="filter-group-close"
      class="border border-gray-400 hover:bg-gray-100 rounded-lg text-black w-auto p-2"
    >
      Cerrar
    </button>
  </dialog>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useFilterStore } from '../stores/filter';
import { useCategoryStore } from '../stores/category';

const filterStore = useFilterStore();
const categoryStore = useCategoryStore();

onMounted(() => {
  const buttonClose = document.querySelector('#filter-group-close');
  const filterDialog = document.querySelector('#filter-dialog');

  buttonClose?.addEventListener('click', () => {
    filterDialog?.close();
  });
});

const selectFilter = (group) => {
  const filterDialog = document.querySelector('#filter-dialog');
  categoryStore.addFilterGroup(group);
  filterDialog?.close();
};
</script>
