<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import GeneralButton from '@/modules/common/components/GeneralButton.vue';

type ProductCategory = 'pokemon' | 'magic' | 'riftbound' | 'otros';

const DEFAULT_PRODUCTS_CATEGORY: ProductCategory = 'pokemon';

const categories: Array<{ slug: ProductCategory; title: string; caption: string }> = [
  {
    slug: 'pokemon',
    title: 'Pokemon',
    caption: 'Catalogo principal de TCG y sellado.',
  },
  {
    slug: 'magic',
    title: 'Magic',
    caption: 'Sobres, bundles y producto premium.',
  },
  {
    slug: 'riftbound',
    title: 'Riftbound',
    caption: 'Decks, displays y lanzamientos nuevos.',
  },
  {
    slug: 'otros',
    title: 'Otros',
    caption: 'Juegos de mesa y categorias adicionales.',
  },
];

// const route = useRoute();

// const activeCategory = computed<ProductCategory>(() => {
//   const param = Array.isArray(route.params.category)
//     ? route.params.category[0]
//     : route.params.category;

//   if (param === 'pokemon' || param === 'magic' || param === 'riftbound' || param === 'otros') {
//     return param;
//   }

//   return DEFAULT_PRODUCTS_CATEGORY;
// });
</script>

<template>
  <main
    class="admin-category min-h-[calc(100vh-120px)] mx-4 mt-6 rounded-lg border border-shori-gray-6 bg-shori-gray-1 p-4 shadow sm:p-6 xl:p-8"
  >
    <section
      class="admin-category__shell mx-auto w-full max-w-4xl rounded-2xl border border-shori-gray-6 bg-shori-gray-2/70 p-4 shadow-sm backdrop-blur-sm sm:p-6"
    >
      <!-- <p class="admin-category__eyebrow m-0 text-xs uppercase tracking-[0.08em] text-shori-gray-10">
        Panel de administracion
      </p> -->
      <h1
        class="admin-category__title mt-2 text-2xl font-semibold leading-tight text-shori-gray-12 sm:text-3xl"
      >
        Selecciona categoría de productos
      </h1>
      <p class="admin-category__description mt-2 text-sm text-shori-gray-11 sm:text-base">
        Escoge una categoría antes de abrir la tabla de gestión.
      </p>

      <TransitionGroup name="admin-category-card" tag="ul" class="admin-category__grid" appear>
        <li
          v-for="(category, index) in categories"
          :key="category.slug"
          :style="{ '--delay': `${index * 80}ms` }"
        >
          <RouterLink
            :to="{ name: 'adminProductsByCategory', params: { category: category.slug } }"
            class="admin-category__link group block rounded-xl border border-shori-gray-6 bg-shori-gray-1 p-4 no-underline transition-all duration-200"
            :class="'hover:-translate-y-0.5 hover:border-shori-green-7 hover:bg-shori-gray-2'"
          >
            <span
              class="admin-category__name block text-base font-semibold"
              :class="'text-shori-gray-12'"
            >
              {{ category.title }}
            </span>
            <span class="admin-category__caption mt-1 block text-sm text-shori-gray-10">
              {{ category.caption }}
            </span>
          </RouterLink>
        </li>
      </TransitionGroup>

      <div class="admin-category__actions mt-5 flex flex-wrap justify-between gap-3">
        <RouterLink :to="{ name: 'adminDashboard' }" class="no-underline">
          <GeneralButton text="Volver al dashboard" type="secondary" size="medium" />
        </RouterLink>

        <RouterLink
          :to="{ name: 'adminProductsByCategory', params: { category: DEFAULT_PRODUCTS_CATEGORY } }"
          class="no-underline"
        >
          <GeneralButton
            :text="`Continuar con ${DEFAULT_PRODUCTS_CATEGORY}`"
            type="primary"
            size="medium"
          />
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-category {
  animation: admin-shell-rise 380ms cubic-bezier(0.18, 0.84, 0.35, 1) both;
}

.admin-category__shell {
  background: radial-gradient(
      circle at 85% 15%,
      color-mix(in srgb, var(--green-4) 45%, transparent),
      transparent 42%
    ),
    linear-gradient(140deg, var(--gray-1), var(--gray-2));
}

.admin-category__grid {
  margin: 0;
  margin-top: 1.1rem;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.admin-category__link:focus-visible {
  outline: 2px solid var(--green-8);
  outline-offset: 2px;
}

.admin-category-card-enter-active,
.admin-category-card-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
  transition-delay: var(--delay, 0ms);
}

.admin-category-card-enter-from,
.admin-category-card-leave-to {
  opacity: 0;
  transform: translateY(9px) scale(0.99);
}

@keyframes admin-shell-rise {
  from {
    opacity: 0;
    transform: translateY(7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .admin-category__grid {
    grid-template-columns: 1fr;
  }

  .admin-category__actions {
    justify-content: stretch;
  }
}
</style>
