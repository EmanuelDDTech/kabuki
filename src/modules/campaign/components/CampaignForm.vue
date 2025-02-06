<template>
  <div class="max-w-2xl mx-auto min-h-screen">
    <RouterLink
      :to="{ name: 'adminCampaigns' }"
      class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <ArrowLeft class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>
    <h2 class="text-2xl font-semibold mb-6">
      {{ id ? 'Actualizar Campaña' : 'Crear Campaña' }}
    </h2>

    <FormKit
      id="createCampaignForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear la campaña, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <FormKit
        type="text"
        label="Nombre"
        name="name"
        placeholder="Nombre de la campaña"
        validation="required"
        :validation-messages="{
          required: 'El Nombre es obligatorio',
        }"
        v-model="campaign.campaign.name"
      />

      <FormKit
        type="select"
        label="Tipo de campaña"
        name="campaign_type_id"
        placeholder="Selecciona un tipo de campaña"
        :options="[
          { label: 'Preventa', value: '1' },
          { label: 'Oferta', value: '3' },
        ]"
        validation="required"
        :validation-messages="{
          required: 'El tipo de campaña es obligatorio',
        }"
        v-model="campaign.campaign.campaign_type_id"
      />

      <div class="flex justify-between">
        <FormKit
          type="date"
          label="Inicio"
          name="from"
          validation="required"
          :validation-messages="{
            required: 'La fecha de inicio es obligatoria',
          }"
          value-format="full"
          v-model="campaign.startISO"
        />

        <FormKit
          type="date"
          label="Termino"
          name="to"
          validation="required"
          :validation-messages="{
            required: 'La fecha de termino es obligatoria',
          }"
          value-format="full"
          v-model="campaign.endISO"
        />
      </div>

      <div class="relative mt-3">
        <h2 class="text-xl font-bold mb-2">Productos de la campaña</h2>
        <FormKit
          type="search"
          placeholder="Buscar..."
          label="Añadir producto"
          v-model="product.searchQuery"
        />

        <div
          v-if="product.searchedProducts.length > 0"
          class="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2"
        >
          <ul class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <li
              v-for="product in product.searchedProducts"
              :key="product.id"
              @click="addProduct(product)"
              class="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition flex flex-col items-center"
            >
              <img
                :src="product.product_galleries[0].url"
                :alt="product.name"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <span class="text-sm text-gray-700 mt-2 text-center">{{ product.name }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-3">
        <CampaignProductCard
          v-for="campaignProduct in campaign.campaignProducts"
          :key="campaignProduct.product.id"
          :campaignProduct="campaignProduct"
          @edit-price="editPrice"
          @delete="deleteProduct(campaignProduct)"
        />
      </div>

      <FormKit type="submit">
        {{ !id ? 'Crear Campaña' : 'Actualizar Campaña' }}
      </FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import { displayYYYYMMDD } from '@/helpers/date';
import { useBannerStore } from '@/modules/banner/stores/banner';
import { inject, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/modules/product/stores/product';
import { useCampaignStore } from '../stores/campaign';
import type { Product } from '@/modules/product/interfaces/product.interface';
import CampaignProductCard from './CampaignProductCard.vue';
import Swal from 'sweetalert2';

interface Props {
  id?: number;
}

const props = defineProps<Props>();

const banner = useBannerStore();
const product = useProductStore();
const campaign = useCampaignStore();

// const { onFileChange } = useImage();

const toast: any = inject('toast');
const router = useRouter();

const date = displayYYYYMMDD(new Date());

onMounted(() => {
  if (!props.id) return;
  campaign.findCampaign(props.id);
});

onUnmounted(async () => {
  campaign.cleanCampaign();
});

const handleSubmit = async ({ start, end, ...formData }) => {
  try {
    if (campaign.campaign.id === null) {
      await campaign.createCampaign();

      campaign.cleanCampaign();

      toast.open({
        message: 'Campaña creado correctamente',
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminCampaigns' });
      }, 1000);
    } else {
      const data = await campaign.updateCampaign();
      campaign.cleanCampaign();
      toast.open({
        message: data.msg,
        type: 'success',
      });
      setTimeout(() => {
        router.push({ name: 'adminCampaigns' });
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

const addProduct = async (productData: Product) => {
  await campaign.addProduct(productData);
  toast.open({
    message: 'Producto añadido correctamente',
    type: 'success',
  });
  product.clearSearchQuery();
};

const editPrice = async ({ new_price, product_id }) => {
  await campaign.editProductPrice(new_price, product_id);

  toast.open({
    message: 'Precio editado correctamente',
    type: 'success',
  });
};

const deleteProduct = async (campaignProduct) => {
  Swal.fire({
    title: 'Seguro quieres eliminar este producto?',
    text: 'No podrá ser revertido!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // await banners.deleteBanner(id, image);
        campaign.deleteProduct(campaignProduct);

        toast.open({
          message: 'Producto eliminado correctamente',
          type: 'success',
        });
      } catch (error) {
        toast.open({
          message: error.response.data.msg,
          type: 'error',
        });
      }
    }
  });
};
</script>
