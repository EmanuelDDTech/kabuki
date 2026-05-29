<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useFilterCategoryStore } from '@/modules/filter/store/filterCategory';

import OrderSelect from './OrderSelect.vue';
import FilterOptionsModal from './FilterOptionsModal.vue';
import ChevronDownIcon from '@/modules/common/icons/ChevronDownIcon.vue';

const filters = useFilterCategoryStore();

const priceRange = ref();
const showAdvancedFilters = ref(true);
const selectedFilterGroupSlug = ref<string | null>(null);

const selectedFilterGroup = computed(() => {
  if (!selectedFilterGroupSlug.value) return null;

  return (
    filters.filters.find((group) => group.filter_group.slug === selectedFilterGroupSlug.value)
      ?.filter_group ?? null
  );
});

const selectedFiltersCount = computed(() => {
  const totalByGroup = Object.values(filters.activeFilters).reduce(
    (acc, current) => acc + current.length,
    0,
  );

  return totalByGroup + (filters.existenceOnly ? 1 : 0) + (filters.activePriceFilter ? 1 : 0);
});

const setPriceRange = async (event: any) => {
  await filters.setPriceRange(event);
};

const clearAllFilters = async () => {
  await filters.clearAllFilters();
  priceRange.value?.update([filters.minPrice, filters.maxPrice]);
};

const openFilterGroupModal = (groupSlug: string) => {
  selectedFilterGroupSlug.value = groupSlug;
};

const closeFilterGroupModal = () => {
  selectedFilterGroupSlug.value = null;
};

const toggleModalFilterOption = (valueSlug: string) => {
  if (!selectedFilterGroup.value) return;

  filters.updateFilters(selectedFilterGroup.value.slug, valueSlug);
};

const getGroupSelectedCount = (groupSlug: string) => {
  return filters.activeFilters[groupSlug]?.length ?? 0;
};

watch(
  () => [filters.minPrice, filters.maxPrice],
  ([min, max]) => {
    priceRange.value?.update([min, max]);
  },
  { immediate: true },
);
</script>

<template>
  <section
    class="mb-6 rounded-2xl border border-shori-gray-5 bg-shori-gray-1/80 p-4 shadow-[0_10px_32px_rgba(17,24,39,0.08)] backdrop-blur-sm"
  >
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
      <div class="flex items-center gap-6">
        <div class="space-y-1">
          <h2 class="text-base font-bold text-shori-gray-12">Filtros</h2>
          <p class="text-sm text-shori-gray-10">
            Refina tu busqueda para encontrar productos mas rapido.
          </p>
        </div>

        <div
          class="inline-flex items-center rounded-xl border border-shori-gray-5 bg-shori-gray-1 px-3 py-2 text-xs font-semibold text-shori-gray-10"
        >
          Filtros activos: {{ selectedFiltersCount }}
        </div>
      </div>

      <div class="flex items-center gap-2 self-start lg:self-auto">
        <button
          v-if="filters.hasSelectedFilters"
          @click="clearAllFilters"
          class="rounded-lg border border-shori-green-8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-shori-green-9 transition-colors hover:bg-shori-green-3"
        >
          Limpiar
        </button>
        <button
          @click="showAdvancedFilters = !showAdvancedFilters"
          class="inline-flex items-center justify-end gap-1.5 rounded-lg border border-shori-gray-6 px-3 py-1.5 text-xs font-semibold uppercase text-shori-gray-12 bg-shori-gray-3 transition-all"
        >
          {{ showAdvancedFilters ? 'Ocultar opciones' : 'Ver opciones' }}
          <ChevronDownIcon
            class="h-4 w-4 transition-transform"
            :class="showAdvancedFilters ? 'rotate-180' : ''"
          />
        </button>
      </div>
    </div>

    <div
      class="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
      :class="
        showAdvancedFilters ? 'mt-0 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
      "
    >
      <div class="overflow-hidden">
        <div class="flex flex-wrap items-start gap-3 rounded-xl bg-shori-gray-surface p-3 md:gap-4">
          <div class="min-w-[190px] max-w-[240px] flex-1 h-full">
            <p class="mb-2 text-lg font-semibold leading-none text-shori-gray-12">Ordenar por</p>
            <OrderSelect :order="filters.order" @update:order="filters.order = $event" />
          </div>

          <div class="min-w-[220px] flex flex-col">
            <label
              for="existenceOnlyTop"
              class="mb-2 text-lg font-semibold leading-none text-shori-gray-12"
            >
              Inventario
            </label>
            <div class="flex h-[38px] items-center gap-2">
              <span class="text-sm text-shori-gray-11">Solo con existencia</span>
              <label
                for="existenceOnlyTop"
                class="relative inline-flex cursor-pointer items-center"
              >
                <input
                  id="existenceOnlyTop"
                  v-model="filters.existenceOnly"
                  type="checkbox"
                  class="peer sr-only"
                />
                <span
                  class="h-6 w-11 rounded-full bg-shori-gray-5 transition peer-checked:bg-shori-green-9 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-shori-gray-contrast after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5"
                ></span>
              </label>
            </div>
          </div>

          <div class="min-w-[200px] w-full max-w-none lg:max-w-[250px]">
            <p class="mb-2 text-lg font-semibold leading-none text-shori-gray-12">Precio</p>
            <Vueform class="pl-6 pr-6">
              <SliderElement
                ref="priceRange"
                name="price"
                class="mt-7"
                :format="{
                  prefix: '$',
                  thousand: ' ',
                }"
                :step="100"
                :min="0"
                :max="filters.getMaxPrice()"
                :default="[filters.minPrice, filters.maxPrice]"
                @change="setPriceRange"
              />
            </Vueform>
          </div>

          <div
            v-for="filterGroup in filters.filters"
            :key="filterGroup.id"
            class="min-w-[210px] flex-1 pt-8"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl border border-shori-gray-5 bg-shori-gray-1/60 px-3 py-2.5 text-left transition-colors hover:bg-shori-gray-2"
              @click="openFilterGroupModal(filterGroup.filter_group.slug)"
            >
              <div class="flex min-w-0 items-center gap-2">
                <span class="truncate text-sm font-semibold text-shori-gray-12">
                  {{ filterGroup.filter_group.name }}
                </span>
                <span
                  v-if="getGroupSelectedCount(filterGroup.filter_group.slug) > 0"
                  class="rounded-full bg-shori-green-3 px-2 py-0.5 text-[11px] font-semibold text-shori-green-10"
                >
                  {{ getGroupSelectedCount(filterGroup.filter_group.slug) }}
                </span>
              </div>
              <ChevronDownIcon class="h-5 w-5 shrink-0 text-shori-gray-9" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <FilterOptionsModal
      :open="Boolean(selectedFilterGroup)"
      :title="selectedFilterGroup?.name ?? ''"
      :options="selectedFilterGroup?.filter_values ?? []"
      :selected-values="
        selectedFilterGroup ? (filters.activeFilters[selectedFilterGroup.slug] ?? []) : []
      "
      @close="closeFilterGroupModal"
      @toggle-option="toggleModalFilterOption"
    />

    <!-- <div
      v-show="showAdvancedFilters"
      class="mt-4 space-y-3 rounded-xl border border-shori-gray-5 bg-shori-gray-surface p-4"
    >
      <div v-if="filters.isLoading">
        <FiltersSkeleton v-for="i in 2" :key="i" />
      </div>

      <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3"></div>
    </div> -->
  </section>
</template>
