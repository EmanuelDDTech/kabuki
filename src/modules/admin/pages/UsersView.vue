<script lang="ts" setup>
import SwitchButton from '@/modules/common/components/SwitchButton.vue';
import InfoIcon from '@/modules/common/icons/InfoIcon.vue';
import { useUsersStore } from '@/modules/user/stores/users';
import { onMounted } from 'vue';

const users = useUsersStore();

onMounted(() => {
  users.getUsers();
});

function toggleValue(userId: number) {
  console.log('Toggle value');
}
</script>

<template>
  <main class="mt-6 mx-4 p-4 sm:p-6 xl:p-8 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Usuarios</h1>

    <section class="flex h-full flex-col justify-center">
      <div class="mx-auto w-full rounded-sm flex flex-col">
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead class="shadow bg-gray-50 text-xs font-semibold uppercase text-gray-400">
              <tr>
                <th>
                  <div class="text-left font-semibold">ID</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Nombre</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Email</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Verificado</div>
                </th>
                <th class="p-2">
                  <div class="text-left font-semibold">Admin</div>
                </th>
                <th class="p-2">
                  <div class="text-center font-semibold">Acciones</div>
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 text-sm shadow"
              v-for="user in users.userList"
              :key="user.id"
            >
              <tr>
                <td class="p-2">
                  <div>{{ user.id }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left">{{ user.email }}</div>
                </td>
                <td class="p-2">
                  <div class="text-base text-left font-medium text-gray-800">
                    {{ user.verified ? 'Simón' : 'Nel' }}
                  </div>
                </td>
                <td class="p-2">
                  <SwitchButton
                    :id="user.id"
                    :value="Boolean(user.isAdmin)"
                    :disabled="true"
                    @toggle="toggleValue(user.id)"
                  />
                </td>
                <td class="p-2">
                  <div class="flex justify-center">
                    <RouterLink :to="{ name: 'adminUser', params: { userId: user.id } }">
                      <InfoIcon
                        class="h-8 w-8 p-1 rounded-full hover:bg-gray-100 hover:text-blue-600"
                      />
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>
