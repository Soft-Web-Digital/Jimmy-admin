<template>
  <v-container>
  <v-btn color="" :to="{name:'RolesandPermissions'}" class="my-3"><v-icon left class="mr-4">mdi-arrow-left</v-icon> Back</v-btn>
    <v-card class="pa-6">
    
      <h2>Create role</h2>
      <v-row align="start">
        <v-col cols="12" sm="6">
          <v-form class="mt-8 py-8">
            <v-text-field
              v-model="role.name"
              label="Name"
              variant="outlined"
            ></v-text-field>
            <v-textarea
              v-model="role.description"
              label="Description"
              variant="outlined"
            ></v-textarea>
            <!-- <v-autocomplete
            v-model="role.permission_id"
            variant="outlined"
            label="Permissions"
            item-title="name"
            multiple
            item-value="id"
            :items="permissions"
          ></v-autocomplete> -->
            <v-btn
              :loading="loading"
              color="secondary"
              block
              :disabled="checkedPermission"
              @click="edit == true  ? updateRole(role) : createRole(role)"
              >Submit</v-btn
            >
          </v-form>
        </v-col>

        <v-col class="mt-12" cols="12" sm="6">
          <h3>Select permissions</h3>
          <v-layout
            v-if="loading == true"
            class="align-center justify-center w-100 my-5"
          >
            <v-progress-circular indeterminate></v-progress-circular>
          </v-layout>
          <v-checkbox
            density="compact"
            v-else
            :label="permission.description"
            v-for="(permission, index) in permissions"
            :key="index"
            class="py-0 my-0"
            @click="select_permission(permission.id)"
            v-model="permission.id"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import {useNotification} from '@kyvg/vue3-notification'
import { useRolesPermissionsStore } from "../../stores/roles-permissions";
const { getAllRoles, getAllPermissions, createRole, updateRole, deleteRole } =
  useRolesPermissionsStore();
const { notify } = useNotification();
const { roles, permissions, loading, dialog, role } = storeToRefs(
  useRolesPermissionsStore()
);

// Check if any permission in the arrays of permissions has been checked
const checkPermission = ref(false);
const checkedPermission = computed(() => {
  const checked = !permissions.value.some((permission: any) => permission.id === true)
  if(checked) {
    return true
  } else {
    return false
  }
})

const select_permission = (id:never) => {
  role.value.permission_id.push(id)
}

onMounted(async () => {
  await getAllRoles();
  await getAllPermissions();
});
</script>

<style scoped></style>
