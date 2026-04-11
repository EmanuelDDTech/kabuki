<template>
  <section class="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl"></div>
      <div class="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"></div>
    </div>

    <div class="mx-auto w-full max-w-7xl space-y-6">
      <RouterLink
        :to="{ name: 'expansion', params: { setId: card?.set?.id || 'me02.5' } }"
        class="inline-flex items-center gap-2 rounded-full border border-shori-gray-4/70 bg-shori-gray-1/80 px-4 py-2 text-sm font-semibold text-shori-gray-12 shadow-lg shadow-shori-gray-8/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-shori-gray-6 hover:bg-shori-gray-2"
      >
        <LeftArrow class="w-5" />
        <span>Volver</span>
      </RouterLink>

      <div
        v-if="card"
        class="overflow-hidden rounded-3xl border border-shori-gray-4/60 bg-shori-gray-2/85 shadow-2xl shadow-shori-gray-8/20 backdrop-blur-xl"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <aside
            class="relative border-b border-shori-gray-4/40 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_55%)]"
            ></div>
            <div class="relative space-y-6 lg:sticky lg:top-8">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200"
                >
                  {{ card.category || 'Carta' }}
                </span>
                <span
                  class="rounded-full bg-shori-gray-3/80 px-3 py-1 text-xs font-semibold text-shori-gray-11"
                >
                  #{{ card.localId }}
                </span>
                <span
                  v-if="card.hp"
                  class="rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-100"
                >
                  HP {{ card.hp }}
                </span>
              </div>

              <div
                class="absolute -inset-x-4 top-20 -z-10 h-52 rounded-full bg-gradient-to-r from-emerald-300/20 via-cyan-300/15 to-amber-200/20 blur-2xl"
              ></div>

              <div class="relative mx-auto w-full max-w-sm">
                <div
                  class="absolute inset-0 rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/25 to-transparent blur-[1px]"
                ></div>
                <img
                  :src="card.image"
                  :alt="card.name"
                  class="relative w-full rounded-[2rem] border border-white/15 shadow-[0_28px_80px_-26px_rgba(15,23,42,0.8)]"
                />
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div
                  class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-3 text-center"
                >
                  <p class="text-[11px] uppercase tracking-widest text-shori-gray-10">Rareza</p>
                  <p class="mt-1 text-sm font-semibold text-shori-gray-12">
                    {{ card.rarity || 'N/A' }}
                  </p>
                </div>
                <div
                  class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-3 text-center"
                >
                  <p class="text-[11px] uppercase tracking-widest text-shori-gray-10">Stage</p>
                  <p class="mt-1 text-sm font-semibold text-shori-gray-12">
                    {{ card.stage || 'N/A' }}
                  </p>
                </div>
                <div
                  class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-3 text-center"
                >
                  <p class="text-[11px] uppercase tracking-widest text-shori-gray-10">Retreat</p>
                  <p class="mt-1 text-sm font-semibold text-shori-gray-12">
                    {{ card.retreat ?? 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main class="space-y-6 p-6 text-shori-gray-12 sm:p-8 lg:col-span-7">
            <header class="space-y-4 border-b border-shori-gray-4/40 pb-6">
              <div>
                <h1 class="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  {{ card.name }}
                </h1>
                <p class="mt-2 text-base text-shori-gray-10 sm:text-lg">
                  {{ card.set?.name || 'Expansion desconocida' }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="type in types"
                  :key="type"
                  class="rounded-full border border-emerald-300/30 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100"
                >
                  {{ type }}
                </span>
                <span
                  class="rounded-full border border-shori-gray-5/60 bg-shori-gray-3/70 px-3 py-1 text-xs font-semibold text-shori-gray-11"
                >
                  Reg. {{ card.regulationMark || 'N/A' }}
                </span>
                <span
                  class="rounded-full border border-shori-gray-5/60 bg-shori-gray-3/70 px-3 py-1 text-xs font-semibold text-shori-gray-11"
                >
                  Set {{ card.set?.id || 'N/A' }}
                </span>
              </div>
            </header>

            <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-4">
                <p class="text-xs uppercase tracking-[0.15em] text-shori-gray-10">
                  Ediciones activas
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="variant in variants"
                    :key="variant"
                    class="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100"
                  >
                    {{ variant }}
                  </span>
                  <span
                    v-if="!variants.length"
                    class="rounded-full bg-shori-gray-3/70 px-3 py-1 text-xs font-semibold text-shori-gray-11"
                  >
                    Sin variantes activas
                  </span>
                </div>
              </article>

              <article class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-4">
                <p class="text-xs uppercase tracking-[0.15em] text-shori-gray-10">Estado legal</p>
                <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div class="rounded-xl bg-shori-gray-3/70 px-3 py-2">
                    <p class="text-xs text-shori-gray-10">Standard</p>
                    <p
                      class="font-semibold"
                      :class="card.legal?.standard ? 'text-emerald-200' : 'text-rose-200'"
                    >
                      {{ card.legal?.standard ? 'Permitida' : 'No permitida' }}
                    </p>
                  </div>
                  <div class="rounded-xl bg-shori-gray-3/70 px-3 py-2">
                    <p class="text-xs text-shori-gray-10">Expanded</p>
                    <p
                      class="font-semibold"
                      :class="card.legal?.expanded ? 'text-emerald-200' : 'text-rose-200'"
                    >
                      {{ card.legal?.expanded ? 'Permitida' : 'No permitida' }}
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-5">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-lg font-bold">Ataques</h2>
                <span class="text-xs font-semibold uppercase tracking-widest text-shori-gray-10">
                  {{ attacks.length }} total
                </span>
              </div>

              <div v-if="attacks.length" class="space-y-3">
                <article
                  v-for="attack in attacks"
                  :key="attack.name"
                  class="rounded-xl border border-shori-gray-4/40 bg-shori-gray-2/80 p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-base font-semibold">{{ attack.name }}</p>
                      <p
                        v-if="attack.effect"
                        class="mt-1 text-sm leading-relaxed text-shori-gray-10"
                      >
                        {{ attack.effect }}
                      </p>
                    </div>
                    <span
                      class="rounded-lg bg-emerald-300/15 px-2 py-1 text-sm font-bold text-emerald-100"
                    >
                      {{ attack.damage || 0 }}
                    </span>
                  </div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      v-for="cost in attack.cost || []"
                      :key="`${attack.name}-${cost}`"
                      class="rounded-full bg-shori-gray-3 px-2 py-1 text-xs font-medium text-shori-gray-11"
                    >
                      {{ cost }}
                    </span>
                  </div>
                </article>
              </div>

              <p v-else class="rounded-xl bg-shori-gray-3/70 px-4 py-3 text-sm text-shori-gray-11">
                No hay ataques registrados para esta carta.
              </p>
            </section>

            <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-4">
                <h2 class="text-sm font-semibold uppercase tracking-[0.15em] text-shori-gray-10">
                  Cardmarket
                </h2>
                <div class="mt-3 space-y-2 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-shori-gray-10">Promedio</span>
                    <span class="font-semibold">{{
                      formatCurrency(cardmarket?.avg, cardmarket?.unit)
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-shori-gray-10">Minimo</span>
                    <span class="font-semibold">{{
                      formatCurrency(cardmarket?.low, cardmarket?.unit)
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-shori-gray-10">Tendencia</span>
                    <span class="font-semibold">{{
                      formatCurrency(cardmarket?.trend, cardmarket?.unit)
                    }}</span>
                  </div>
                </div>
              </article>

              <article class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-4">
                <h2 class="text-sm font-semibold uppercase tracking-[0.15em] text-shori-gray-10">
                  Detalles
                </h2>
                <dl class="mt-3 space-y-2 text-sm">
                  <div class="flex items-center justify-between gap-3">
                    <dt class="text-shori-gray-10">Ilustrador</dt>
                    <dd class="text-right font-semibold">{{ card.illustrator || 'N/A' }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <dt class="text-shori-gray-10">Actualizada</dt>
                    <dd class="text-right font-semibold">{{ updatedLabel }}</dd>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <dt class="text-shori-gray-10">Variantes detalladas</dt>
                    <dd class="text-right font-semibold">{{ variantsDetailed.length || 0 }}</dd>
                  </div>
                </dl>
              </article>
            </section>

            <section
              v-if="variantsDetailed.length"
              class="rounded-2xl border border-shori-gray-4/50 bg-shori-gray-1/70 p-4"
            >
              <h2 class="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-shori-gray-10">
                Variantes detalladas
              </h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="variant in variantsDetailed"
                  :key="`${variant.type}-${variant.size}`"
                  class="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100"
                >
                  {{ variant.type }} / {{ variant.size }}
                </span>
              </div>
            </section>
          </main>
        </div>
      </div>

      <div
        v-else
        class="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-shori-gray-5 bg-shori-gray-2/70 px-6 text-center"
      >
        <div class="text-5xl">🔍</div>
        <p class="mt-3 text-2xl font-light text-shori-gray-12">Carta no encontrada</p>
        <p class="mt-1 max-w-sm text-sm text-shori-gray-10">
          Verifica el identificador o vuelve al listado para explorar otra expansion.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onUnmounted, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCardStore } from '../stores/card';

import LeftArrow from '@/modules/icons/ArrowLeft.vue';

type CardmarketPricing = {
  unit?: string;
  avg?: number;
  low?: number;
  trend?: number;
};

const route = useRoute();
const cardId = shallowRef<string | null>(null);

const cardStore = useCardStore();

const card = computed(() => cardStore.cardData);
const attacks = computed(() => card.value?.attacks ?? []);
const types = computed(() => card.value?.types ?? []);
const variantsDetailed = computed(() => card.value?.variants_detailed ?? []);
const variants = computed(() => {
  const currentVariants = card.value?.variants;
  if (!currentVariants) return [];

  return Object.entries(currentVariants)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => key);
});

const cardmarket = computed<CardmarketPricing | null>(
  () => card.value?.pricing?.cardmarket ?? null,
);

const updatedLabel = computed(() => {
  const rawDate = card.value?.updated;
  if (!rawDate) return 'N/A';

  return new Date(rawDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

const formatCurrency = (value?: number, unit = 'EUR') => {
  if (typeof value !== 'number') return 'N/A';

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: unit,
    minimumFractionDigits: 2,
  }).format(value);
};

watch(
  () => route.params.cardId,
  (param) => {
    cardId.value = Array.isArray(param) ? param[0] : (param ?? null);
    cardStore.getCardById(cardId.value);
  },
  {
    immediate: true,
  },
);

onUnmounted(() => {
  cardStore.clearCardInfo();
});
</script>
