<template>
  <div class="max-w-2xl mx-auto">
    <RouterLink
      :to="{ name: 'adminBanners' }"
      class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <ArrowLeft class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <h2 class="text-2xl font-semibold mb-6">
      {{ id ? 'Actualizar Banner' : 'Crear Banner' }}
    </h2>

    <FormKit
      id="createBannerForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear el banner, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre"
        name="name"
        placeholder="Nombre del banner"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="banner.name"
      />

      <FormKit
        type="file"
        name="image"
        label="Imagen"
        accept=".jpg, .webp, .png, .avif"
        multiple="true"
        @change="banner.saveImage"
      />

      <div v-if="banner.isImageUploaded || banner.url !== ''">
        <p class="font-black mt-4">Imagen del banner:</p>
        <img
          :src="banner.isImageUploaded ? banner.newUrl : banner.url"
          alt="Nueva Imagen Producto"
          class="w-40 h-40 object-cover rounded-lg my-3"
        />
      </div>

      <FormKit
        type="text"
        label="Redireccionar"
        name="redirect"
        placeholder="Link de redirección"
        validation="required"
        :validation-messages="{
          required: 'Este campo es obligatorio',
        }"
        v-model="banner.redirect"
      />

      <FormKit
        type="number"
        label="Orden"
        name="order"
        placeholder="Orden del banner"
        validation="required"
        :validation-messages="{
          required: 'El orden es obligatorio',
        }"
        v-model="banner.order"
      />

      <div class="flex justify-between">
        <FormKit
          type="date"
          label="Inicio"
          name="start"
          help="Día de inicio del banner"
          validation="required"
          :validation-messages="{
            required: 'La fecha de inicio es obligatoria',
          }"
          value-format="full"
          v-model="banner.startISO"
        />

        <FormKit
          type="date"
          label="Termino"
          name="end"
          help="Día de termino del banner"
          value-format="full"
          v-model="banner.endISO"
        />
      </div>

      <FormKit type="submit">
        {{ !id ? 'Crear Banner' : 'Actualizar Banner' }}
      </FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import { displayYYYYMMDD } from '@/helpers/date';
import { useBannerStore } from '../stores/banner';
import { inject, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const banner = useBannerStore();
// const { onFileChange } = useImage();

const toast: any = inject('toast');
const router = useRouter();

const date = displayYYYYMMDD(new Date());

onMounted(() => {
  if (!props.id) return;
  banner.findBanner(props.id);
});

onUnmounted(async () => {
  if (banner.isImageUploaded) {
    await banner.deleteBannerImage(banner.newUrl);
  }
  banner.cleanBanner();
});

const handleSubmit = async ({ start, end, ...formData }) => {
  // banner.setStartDate(start);
  // banner.setEndDate(end);

  try {
    if (banner.id === 0) {
      const data = await banner.create();

      banner.cleanBanner();

      toast.open({
        message: 'Banner creado correctamente',
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminBanners' });
      }, 1000);
    } else {
      const data = await banner.update();
      banner.cleanBanner();

      toast.open({
        message: data.msg,
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminBanners' });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>
