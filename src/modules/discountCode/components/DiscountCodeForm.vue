<script lang="ts" setup>
import ArrowLeft from '@/modules/icons/ArrowLeft.vue';
import { useDiscountCodeStore } from '../stores/discountCode';
import { DiscountType } from '../interfaces/discountCode.interface';
import { inject, onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  id?: number;
}

const props = defineProps<Props>();
const toast: any = inject('toast');
const router = useRouter();

const discountCodeStore = useDiscountCodeStore();

const discountTypeOptions = Object.values(DiscountType).map((value) => ({
  label: value.replace(/_/g, ' ').toUpperCase(), // Formatea el texto
  value,
}));

onBeforeMount(() => {
  if (!props.id) return;
  discountCodeStore.getDiscountCodeById(props.id);
});

onUnmounted(() => {
  discountCodeStore.cleanDiscountCode();
});

const handleSubmit = async ({ expires_at, ...formData }) => {
  try {
    if (discountCodeStore.discountCode.id === 0) {
      await discountCodeStore.createDiscountCode();
      toast.open({
        message: 'Campaña creado correctamente',
        type: 'success',
      });

      setTimeout(() => {
        router.push({ name: 'adminDiscountCodes' });
      }, 1000);
    } else {
      const data = await discountCodeStore.UpdateDiscountCode();
      toast.open({
        message: data.msg,
        type: 'success',
      });
      setTimeout(() => {
        router.push({ name: 'adminDiscountCodes' });
      }, 1000);
    }
  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto min-h-screen">
    <RouterLink
      :to="{ name: 'adminDiscountCodes' }"
      class="inline-block mb-4 text-red-700 font-medium rounded-lg text-sm"
    >
      <div class="flex gap-2 items-center justify-start">
        <ArrowLeft class="w-6" />
        <p>Volver</p>
      </div>
    </RouterLink>

    <h2 class="text-2xl font-semibold mb-6">
      {{ id ? 'Actualizar Código de Descuento' : 'Crear Código de Descuento' }}
    </h2>

    <FormKit
      id="createDiscountCode"
      type="form"
      :actions="false"
      incomplete-message="No se pudo crear el código de descuento, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <div class="flex flex-col gap-4">
        <FormKit
          type="text"
          label="Código"
          name="code"
          placeholder="Nombre del código de descuento"
          validation="required"
          :validation-messages="{
            required: 'El código de descuento es obligatorio',
          }"
          v-model="discountCodeStore.discountCode.code"
        />

        <div class="flex gap-6">
          <div class="flex-1">
            <FormKit
              type="select"
              label="Tipo de código de descuento"
              name="discount_type"
              :options="discountTypeOptions"
              v-model="discountCodeStore.discountCode.discount_type"
            />
          </div>

          <div class="flex-1">
            <FormKit
              type="number"
              label="Valor del descuento"
              name="discount_value"
              min="0"
              placeholder="Valor del código de descuento"
              validation="required"
              :validation-messages="{
                required: 'El valor del código de descuento es obligatorio',
              }"
              v-model="discountCodeStore.discountCode.discount_value"
            />
          </div>
        </div>

        <div class="flex gap-6">
          <div class="flex-1">
            <FormKit
              type="number"
              label="Valor mínimo de compra"
              name="min_purchase"
              min="0"
              placeholder="Valor mínimo de la compra"
              v-model="discountCodeStore.discountCode.min_purchase"
            />
          </div>

          <div class="flex-1">
            <FormKit
              type="number"
              label="Descuento máximo"
              name="max_discount"
              min="0"
              placeholder="Valor máximo del descuento"
              validation="required"
              :validation-messages="{
                required: 'El valor máximo de descuento es obligatorio',
              }"
              v-model="discountCodeStore.discountCode.max_discount"
            />
          </div>
        </div>

        <div class="flex gap-6">
          <div class="flex-1">
            <FormKit
              type="number"
              label="Límite de usos"
              name="usage_limit"
              min="0"
              placeholder="Límite de usos del código de descuento"
              validation="required"
              :validation-messages="{
                required: 'El límite de usos es obligatorio',
              }"
              v-model="discountCodeStore.discountCode.usage_limit"
            />
          </div>

          <div class="flex-1">
            <FormKit
              type="number"
              label="Veces usado"
              name="times_used"
              min="0"
              placeholder="N° de veces que el código se ha usado"
              validation="required"
              :validation-messages="{
                required: 'El valor máximo de descuento es obligatorio',
              }"
              v-model="discountCodeStore.discountCode.times_used"
            />
          </div>
        </div>

        <div class="max-w-60">
          <FormKit
            type="date"
            label="Fecha de expiración"
            name="expires_at"
            validation="required"
            :validation-messages="{
              required: 'La fecha de expiración es obligatoria',
            }"
            value-format="full"
            v-model="discountCodeStore.expires_at_ISO"
          />
        </div>

        <FormKit type="submit">
          {{ !id ? 'Crear Código de Descuento' : 'Actualizar Código de Descuento' }}
        </FormKit>
      </div>
    </FormKit>
  </div>
</template>
