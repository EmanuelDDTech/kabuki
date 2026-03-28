<template>
  <div>
    <TopNavBar />
    <RouterView class="mt-10 min-h-screen" />
    <GeneralFooter class="px-3" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useHead } from '@unhead/vue';
import TopNavBar from '../components/TopNavBar.vue';
import GeneralFooter from '../components/GeneralFooter.vue';

useHead({
  title: 'ShoriKameCards',
  meta: [
    // Meta SEO
    {
      name: 'description',
      content:
        '🃏 Encuentra las mejores cartas de Pokémon TCG al mejor precio. Compra sobres, decks y cartas individuales originales con envío rápido y seguro. ¡Construye tu mazo ganador y atrapa a tus Pokémon favoritos hoy mismo! 🚀',
    },
    {
      name: 'keywords',
      content:
        'cartas Pokémon, Pokémon TCG, sobres Pokémon, mazos Pokémon, comprar cartas Pokémon, cartas coleccionables',
    },
    { name: 'author', content: 'ShoriKameCards' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph (Facebook, WhatsApp)
    { property: 'og:title', content: 'ShoriKameCards' },
    {
      property: 'og:description',
      content:
        '🃏 Encuentra las mejores cartas de Pokémon TCG al mejor precio. Compra sobres, decks y cartas individuales originales con envío rápido y seguro. ¡Construye tu mazo ganador y atrapa a tus Pokémon favoritos hoy mismo! 🚀',
    },
    {
      property: 'og:image',
      content:
        'https://firebasestorage.googleapis.com/v0/b/shorikame-7d2b4.appspot.com/o/assets%2Fshorikame-logo-edited.webp?alt=media&token=b516cc10-fb19-4d28-a80c-4ba598c10d92',
    },
    { property: 'og:url', content: 'https://shorikamecards.com/' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'ShoriKameCards' },
  ],
});
</script>

<style>
#static-footer {
  display: block;
}
</style>
